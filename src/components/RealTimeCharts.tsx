/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Gráficas de Comportamiento en Tiempo Real
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 * Docente: MSc. Alvaro Salamanca | Universidad Simón Bolívar
 */

import React from 'react';
import { IOMode, DeviceType, IODevice, CPUState, IORequest } from '../types/io-simulator';
import { Activity, Gauge, TrendingUp, Clock, HardDrive, Keyboard, Printer, Network } from 'lucide-react';

interface RealTimeChartsProps {
  history: Array<{
    tick: number;
    usefulCycles: number;
    wasteCycles: number;
    isrCycles: number;
    efficiencyPct: number;
    completedRequests: number;
  }>;
  mode: IOMode;
  devices: Record<DeviceType, IODevice>;
  cpu: CPUState;
  completedRequests: IORequest[];
  failedRequests: IORequest[];
  tickCount: number;
}

export const RealTimeCharts: React.FC<RealTimeChartsProps> = ({
  history,
  mode,
  devices,
  cpu,
  completedRequests,
  failedRequests,
  tickCount,
}) => {
  const currentEff =
    cpu.usefulCycles + cpu.pollingCycles + cpu.isrCycles > 0
      ? Math.round((cpu.usefulCycles / (cpu.usefulCycles + cpu.pollingCycles + cpu.isrCycles)) * 100)
      : 100;

  // Render SVG points for real-time CPU efficiency
  const renderEfficiencyChart = () => {
    const width = 460;
    const height = 180;
    const padX = 35;
    const padY = 20;
    const chartW = width - padX - 15;
    const chartH = height - padY - 20;

    const pointsList = history.slice(-60); // Show last 60 ticks window for crisp responsive view
    const count = Math.max(pointsList.length, 2);

    const svgPoints = pointsList.map((pt, i) => {
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
        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((level) => {
          const y = padY + chartH - (level / 100) * chartH;
          return (
            <g key={level}>
              <line
                x1={padX}
                y1={y}
                x2={padX + chartW}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeDasharray={level === 0 || level === 100 ? '0' : '3 3'}
                strokeWidth="1"
              />
              <text x={padX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium">
                {level}%
              </text>
            </g>
          );
        })}

        {/* X labels */}
        <text x={padX} y={height - 4} textAnchor="start" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
          T{pointsList[0]?.tick || 0}
        </text>
        <text x={padX + chartW} y={height - 4} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
          T{tickCount}
        </text>

        {/* Area fill */}
        {areaData && <path d={areaData} fill={fillColor} />}

        {/* Line curve */}
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

        {/* Current head dot */}
        {svgPoints.length > 0 && (() => {
          const [lastX, lastY] = svgPoints[svgPoints.length - 1].split(',').map(Number);
          return (
            <g>
              <circle cx={lastX} cy={lastY} r="5" fill={strokeColor} className="animate-ping opacity-75" />
              <circle cx={lastX} cy={lastY} r="4" fill={strokeColor} />
            </g>
          );
        })()}
      </svg>
    );
  };

  // Render SVG points for real-time throughput
  const renderThroughputChart = () => {
    const width = 460;
    const height = 180;
    const padX = 30;
    const padY = 20;
    const chartW = width - padX - 15;
    const chartH = height - padY - 20;

    const pointsList = history.slice(-60);
    const count = Math.max(pointsList.length, 2);
    const maxCompleted = Math.max(completedRequests.length, 5);

    const svgPoints = pointsList.map((pt, i) => {
      const x = padX + (i / Math.max(1, count - 1)) * chartW;
      const y = padY + chartH - (pt.completedRequests / maxCompleted) * chartH;
      return `${x},${y}`;
    });

    const pathData = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';
    const strokeColor = '#09843B';

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Gridlines */}
        {[0, Math.round(maxCompleted / 2), maxCompleted].map((val, idx) => {
          const y = padY + chartH - (val / maxCompleted) * chartH;
          return (
            <g key={idx}>
              <line x1={padX} y1={y} x2={padX + chartW} y2={y} className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="3 3" strokeWidth="1" />
              <text x={padX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium">
                {val}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        <text x={padX} y={height - 4} textAnchor="start" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
          T{pointsList[0]?.tick || 0}
        </text>
        <text x={padX + chartW} y={height - 4} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
          T{tickCount}
        </text>

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
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#09843B] dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Gráficas de Comportamiento en Tiempo Real
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#09843B] dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09843B] dark:bg-emerald-400 animate-pulse" />
              <span>Tick {tickCount}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cálculo dinámico basado en la simulación activa ({mode === 'INTERRUPTS' ? 'E/S por Interrupciones' : 'E/S por Sondeo'}).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-semibold">
          <span className="text-slate-500 dark:text-slate-400 font-sans">Eficiencia en Vivo:</span>
          <span className={`text-base font-bold ${mode === 'INTERRUPTS' ? 'text-[#09843B] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {currentEff}%
          </span>
        </div>
      </div>

      {/* Grid of 2 Live SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Chart 1 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#09843B] dark:text-emerald-400" />
              <span>Eficiencia de CPU en Tiempo Real (% Útil vs Ticks)</span>
            </span>
            <span className={`font-mono text-xs font-bold ${mode === 'INTERRUPTS' ? 'text-[#09843B] dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {currentEff}%
            </span>
          </div>

          <div className="h-48 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
            {renderEfficiencyChart()}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Útiles: <strong className="text-slate-800 dark:text-slate-200">{cpu.usefulCycles}</strong></span>
            <span>Sondeo: <strong className="text-amber-700 dark:text-amber-400">{cpu.pollingCycles}</strong></span>
            <span>ISR: <strong className="text-purple-700 dark:text-purple-300">{cpu.isrCycles}</strong></span>
          </div>
        </div>

        {/* Live Chart 2 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#09843B] dark:text-emerald-400" />
              <span>Throughput Acumulado (Solicitudes Completadas en Vivo)</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#09843B] dark:text-emerald-400">
              {completedRequests.length} tareas
            </span>
          </div>

          <div className="h-48 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
            {renderThroughputChart()}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Completadas: <strong className="text-[#09843B] dark:text-emerald-400">{completedRequests.length}</strong></span>
            <span>Fallidas: <strong className="text-rose-600 dark:text-rose-400">{failedRequests.length}</strong></span>
            <span>Ticks: <strong className="text-slate-800 dark:text-slate-200">{tickCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Live Per-Device Wait Times */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200/60 dark:border-slate-700">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Tiempos de Espera y Latencia por Periférico (Calculado de la Simulación Activa)
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Métricas acumuladas en la memoria de trabajo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'] as const).map((devId) => {
            const dev = devices[devId];
            const avgWait =
              dev.metrics.totalHandled > 0
                ? (dev.metrics.totalWaitTime / dev.metrics.totalHandled).toFixed(1)
                : '0.0';
            const avgService =
              dev.metrics.totalHandled > 0
                ? (dev.metrics.totalServiceTime / dev.metrics.totalHandled).toFixed(1)
                : `${dev.baseLatencyTicks}.0`;

            return (
              <div key={devId} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{dev.displayName}</span>
                  <span className="text-[10px] font-mono text-[#09843B] dark:text-emerald-400 font-bold">IRQ {dev.irqNumber}</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-sans">Espera:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{avgWait}t</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-sans">Servicio:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{avgService}t</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-sans">Atendidas:</span>
                    <strong className="text-[#09843B] dark:text-emerald-400">{dev.metrics.totalHandled}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
