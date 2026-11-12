/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Informe de la Simulación en Memoria RAM
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 * Docente: MSc. Alvaro Salamanca | Universidad Simón Bolívar
 */

import React, { useState } from 'react';
import { CPUState, IODevice, IORequest, KernelLogEntry, IOMode, DeviceType } from '../types/io-simulator';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Cpu,
  Database,
  HardDrive,
  Activity,
  Layers,
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

interface LiveSessionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickCount: number;
  mode: IOMode;
  cpu: CPUState;
  devices: Record<DeviceType, IODevice>;
  completedRequests: IORequest[];
  failedRequests: IORequest[];
  logs: KernelLogEntry[];
  history?: Array<{
    tick: number;
    usefulCycles: number;
    wasteCycles: number;
    isrCycles: number;
    efficiencyPct: number;
    completedRequests: number;
  }>;
}

export const LiveSessionReportModal: React.FC<LiveSessionReportModalProps> = ({
  isOpen,
  onClose,
  tickCount,
  mode,
  cpu,
  devices,
  completedRequests,
  failedRequests,
  logs,
  history = [],
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalCycles = Math.max(1, cpu.totalCycles);
  const totalActiveCycles = cpu.usefulCycles + cpu.pollingCycles + cpu.isrCycles;
  const efficiencyPct = totalActiveCycles > 0 ? ((cpu.usefulCycles / totalActiveCycles) * 100).toFixed(1) : '100.0';

  const allRequests = [...completedRequests, ...failedRequests];
  const avgWaitTime =
    allRequests.length > 0
      ? (allRequests.reduce((acc, r) => acc + r.waitTime, 0) / allRequests.length).toFixed(1)
      : '0.0';
  const avgServiceTime =
    allRequests.length > 0
      ? (allRequests.reduce((acc, r) => acc + r.serviceTime, 0) / allRequests.length).toFixed(1)
      : '0.0';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const memoryDump = {
      institucion: 'Universidad Simón Bolívar',
      carrera: 'Ingeniería de Sistemas',
      asignatura: 'Sistemas Operativos (V Semestre)',
      docente: 'MSc. Alvaro Salamanca',
      autores: ['Katherine Peñaloza', 'Edwin Gutierrez'],
      proyecto: 'Proyecto #10 - Simulador de Periféricos & Interrupciones',
      timestamp: new Date().toISOString(),
      estadoMemoriaRAM: {
        tickReloj: tickCount,
        mecanismo: mode,
        metricasCPU: {
          ciclosTotales: cpu.totalCycles,
          ciclosUtiles: cpu.usefulCycles,
          ciclosSondeoPerdidos: cpu.pollingCycles,
          ciclosManejadorISR: cpu.isrCycles,
          ciclosOciosos: cpu.idleCycles,
          eficienciaPorcentual: Number(efficiencyPct),
          cambiosDeContexto: cpu.contextSwitches,
        },
        dispositivos: Object.values(devices).map((d) => ({
          id: d.id,
          nombre: d.displayName,
          irq: d.irqNumber,
          latenciaTicks: d.baseLatencyTicks,
          registros: d.registers,
          solicitudesAtendidas: d.metrics.totalHandled,
          fallosDetectados: d.metrics.faultsCount,
          ticksOcupado: d.metrics.busyTicks,
        })),
        solicitudesCompletadas: completedRequests,
        solicitudesFallidas: failedRequests,
        ultimosRegistrosKernel: logs.slice(0, 50),
      },
    };

    const blob = new Blob([JSON.stringify(memoryDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_simulacion_ram_usb_tick_${tickCount}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopySummary = () => {
    const summary = `UNIVERSIDAD SIMÓN BOLÍVAR - INFORME DE SIMULACIÓN EN RAM
Carrera: Ingeniería de Sistemas · Sistemas Operativos (V Semestre)
Docente: MSc. Alvaro Salamanca
Autores: Katherine Peñaloza & Edwin Gutierrez
Proyecto #10: I/O Simulator

RESUMEN DE SESIÓN EN MEMORIA VOLÁTIL:
- Ticks de Reloj Acumulados: ${tickCount}
- Mecanismo Activo: ${mode}
- Eficiencia de CPU: ${efficiencyPct}%
- Ciclos Útiles: ${cpu.usefulCycles} | Sondeo Perdido: ${cpu.pollingCycles} | ISR Overhead: ${cpu.isrCycles}
- Solicitudes E/S Procesadas: ${completedRequests.length} exitosas, ${failedRequests.length} fallidas
- Tiempo Promedio de Espera: ${avgWaitTime} ticks | Servicio: ${avgServiceTime} ticks
- Generado: ${new Date().toLocaleString('es-CO')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] border border-[#09843B]/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Informe de la Simulación en Memoria RAM
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#09843B] dark:text-[#0ca54a] border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-bold">
                  RAM Volátil (En Vivo)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estado acumulado en la memoria de la sesión antes de reiniciar la página
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Copiar resumen al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Descargar volcado de estado JSON de memoria"
            >
              <Download className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
              <span>Volcado JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Imprimir informe en formato físico o PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Institutional Banner */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs text-center space-y-3">
            <div className="flex justify-center mb-1">
              <div className="p-2 bg-white dark:bg-transparent rounded-xl shadow-xs dark:shadow-none inline-block">
                {/* Light mode logo */}
                <img
                  src="/assets/aistudio/image_efdd08c1.png"
                  alt="Universidad Simón Bolívar"
                  className="h-16 w-auto object-contain dark:hidden"
                />
                {/* Dark mode logo */}
                <img
                  src="/assets/aistudio/Captura_de_pantalla_2026-11-12_085043-removebg-preview_0b4e7ef0.png"
                  alt="Universidad Simón Bolívar"
                  className="h-14 w-auto object-contain hidden dark:block"
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] text-xs font-bold border border-[#09843B]/30">
              <Award className="w-3.5 h-3.5" />
              <span>Reporte de Ejecución y Telemetría en Tiempo Real · Proyecto #10</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Informe Técnico de la Simulación en Memoria RAM
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Universidad Simón Bolívar · Facultad de Ingenierías · Carrera de Ingeniería de Sistemas
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Asignatura: Sistemas Operativos (V Semestre)
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-slate-500 dark:text-slate-400">Docente Titular:</span>
                <strong className="text-[#09843B] dark:text-[#0ca54a]">MSc. Alvaro Salamanca</strong>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Users className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
                <span>Estudiante: <strong className="text-slate-900 dark:text-slate-100">Katherine Peñaloza</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Users className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
                <span>Estudiante: <strong className="text-slate-900 dark:text-slate-100">Edwin Gutierrez</strong></span>
              </div>
            </div>
          </div>

          {/* Session Overview KPI Matrix */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
              <span>Resumen Cuantitativo Cargado en Memoria RAM</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Ticks de Reloj en Sesión</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{tickCount}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Avanzados en RAM</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Mecanismo E/S Evaluado</span>
                <span className={`text-base font-bold font-mono ${mode === 'INTERRUPTS' ? 'text-[#09843B] dark:text-[#0ca54a]' : 'text-amber-600 dark:text-amber-400'}`}>
                  {mode === 'INTERRUPTS' ? 'Interrupciones (IRQ)' : 'Sondeo (Polling)'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Controlador PIC activo</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Eficiencia de CPU en Sesión</span>
                <span className="text-2xl font-bold font-mono text-[#09843B] dark:text-[#0ca54a]">{efficiencyPct}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Cómputo Útil / Total Activo</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Solicitudes Procesadas</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  {completedRequests.length}{' '}
                  {failedRequests.length > 0 && (
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-sans">({failedRequests.length} fallos)</span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Total en búfer de memoria</span>
              </div>
            </div>
          </div>

          {/* CPU Cycles Real Distribution in RAM */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
              <span>Desglose de Ciclos de Procesador en la Corrida Actual</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Cómputo Útil de Procesos</span>
                    <span className="text-lg font-bold text-[#09843B] dark:text-[#0ca54a]">{cpu.usefulCycles} ciclos</span>
                  </div>
                  <span className="text-xs text-[#09843B] dark:text-[#0ca54a] font-bold">
                    {Math.round((cpu.usefulCycles / totalCycles) * 100)}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Desperdicio en Sondeo Activo</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{cpu.pollingCycles} ciclos</span>
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    {Math.round((cpu.pollingCycles / totalCycles) * 100)}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Overhead Manejadores ISR</span>
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-400">{cpu.isrCycles} ciclos</span>
                  </div>
                  <span className="text-xs text-purple-700 dark:text-purple-400 font-bold">
                    {Math.round((cpu.isrCycles / totalCycles) * 100)}%
                  </span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#09843B] dark:bg-[#0ca54a] transition-all duration-300"
                  style={{ width: `${(cpu.usefulCycles / totalCycles) * 100}%` }}
                  title="Útil"
                />
                <div
                  className="bg-amber-500 transition-all duration-300"
                  style={{ width: `${(cpu.pollingCycles / totalCycles) * 100}%` }}
                  title="Sondeo"
                />
                <div
                  className="bg-purple-600 transition-all duration-300"
                  style={{ width: `${(cpu.isrCycles / totalCycles) * 100}%` }}
                  title="ISR"
                />
              </div>
            </div>
          </div>

          {/* Behavioral Charts Section Embedded in Downloadable Report */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
              <span>Gráficas de Comportamiento Dinámico (Registradas en Memoria RAM)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Report Chart 1: CPU Efficiency Evolution */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Trayectoria de Eficiencia de CPU (% Cómputo Útil vs Ticks)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#09843B] dark:text-[#0ca54a]">{efficiencyPct}%</span>
                </div>

                <div className="h-44 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
                  {(() => {
                    const width = 420;
                    const height = 160;
                    const padX = 35;
                    const padY = 15;
                    const chartW = width - padX - 10;
                    const chartH = height - padY - 20;

                    const count = Math.max(history.length, 2);
                    const svgPoints = history.map((pt, i) => {
                      const x = padX + (i / Math.max(1, count - 1)) * chartW;
                      const y = padY + chartH - (Math.min(100, Math.max(0, pt.efficiencyPct)) / 100) * chartH;
                      return `${x},${y}`;
                    });

                    const pathData = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';
                    const strokeColor = mode === 'INTERRUPTS' ? '#09843B' : '#d97706';
                    const fillColor = mode === 'INTERRUPTS' ? 'rgba(9, 132, 59, 0.08)' : 'rgba(217, 119, 6, 0.08)';
                    const areaData =
                      svgPoints.length > 0
                        ? `M ${padX},${padY + chartH} L ${svgPoints.join(' L ')} L ${padX + chartW},${padY + chartH} Z`
                        : '';

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {[0, 25, 50, 75, 100].map((level) => {
                          const y = padY + chartH - (level / 100) * chartH;
                          return (
                            <g key={level}>
                              <line
                                x1={padX}
                                y1={y}
                                x2={padX + chartW}
                                y2={y}
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-700"
                                strokeDasharray={level === 0 || level === 100 ? '0' : '3 3'}
                                strokeWidth="1"
                              />
                              <text x={padX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                                {level}%
                              </text>
                            </g>
                          );
                        })}

                        <text x={padX} y={height - 2} textAnchor="start" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                          T0
                        </text>
                        <text x={padX + chartW} y={height - 2} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                          T{tickCount}
                        </text>

                        {areaData && <path d={areaData} fill={fillColor} />}
                        {pathData && (
                          <path
                            d={pathData}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    );
                  })()}
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {mode === 'INTERRUPTS'
                    ? 'Comportamiento en Interrupciones: Alta estabilidad sin degradación por espera activa.'
                    : 'Comportamiento en Sondeo: Pérdida continua de capacidad de CPU por comprobaciones en bucle.'}
                </p>
              </div>

              {/* Report Chart 2: Throughput / Completed Requests Cumulative Timeline */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Progreso Acumulado de Solicitudes Atendidas en RAM
                  </span>
                  <span className="font-mono text-xs font-bold text-[#09843B] dark:text-[#0ca54a]">
                    {completedRequests.length} tareas
                  </span>
                </div>

                <div className="h-44 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
                  {(() => {
                    const width = 420;
                    const height = 160;
                    const padX = 30;
                    const padY = 15;
                    const chartW = width - padX - 10;
                    const chartH = height - padY - 20;

                    const count = Math.max(history.length, 2);
                    const maxCompleted = Math.max(completedRequests.length, 5);

                    const svgPoints = history.map((pt, i) => {
                      const x = padX + (i / Math.max(1, count - 1)) * chartW;
                      const y = padY + chartH - (pt.completedRequests / maxCompleted) * chartH;
                      return `${x},${y}`;
                    });

                    const pathData = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {[0, Math.round(maxCompleted / 2), maxCompleted].map((val, idx) => {
                          const y = padY + chartH - (val / maxCompleted) * chartH;
                          return (
                            <g key={idx}>
                              <line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeDasharray="3 3" strokeWidth="1" />
                              <text x={padX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                                {val}
                              </text>
                            </g>
                          );
                        })}

                        <text x={padX} y={height - 2} textAnchor="start" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                          T0
                        </text>
                        <text x={padX + chartW} y={height - 2} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                          T{tickCount}
                        </text>

                        {pathData && (
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#09843B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    );
                  })()}
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {completedRequests.length} solicitudes de E/S completadas con éxito en {tickCount} ticks de reloj.
                </p>
              </div>
            </div>

            {/* Report Chart 3: Device Latency & Wait Time Bars */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Tiempos Promedio de Espera en Cola por Periférico (Medido en RAM)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'] as const).map((devId) => {
                  const dev = devices[devId];
                  const avgWait =
                    dev.metrics.totalHandled > 0
                      ? (dev.metrics.totalWaitTime / dev.metrics.totalHandled).toFixed(1)
                      : '0.0';

                  return (
                    <div key={devId} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 block truncate">{dev.displayName}</span>
                      <span className="text-base font-bold font-mono text-[#09843B] dark:text-[#0ca54a] block my-0.5">{avgWait}t</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">Atendidas: {dev.metrics.totalHandled}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hardware Peripherals & Hardware Registers Snapshot */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
              <span>Estado Instantáneo de Registros de Controladores en RAM</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {Object.values(devices).map((dev) => (
                <div key={dev.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{dev.displayName}</span>
                    <span className="text-[10px] font-mono text-[#09843B] dark:text-[#0ca54a] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                      IRQ {dev.irqNumber}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500">STATUS_REG:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{dev.registers.status.rawHex}</strong>
                    </div>
                    <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500">CONTROL_REG:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{dev.registers.control.rawHex}</strong>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-100 dark:border-slate-800 truncate">
                      <span className="text-slate-400 dark:text-slate-500">DATA: </span>
                      <strong className="text-slate-800 dark:text-slate-200">{dev.registers.data}</strong>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-mono flex justify-between">
                    <span>Atendidas: <strong className="text-slate-800 dark:text-slate-200">{dev.metrics.totalHandled}</strong></span>
                    <span>Fallos: <strong className="text-slate-800 dark:text-slate-200">{dev.metrics.faultsCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Processed Requests Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
                <span>Historial de Solicitudes Atendidas en la Sesión ({allRequests.length})</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Espera Promedio: <strong className="text-slate-800 dark:text-slate-200">{avgWaitTime}t</strong> · Servicio: <strong className="text-slate-800 dark:text-slate-200">{avgServiceTime}t</strong>
              </span>
            </h3>

            {allRequests.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Proceso</th>
                      <th className="py-2 px-3">Dispositivo</th>
                      <th className="py-2 px-3">Operación</th>
                      <th className="py-2 px-3">Tamaño</th>
                      <th className="py-2 px-3">Espera</th>
                      <th className="py-2 px-3">Servicio</th>
                      <th className="py-2 px-3">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {allRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                        <td className="py-2 px-3 font-bold text-[#09843B] dark:text-[#0ca54a]">{req.id}</td>
                        <td className="py-2 px-3 font-sans text-slate-700 dark:text-slate-300">{req.processName}</td>
                        <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{req.deviceType}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              req.operation === 'READ'
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#09843B] dark:text-[#0ca54a] border border-emerald-200 dark:border-emerald-800/60'
                            }`}
                          >
                            {req.operation}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{req.bytes} B</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{req.waitTime}t</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{req.serviceTime}t</td>
                        <td className="py-2 px-3">
                          {req.status === 'COMPLETED' ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 font-sans">
                              <CheckCircle2 className="w-3 h-3 text-[#09843B] dark:text-[#0ca54a]" />
                              Completada
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 font-sans">
                              <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              Fallo ({req.failedReason || 'Hardware Error'})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                Aún no se han completado solicitudes en esta sesión. Inicia la simulación o inyecta una solicitud para generar telemetría en RAM.
              </div>
            )}
          </div>

          {/* Automated System Diagnostic Verdict */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a]" />
              <span>Diagnóstico Científico de la Sesión en Memoria</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 font-sans">
              <p>
                <strong>1. Eficiencia Observada en Memoria:</strong> Durante esta sesión de{' '}
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{tickCount} ticks</span>, la CPU alcanzó una
                eficiencia operativa del <span className="font-bold font-mono text-[#09843B] dark:text-[#0ca54a]">{efficiencyPct}%</span>{' '}
                bajo el paradigma de <strong className="text-slate-900 dark:text-slate-100">{mode === 'INTERRUPTS' ? 'E/S por Interrupciones' : 'E/S por Sondeo (Polling)'}</strong>.
                {mode === 'POLLING' && (
                  <span className="text-amber-800 dark:text-amber-300 ml-1">
                    Se registró un desperdicio de <strong>{cpu.pollingCycles} ciclos</strong> en bucles de espera activa (busy-waiting) verificando STATUS_REG.
                  </span>
                )}
                {mode === 'INTERRUPTS' && (
                  <span className="text-[#09843B] dark:text-[#0ca54a] ml-1">
                    La CPU dedicó el 95%+ a procesos de usuario, pagando únicamente un overhead de <strong>{cpu.isrCycles} ciclos</strong> en la ejecución de las rutinas ISR.
                  </span>
                )}
              </p>

              <p>
                <strong>2. Tolerancia a Fallos y Concurrencia:</strong> Se procesaron un total de{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">{allRequests.length} solicitudes de E/S</span> con un tiempo de espera promedio en cola de{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">{avgWaitTime} ticks</span>.
                {failedRequests.length > 0
                  ? ` Los ${failedRequests.length} fallos inyectados fueron registrados en los registros de hardware y aislados por el kernel sin congelar el hilo principal.`
                  : ' Todos los periféricos operaron con normalidad dentro de sus márgenes de latencia nominal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Universidad Simón Bolívar · Ingeniería de Sistemas · Docente: <strong className="text-slate-800 dark:text-slate-200">MSc. Alvaro Salamanca</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#09843B] hover:bg-[#07692e] dark:bg-[#0ca54a] dark:hover:bg-[#09843B] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Cerrar Informe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
