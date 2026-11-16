/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Simulador de Periféricos & Interrupciones
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { CPUState, IODevice, IOMode, DeviceType } from '../types/io-simulator';
import { Cpu, Zap, Activity, HardDrive, Keyboard, Printer, Network, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ArchitectureViewProps {
  cpu: CPUState;
  devices: Record<DeviceType, IODevice>;
  mode: IOMode;
  tickCount: number;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  cpu,
  devices,
  mode,
  tickCount,
}) => {
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'KEYBOARD':
        return <Keyboard className="w-4 h-4" />;
      case 'DISK':
        return <HardDrive className="w-4 h-4" />;
      case 'PRINTER':
        return <Printer className="w-4 h-4" />;
      case 'NETWORK':
        return <Network className="w-4 h-4" />;
    }
  };

  const totalCycles = Math.max(1, cpu.totalCycles);
  const usefulPct = Math.round((cpu.usefulCycles / totalCycles) * 100);
  const pollingWastePct = Math.round((cpu.pollingCycles / totalCycles) * 100);
  const isrPct = Math.round((cpu.isrCycles / totalCycles) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xs transition-colors">
      {/* Top Banner: Architecture Title & Mode Indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Arquitectura del Subsistema de Entrada/Salida
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
              Tick: {tickCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Modelo de procesador central, buses de control/datos, PIC 8259A y controladores de hardware.
          </p>
        </div>

        {/* Mechanism state display */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          <div className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 sm:gap-2 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Mecanismo Activo:</span>
            <span className={`font-bold ${mode === 'INTERRUPTS' ? 'text-[#09843B] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {mode === 'INTERRUPTS' ? 'E/S por Interrupciones (IRQ + ISR)' : 'E/S por Sondeo (Busy-Waiting Polling)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Diagram Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CPU Block (Left 4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#09843B]/10 dark:bg-emerald-950/60 text-[#09843B] dark:text-emerald-400 border border-[#09843B]/20 dark:border-emerald-800">
                  <Cpu className="w-4 h-4 text-[#09843B] dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Unidad Central (CPU)</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Núcleo x86-64</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                {cpu.activity === 'USER_COMPUTE' && (
                  <span className="text-xs font-semibold text-[#09843B] dark:text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cómputo Útil
                  </span>
                )}
                {cpu.activity === 'POLLING_PROBE' && (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 animate-pulse">
                    <Activity className="w-3.5 h-3.5" />
                    Sondeo Activo (Busy)
                  </span>
                )}
                {cpu.activity === 'EXECUTING_ISR' && (
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 inline-flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    ISR (IRQ {cpu.activeIrq})
                  </span>
                )}
                {cpu.activity === 'CPU_IDLE' && (
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Ociosa (HALT)
                  </span>
                )}
              </div>
            </div>

            {/* Current CPU Task */}
            <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Instrucción / Tarea en Ejecución
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed break-words font-medium">
                {cpu.currentTaskDescription}
              </p>
            </div>

            {/* CPU Registers summary */}
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 mt-3 text-xs font-mono">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans">Registro EFLAGS</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold break-words">
                  IF={mode === 'INTERRUPTS' ? '1 (INT ON)' : '0 (INT OFF)'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans">Vector IVT</span>
                <span className={cpu.activeIrq !== null ? 'text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-500 dark:text-slate-400 font-bold'}>
                  {cpu.activeIrq !== null ? `0x2${cpu.activeIrq.toString(16).toUpperCase()}` : '0x00'}
                </span>
              </div>
            </div>
          </div>

          {/* CPU Cycle Breakdown Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Distribución de Ciclos de Reloj</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{cpu.totalCycles} ciclos</span>
            </div>

            {/* Visual stacked bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div
                className="bg-[#09843B] transition-all duration-300"
                style={{ width: `${usefulPct}%` }}
                title={`Cómputo Útil: ${usefulPct}%`}
              />
              <div
                className="bg-amber-500 transition-all duration-300"
                style={{ width: `${pollingWastePct}%` }}
                title={`Desperdicio en Sondeo: ${pollingWastePct}%`}
              />
              <div
                className="bg-purple-600 transition-all duration-300"
                style={{ width: `${isrPct}%` }}
                title={`Overhead ISR: ${isrPct}%`}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#09843B]" />
                <span className="text-slate-700 dark:text-slate-300">Útil ({usefulPct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-700 dark:text-slate-300">Sondeo ({pollingWastePct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-slate-700 dark:text-slate-300">ISR ({isrPct}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* System Bus & PIC (Middle 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
          {/* Programmable Interrupt Controller (PIC) */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#09843B] dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  PIC 8259A / APIC
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                {mode === 'INTERRUPTS' ? 'HABILITADO' : 'ENMASCARADO'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Árbitro de prioridades de hardware. Serializa líneas IRQ y genera vectores de interrupción hacia la CPU.
            </p>

            {/* IRQ Lines status */}
            <div className="space-y-1.5 pt-1 text-xs font-mono">
              {Object.values(devices).map((dev) => {
                const isAsserted = cpu.activeIrq === dev.irqNumber;
                return (
                  <div
                    key={dev.id}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg transition-colors ${
                      isAsserted
                        ? 'bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 font-semibold'
                        : 'bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-slate-800 dark:text-slate-100 shrink-0">IRQ {dev.irqNumber}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">({dev.displayName})</span>
                    </span>
                    <span className={`shrink-0 ${isAsserted ? 'text-purple-700 dark:text-purple-300 font-bold animate-pulse' : 'text-slate-400 dark:text-slate-500'}`}>
                      {isAsserted ? 'ACTIVO' : 'EN ESPERA'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Bus Diagram */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Bus del Sistema
              </span>
              <span className="text-[10px] text-[#09843B] dark:text-emerald-400 font-mono font-semibold">64-bit FSB / PCIe</span>
            </div>

            <div className="space-y-1.5 text-[10px] sm:text-[11px] font-mono">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-1">
                <span className="text-[#09843B] dark:text-emerald-400 font-semibold">Bus de Control</span>
                <span className="text-emerald-700 dark:text-emerald-300">IOR / IOW / INTA</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex flex-wrap items-center justify-between gap-1">
                <span className="text-amber-800 dark:text-amber-300 font-semibold">Bus de Direcciones</span>
                <span className="text-amber-700 dark:text-amber-400">I/O Ports: 0x60 - 0x3F8</span>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-1">
                <span className="text-blue-800 dark:text-blue-300 font-semibold">Bus de Datos</span>
                <span className="text-blue-700 dark:text-blue-400">Data Stream (FIFO/DMA)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Device Controllers (Right 5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Controladores de Periféricos</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Registros de Estado, Control y Búfer de Datos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(devices).map((dev) => {
              const isBusy = dev.status === 'BUSY';
              const isError = dev.status === 'ERROR';
              const isDone = dev.registers.status.done;

              return (
                <div
                  key={dev.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isError
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
                      : isBusy
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-[#09843B] dark:border-emerald-600'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs'
                  }`}
                >
                  {/* Header of Device Controller */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[#09843B] dark:text-emerald-400 shrink-0">{getDeviceIcon(dev.id)}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{dev.displayName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold shrink-0">IRQ {dev.irqNumber}</span>
                  </div>

                  {/* Registers Display */}
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex flex-wrap items-center justify-between gap-1 bg-slate-100 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80">
                      <span className="text-slate-500 dark:text-slate-400">STATUS_REG:</span>
                      <span
                        className={`font-bold ${
                          isError
                            ? 'text-rose-600 dark:text-rose-400'
                            : isDone
                            ? 'text-[#09843B] dark:text-emerald-400'
                            : isBusy
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dev.registers.status.rawHex} (
                        {isError ? 'ERR' : isDone ? 'DONE' : isBusy ? 'BUSY' : 'READY'})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1 bg-slate-100 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80">
                      <span className="text-slate-500 dark:text-slate-400">CONTROL_REG:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {dev.registers.control.rawHex} (IE={dev.registers.control.interruptEnable ? '1' : '0'})
                      </span>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 truncate">
                      <span className="text-slate-500 dark:text-slate-400">DATA: </span>
                      <span className="text-slate-900 dark:text-slate-100 font-medium">{dev.registers.data}</span>
                    </div>
                  </div>

                  {/* Progress bar if busy */}
                  {isBusy && dev.totalRequiredTicks > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>Progreso E/S</span>
                        <span>
                          {dev.totalRequiredTicks - dev.currentProgressTicks}/{dev.totalRequiredTicks} ticks
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#09843B] dark:bg-emerald-500 transition-all duration-200"
                          style={{
                            width: `${Math.round(
                              ((dev.totalRequiredTicks - dev.currentProgressTicks) / dev.totalRequiredTicks) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fault message */}
                  {isError && (
                    <div className="mt-1.5 text-[10px] text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 p-1.5 rounded border border-rose-300 dark:border-rose-800 font-medium">
                      {dev.faultMessage || 'Fallo de hardware detectado'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
