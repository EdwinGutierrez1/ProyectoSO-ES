/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Reto de Experimentación (Retrasos y Fallos)
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React, { useState } from 'react';
import { FaultType, DeviceType } from '../types/io-simulator';
import { SimulatorEngine } from '../services/simulatorEngine';
import { Activity, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ExperimentationLab: React.FC = () => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

  const [selectedFaultDevice, setSelectedFaultDevice] = useState<DeviceType>('PRINTER');
  const [selectedFaultType, setSelectedFaultType] = useState<FaultType>('PAPER_JAM');
  const [latencyMultiplier, setLatencyMultiplier] = useState<number>(3);
  const [activeExpResults, setActiveExpResults] = useState<{
    pollingLostCycles: number;
    pollingResponseTime: number;
    irqLostCycles: number;
    irqResponseTime: number;
    faultType: FaultType;
  } | null>(null);

  const handleRunExperiment = () => {
    const simPolling = new SimulatorEngine('POLLING', lang);
    const simInterrupts = new SimulatorEngine('INTERRUPTS', lang);

    const baseLat = 15 * latencyMultiplier;
    simPolling.setDeviceLatency(selectedFaultDevice, baseLat);
    simInterrupts.setDeviceLatency(selectedFaultDevice, baseLat);

    simPolling.setFault(selectedFaultDevice, selectedFaultType);
    simInterrupts.setFault(selectedFaultDevice, selectedFaultType);

    const reqData = {
      deviceType: selectedFaultDevice,
      operation: 'WRITE' as const,
      payload: isEs
        ? `Datos del experimento de fallo [${selectedFaultType}]`
        : `Fault experiment payload [${selectedFaultType}]`,
      bytes: 2048,
      priority: 'HIGH' as const,
      processName: isEs ? 'Proceso Crítico de Usuario' : 'Critical User Process',
      willFail: selectedFaultType,
    };

    simPolling.addRequest(reqData);
    simInterrupts.addRequest(reqData);

    for (let i = 0; i < 50; i++) {
      simPolling.step();
      simInterrupts.step();
    }

    const pollingLost = simPolling.cpu.pollingCycles;
    const irqLost = simInterrupts.cpu.isrCycles;

    setActiveExpResults({
      pollingLostCycles: pollingLost,
      pollingResponseTime: baseLat,
      irqLostCycles: irqLost,
      irqResponseTime: Math.min(baseLat, 4),
      faultType: selectedFaultType,
    });
  };

  const getAnalysisText = () => {
    if (!activeExpResults) return '';
    const { pollingLostCycles, faultType } = activeExpResults;

    if (isEs) {
      if (faultType === 'PAPER_JAM') {
        return `Ante un atasco de papel con latencia alta, el Sondeo mantuvo a la CPU en un bucle ciego consumiendo ${pollingLostCycles} ciclos en vano. Por el contrario, el controlador con Interrupciones disparó la línea IRQ 7 notificando el error instantáneamente al kernel y permitiendo que la CPU continuara ejecutando tareas de usuario sin pérdida de ciclos.`;
      } else if (faultType === 'BAD_SECTOR') {
        return `El sector defectuoso en disco provocó que el controlador fijara el bit ERROR. En Sondeo, el sistema tardó en enterarse y perdió ${pollingLostCycles} ciclos esperando que el disco respondiera. Con Interrupciones, la rutina de excepción se activó de inmediato (IRQ 14) liberando la cola de E/S.`;
      } else if (faultType === 'PACKET_LOSS') {
        return `La pérdida de paquetes en red evidencia la resiliencia del manejo asíncrono. Mientras el Sondeo acapara el bus de control y bloquea al proceso solicitante, las Interrupciones gestionan el timeout en segundo plano mediante el timer del sistema.`;
      }
      return `El desbordamiento de búfer en teclado genera pulsos de error de hardware manejados de forma limpia por la ISR en modo Interrupciones.`;
    } else {
      if (faultType === 'PAPER_JAM') {
        return `Faced with a high-latency paper jam, Polling kept the CPU trapped in a blind loop wasting ${pollingLostCycles} cycles. Conversely, the interrupt-driven controller asserted IRQ 7 notifying the kernel immediately and allowing the CPU to keep executing user tasks with zero wasted cycles.`;
      } else if (faultType === 'BAD_SECTOR') {
        return `The bad disk sector caused the controller to assert its ERROR bit. Under Polling, the system noticed late and wasted ${pollingLostCycles} cycles waiting for the disk to respond. Under Interrupts, the exception handler fired immediately (IRQ 14), freeing the I/O queue.`;
      } else if (faultType === 'PACKET_LOSS') {
        return `Network packet loss highlights the resilience of asynchronous handling. While Polling monopolizes the control bus and stalls the requesting process, Interrupts handle the timeout in the background via the system timer.`;
      }
      return `Keyboard buffer overflow emits hardware error pulses that are cleanly handled by the ISR under Interrupts mode.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#09843B] dark:text-[#0ca54a] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isEs
              ? 'Reto de Experimentación: Inyección de Retrasos y Fallos de Hardware'
              : 'Experimentation Challenge: Delay & Hardware Fault Injection'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
          {isEs
            ? 'Cumpliendo con el requerimiento del documento del proyecto, este laboratorio permite introducir retrasos artificiales (latencias mecánicas y jitter) y fallos reales de hardware en los dispositivos, contrastando cómo reacciona un sistema basado en Sondeo activo vs uno gobernado por Interrupciones.'
            : 'In line with the project specification, this lab lets you inject artificial delays (mechanical latency and jitter) alongside realistic hardware faults, contrasting how an active Polling system reacts compared to an Interrupt-driven architecture.'}
        </p>

        {/* Experiment Setup Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              {isEs ? '1. Seleccionar Dispositivo' : '1. Select Device'}
            </label>
            <select
              value={selectedFaultDevice}
              onChange={(e) => {
                const dev = e.target.value as DeviceType;
                setSelectedFaultDevice(dev);
                if (dev === 'PRINTER') setSelectedFaultType('PAPER_JAM');
                if (dev === 'DISK') setSelectedFaultType('BAD_SECTOR');
                if (dev === 'NETWORK') setSelectedFaultType('PACKET_LOSS');
                if (dev === 'KEYBOARD') setSelectedFaultType('BUFFER_OVERFLOW');
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] font-medium shadow-2xs"
            >
              <option value="PRINTER">
                {isEs ? 'Impresora (IRQ 7 - Mecánica lenta)' : 'Printer (IRQ 7 - Slow mechanical)'}
              </option>
              <option value="DISK">
                {isEs ? 'Disco Duro (IRQ 14 - Bloques LBA)' : 'Hard Disk (IRQ 14 - LBA Blocks)'}
              </option>
              <option value="NETWORK">
                {isEs ? 'Tarjeta de Red (IRQ 11 - Tramas Ethernet)' : 'Network Card (IRQ 11 - Ethernet Frames)'}
              </option>
              <option value="KEYBOARD">
                {isEs ? 'Teclado (IRQ 1 - Entrada de caracteres)' : 'Keyboard (IRQ 1 - Character Input)'}
              </option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              {isEs ? '2. Fallo a Inyectar' : '2. Fault to Inject'}
            </label>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-[#09843B] dark:text-[#0ca54a] font-bold shadow-2xs">
              {selectedFaultType === 'PAPER_JAM' && (isEs ? 'Atasco de Papel (Paper Jam)' : 'Paper Jam')}
              {selectedFaultType === 'BAD_SECTOR' && (isEs ? 'Sector Defectuoso CRC (Bad Sector)' : 'Bad Sector (CRC Error)')}
              {selectedFaultType === 'PACKET_LOSS' && (isEs ? 'Pérdida de Paquetes / Link Down' : 'Packet Loss / Link Down')}
              {selectedFaultType === 'BUFFER_OVERFLOW' && (isEs ? 'Desbordamiento de Búfer FIFO' : 'FIFO Buffer Overflow')}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              {isEs ? `3. Factor de Retraso / Latencia: ${latencyMultiplier}x` : `3. Delay / Latency Factor: ${latencyMultiplier}x`}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={latencyMultiplier}
              onChange={(e) => setLatencyMultiplier(parseInt(e.target.value, 10))}
              className="w-full accent-[#09843B] dark:accent-[#0ca54a] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunExperiment}
            className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-[#09843B] hover:bg-[#076b30] dark:bg-[#0ca54a] dark:hover:bg-[#09843B] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>{isEs ? 'Ejecutar Prueba de Resiliencia' : 'Run Resilience Test'}</span>
          </button>
        </div>
      </div>

      {/* Results Comparison Grid */}
      {activeExpResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Polling Result */}
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isEs ? 'Comportamiento en Sondeo (Polling)' : 'Polling Behavior'}
                </h3>
              </div>
              <span className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-bold border border-amber-200 dark:border-amber-800/60 shrink-0">
                {isEs ? 'Alta Vulnerabilidad' : 'High Vulnerability'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-600 dark:text-slate-400 font-sans">
                  {isEs ? 'Ciclos de CPU desperdiciados:' : 'Wasted CPU cycles:'}
                </span>
                <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
                  {activeExpResults.pollingLostCycles} {isEs ? 'ciclos perdidos' : 'lost cycles'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-600 dark:text-slate-400 font-sans">
                  {isEs ? 'Impacto en la CPU:' : 'CPU Impact:'}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  {isEs ? 'Bloqueo por espera activa (100% busy)' : 'Busy-wait lockup (100% busy)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
              {isEs ? (
                <>
                  Durante todo el tiempo que el dispositivo estuvo atascado o retrasado, la CPU fue incapaz de hacer trabajo útil porque estaba consumiendo ciclos en el bucle <code className="font-mono text-[#09843B] dark:text-[#0ca54a]">while(!ready)</code>.
                </>
              ) : (
                <>
                  Throughout the entire time the device was jammed or delayed, the CPU could perform no useful work because it kept burning cycles in the <code className="font-mono text-[#09843B] dark:text-[#0ca54a]">while(!ready)</code> loop.
                </>
              )}
            </p>
          </div>

          {/* Interrupts Result */}
          <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <Zap className="w-5 h-5 text-[#09843B] dark:text-[#0ca54a] shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isEs ? 'Comportamiento en Interrupciones (IRQ)' : 'Interrupts (IRQ) Behavior'}
                </h3>
              </div>
              <span className="text-xs text-[#09843B] dark:text-[#0ca54a] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                {isEs ? 'Alta Resiliencia' : 'High Resilience'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-600 dark:text-slate-400 font-sans">
                  {isEs ? 'Ciclos de CPU desperdiciados:' : 'Wasted CPU cycles:'}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#09843B] dark:text-[#0ca54a]">
                  {isEs
                    ? `0 ciclos (Solo ${activeExpResults.irqLostCycles} de ISR)`
                    : `0 cycles (Only ${activeExpResults.irqLostCycles} in ISR)`}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-600 dark:text-slate-400 font-sans">
                  {isEs ? 'Impacto en la CPU:' : 'CPU Impact:'}
                </span>
                <span className="text-[#09843B] dark:text-[#0ca54a] font-bold">
                  {isEs ? 'Cero bloqueo (CPU disponible para usuario)' : 'Zero stall (CPU free for user tasks)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
              {isEs
                ? 'El controlador de hardware manejó el retraso y notificó la falla mediante la línea de interrupción correspondiente. El kernel ejecutó la rutina de error y liberó inmediatamente los recursos.'
                : 'The hardware controller handled the delay and signaled the fault over the corresponding interrupt line. The kernel ran the error handler and released resources immediately.'}
            </p>
          </div>
        </div>
      )}

      {/* Analysis Card */}
      {activeExpResults && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#09843B] dark:text-[#0ca54a]" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {isEs ? 'Análisis Científico del Reto de Experimentación' : 'Scientific Analysis of the Experimentation Challenge'}
            </h4>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-sans">
            {getAnalysisText()}
          </p>
        </div>
      )}
    </div>
  );
};
