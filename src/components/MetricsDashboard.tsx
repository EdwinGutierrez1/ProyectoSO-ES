/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Panel de Métricas de E/S y CPU
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { IODevice, CPUState, IORequest, IOMode, DeviceType } from '../types/io-simulator';
import { BarChart3, Download, Clock, Gauge, Cpu, CheckCircle2, AlertCircle, FileText, Database } from 'lucide-react';

interface MetricsDashboardProps {
  devices: Record<DeviceType, IODevice>;
  cpu: CPUState;
  completedRequests: IORequest[];
  failedRequests: IORequest[];
  totalTicks: number;
  mode: IOMode;
  onOpenLiveReport?: () => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  devices,
  cpu,
  completedRequests,
  failedRequests,
  totalTicks,
  mode,
  onOpenLiveReport,
}) => {
  const safeTotalTicks = Math.max(1, totalTicks);
  const totalCompleted = completedRequests.length;
  const totalFailed = failedRequests.length;
  const allHandled = [...completedRequests, ...failedRequests];

  // Calculate Average Waiting and Service Times
  const avgWaitTime =
    allHandled.length > 0
      ? (allHandled.reduce((acc, r) => acc + r.waitTime, 0) / allHandled.length).toFixed(1)
      : '0.0';

  const avgServiceTime =
    allHandled.length > 0
      ? (allHandled.reduce((acc, r) => acc + r.serviceTime, 0) / allHandled.length).toFixed(1)
      : '0.0';

  const totalCpuActive = cpu.usefulCycles + cpu.pollingCycles + cpu.isrCycles;
  const cpuEfficiency =
    totalCpuActive > 0 ? ((cpu.usefulCycles / totalCpuActive) * 100).toFixed(1) : '100.0';

  // Export metrics to CSV
  const handleExportCSV = () => {
    let csv = 'ID,Proceso,Dispositivo,Operación,Bytes,Prioridad,Ticks_Espera,Ticks_Servicio,Estado,Motivo_Fallo\n';
    allHandled.forEach((r) => {
      csv += `${r.id},"${r.processName}",${r.deviceType},${r.operation},${r.bytes},${r.priority},${r.waitTime},${r.serviceTime},${r.status},"${r.failedReason || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `io_simulator_metricas_${mode.toLowerCase()}_ticks_${safeTotalTicks}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs transition-colors">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#09843B] dark:text-emerald-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Métricas de Rendimiento y Utilización de Periféricos
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tiempos de espera, tiempos de servicio y análisis de eficiencia de la CPU.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenLiveReport && (
            <button
              onClick={onOpenLiveReport}
              className="px-3.5 py-2 rounded-xl bg-[#09843B]/10 dark:bg-emerald-950/60 hover:bg-[#09843B]/20 dark:hover:bg-emerald-900/60 text-[#09843B] dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-[#09843B]/30 dark:border-emerald-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Generar informe técnico de la simulación cargada en memoria RAM"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Informe en RAM</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            disabled={allHandled.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#09843B] dark:text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Eficiencia CPU</span>
            <Cpu className="w-4 h-4 text-[#09843B] dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#09843B] dark:text-emerald-400 tabular-nums">
            {cpuEfficiency}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {mode === 'POLLING' ? 'Mermada por espera activa' : 'Óptima sin busy-wait'}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Espera Promedio</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {avgWaitTime} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ticks</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Tiempo en colas de E/S</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Servicio Promedio</span>
            <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {avgServiceTime} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ticks</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Tiempo en controlador</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Solicitudes Atendidas</span>
            <CheckCircle2 className="w-4 h-4 text-[#09843B] dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {totalCompleted}{' '}
            {totalFailed > 0 && <span className="text-xs text-rose-600 dark:text-rose-400">({totalFailed} err)</span>}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Completadas con éxito</div>
        </div>
      </div>

      {/* Device Utilization Bars Table */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Utilización de Hardware por Dispositivo
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Total Ticks: {safeTotalTicks}</span>
        </div>

        <div className="space-y-3 pt-1">
          {Object.values(devices).map((dev) => {
            const utilizationPct = Math.min(100, Math.round((dev.metrics.busyTicks / safeTotalTicks) * 100));
            const avgDevWait =
              dev.metrics.totalHandled > 0
                ? (dev.metrics.totalWaitTime / dev.metrics.totalHandled).toFixed(1)
                : '0.0';

            return (
              <div key={dev.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{dev.displayName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">IRQ {dev.irqNumber}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-0.5 text-[11px] sm:text-xs font-mono text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">
                      Espera: <span className="text-slate-800 dark:text-slate-100 font-bold">{avgDevWait}t</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Atendidas: <span className="text-[#09843B] dark:text-emerald-400 font-bold">{dev.metrics.totalHandled}</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{utilizationPct}% ocupado</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#09843B] dark:bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${utilizationPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CPU Cycle Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <span className="text-emerald-800 dark:text-emerald-300 block text-[11px] font-bold">Cómputo Útil de Procesos</span>
            <span className="text-lg font-bold font-mono text-[#09843B] dark:text-emerald-400 tabular-nums">
              {cpu.usefulCycles} ciclos
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
            {Math.round((cpu.usefulCycles / safeTotalTicks) * 100)}%
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div>
            <span className="text-amber-800 dark:text-amber-300 block text-[11px] font-bold">Desperdicio en Sondeo Activo</span>
            <span className="text-lg font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
              {cpu.pollingCycles} ciclos
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
            {Math.round((cpu.pollingCycles / safeTotalTicks) * 100)}%
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
          <div>
            <span className="text-purple-800 dark:text-purple-300 block text-[11px] font-bold">Overhead de Manejadores ISR</span>
            <span className="text-lg font-bold font-mono text-purple-700 dark:text-purple-400 tabular-nums">
              {cpu.isrCycles} ciclos
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300">
            {Math.round((cpu.isrCycles / safeTotalTicks) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
