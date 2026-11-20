/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Comparativa Sondeo (Polling) vs Interrupciones (IRQ)
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React, { useState } from 'react';
import { SimulatorEngine } from '../services/simulatorEngine';
import { ComparisonMetrics } from '../types/io-simulator';
import { GitCompare, Play, CheckCircle2, Gauge } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TRANSLATED_SCENARIOS, DEVICE_LABELS } from '../i18n/translations';

export const ComparisonBench: React.FC = () => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';
  const scenarios = TRANSLATED_SCENARIOS[lang];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SCENARIO_NORMAL');
  const [ticksCount, setTicksCount] = useState<number>(75);
  const [results, setResults] = useState<{
    pollingMetrics: ComparisonMetrics;
    interruptMetrics: ComparisonMetrics;
  } | null>(() => {
    const scenario = TRANSLATED_SCENARIOS.es[0];
    return SimulatorEngine.runComparativeBenchmark(scenario, 75);
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = SimulatorEngine.runComparativeBenchmark(currentScenario, ticksCount);
      setResults(res);
      setIsRunning(false);
    }, 150);
  };

  const pol = results?.pollingMetrics;
  const irq = results?.interruptMetrics;

  return (
    <div className="space-y-6">
      {/* Top Banner & Scenario Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-[#09843B] dark:text-emerald-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {isEs
                  ? 'Banco de Comparación Directa: Sondeo vs Interrupciones'
                  : 'Side-by-Side Benchmark: Polling vs Interrupts'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isEs
                ? 'Ejecución cuantitativa controlada de la misma carga de trabajo bajo Sondeo (Busy-Waiting) e Interrupciones (Hardware IRQ).'
                : 'Controlled quantitative execution of the exact same workload under Polling (Busy-Waiting) and Interrupts (Hardware IRQ).'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isRunning
                  ? isEs
                    ? 'Ejecutando Benchmark...'
                    : 'Running Benchmark...'
                  : isEs
                  ? 'Ejecutar Comparativa'
                  : 'Run Comparison'}
              </span>
            </button>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
              {isEs ? 'Escenario de Prueba' : 'Test Scenario'}
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-emerald-400 font-medium shadow-2xs"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
              {isEs ? 'Ticks de Reloj de Simulación' : 'Simulation Clock Ticks'}
            </label>
            <select
              value={ticksCount}
              onChange={(e) => setTicksCount(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-emerald-400 font-medium shadow-2xs"
            >
              <option value={50}>{isEs ? '50 Ticks (Carga corta)' : '50 Ticks (Short load)'}</option>
              <option value={75}>{isEs ? '75 Ticks (Recomendado)' : '75 Ticks (Recommended)'}</option>
              <option value={120}>{isEs ? '120 Ticks (Carga extendida)' : '120 Ticks (Extended load)'}</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              {isEs ? 'Carga del Escenario' : 'Scenario Workload'}
            </span>
            <p className="text-slate-800 dark:text-slate-200 text-[11px] font-medium truncate">
              {isEs
                ? `${currentScenario.requestsToInject.length} solicitudes E/S inyectadas simultáneamente`
                : `${currentScenario.requestsToInject.length} I/O requests injected simultaneously`}
            </p>
          </div>
        </div>
      </div>

      {/* Behavioral Charts Section */}
      {pol && irq && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#09843B] dark:text-emerald-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {isEs
                    ? 'Gráficas de Comportamiento Dinámico: Sondeo vs Interrupciones'
                    : 'Dynamic Behavioral Charts: Polling vs Interrupts'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEs
                  ? 'Evolución de la eficiencia de CPU a lo largo del tiempo, saturación por periférico y finalización de tareas.'
                  : 'CPU efficiency evolution over time, per-peripheral saturation, and task completion.'}
              </p>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded-full bg-[#09843B] dark:bg-emerald-400" />
                <span className="text-[#09843B] dark:text-emerald-400">
                  {isEs ? 'Interrupciones (IRQ)' : 'Interrupts (IRQ)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-amber-700 dark:text-amber-400">
                  {isEs ? 'Sondeo (Polling)' : 'Polling'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Chart 1: CPU Efficiency Evolution Over Time (SVG Line Chart) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isEs
                    ? 'Curva de Eficiencia de CPU (% Cómputo Útil vs Ticks)'
                    : 'CPU Efficiency Curve (% Useful Compute vs Ticks)'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">0 - {ticksCount} Ticks</span>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="relative w-full h-48 sm:h-56 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
                {(() => {
                  const width = 460;
                  const height = 180;
                  const padX = 35;
                  const padY = 20;
                  const chartW = width - padX - 15;
                  const chartH = height - padY - 20;

                  const polHistory = pol.history || [];
                  const irqHistory = irq.history || [];
                  const count = Math.max(polHistory.length, irqHistory.length, 1);

                  const polPoints = polHistory.map((pt, i) => {
                    const x = padX + (i / Math.max(1, count - 1)) * chartW;
                    const y = padY + chartH - (Math.min(100, Math.max(0, pt.efficiencyPct)) / 100) * chartH;
                    return `${x},${y}`;
                  });
                  const polPath = polPoints.length > 0 ? `M ${polPoints.join(' L ')}` : '';

                  const irqPoints = irqHistory.map((pt, i) => {
                    const x = padX + (i / Math.max(1, count - 1)) * chartW;
                    const y = padY + chartH - (Math.min(100, Math.max(0, pt.efficiencyPct)) / 100) * chartH;
                    return `${x},${y}`;
                  });
                  const irqPath = irqPoints.length > 0 ? `M ${irqPoints.join(' L ')}` : '';

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-hidden">
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
                            <text
                              x={padX - 6}
                              y={y + 3}
                              textAnchor="end"
                              className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium"
                            >
                              {level}%
                            </text>
                          </g>
                        );
                      })}

                      {[0, Math.round(count / 2), count].map((tickVal, idx) => {
                        const x = padX + (idx / 2) * chartW;
                        return (
                          <text
                            key={idx}
                            x={x}
                            y={height - 4}
                            textAnchor={idx === 0 ? 'start' : idx === 2 ? 'end' : 'middle'}
                            className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium"
                          >
                            T{tickVal}
                          </text>
                        );
                      })}

                      {polPath && (
                        <path
                          d={polPath}
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {irqPath && (
                        <path
                          d={irqPath}
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

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-emerald-400 shrink-0" />
                  <span>
                    {isEs ? 'Interrupciones: media del ' : 'Interrupts: avg '}
                    <strong className="text-slate-800 dark:text-slate-100">{irq.cpuEfficiencyPct}%</strong>
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>
                    {isEs ? 'Sondeo: caída a ' : 'Polling: drops to '}
                    <strong className="text-slate-800 dark:text-slate-100">{pol.cpuEfficiencyPct}%</strong>
                  </span>
                </span>
              </div>
            </div>

            {/* Chart 2: Throughput / Completed Requests Cumulative Timeline */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isEs
                    ? 'Progreso de Solicitudes Completadas (Throughput Temporal)'
                    : 'Completed Requests Progress (Temporal Throughput)'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
                  {isEs ? 'Total Carga:' : 'Total Load:'} {currentScenario.requestsToInject.length}
                </span>
              </div>

              {/* Responsive SVG Throughput Chart */}
              <div className="relative w-full h-48 sm:h-56 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 p-2">
                {(() => {
                  const width = 460;
                  const height = 180;
                  const padX = 30;
                  const padY = 20;
                  const chartW = width - padX - 15;
                  const chartH = height - padY - 20;

                  const maxReqs = Math.max(currentScenario.requestsToInject.length, 1);
                  const polHistory = pol.history || [];
                  const irqHistory = irq.history || [];
                  const count = Math.max(polHistory.length, irqHistory.length, 1);

                  const polPoints = polHistory.map((pt, i) => {
                    const x = padX + (i / Math.max(1, count - 1)) * chartW;
                    const y = padY + chartH - (pt.completedRequests / maxReqs) * chartH;
                    return `${x},${y}`;
                  });
                  const polPath = polPoints.length > 0 ? `M ${polPoints.join(' L ')}` : '';

                  const irqPoints = irqHistory.map((pt, i) => {
                    const x = padX + (i / Math.max(1, count - 1)) * chartW;
                    const y = padY + chartH - (pt.completedRequests / maxReqs) * chartH;
                    return `${x},${y}`;
                  });
                  const irqPath = irqPoints.length > 0 ? `M ${irqPoints.join(' L ')}` : '';

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-hidden">
                      {[0, Math.round(maxReqs / 2), maxReqs].map((level, idx) => {
                        const y = padY + chartH - (level / maxReqs) * chartH;
                        return (
                          <g key={idx}>
                            <line
                              x1={padX}
                              y1={y}
                              x2={padX + chartW}
                              y2={y}
                              className="stroke-slate-200 dark:stroke-slate-700"
                              strokeDasharray="3 3"
                              strokeWidth="1"
                            />
                            <text
                              x={padX - 6}
                              y={y + 3}
                              textAnchor="end"
                              className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium"
                            >
                              {level}
                            </text>
                          </g>
                        );
                      })}

                      <text x={padX} y={height - 4} textAnchor="start" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                        T0
                      </text>
                      <text x={padX + chartW} y={height - 4} textAnchor="end" className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono">
                        T{count}
                      </text>

                      {polPath && (
                        <path
                          d={polPath}
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}

                      {irqPath && (
                        <path
                          d={irqPath}
                          fill="none"
                          stroke="#09843B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  );
                })()}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>
                  {isEs
                    ? 'Interrupciones finaliza con anticipación aprovechando asincronía'
                    : 'Interrupts finish earlier by leveraging hardware asynchrony'}
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                  IRQ: {irq.totalRequestsCompleted} vs {isEs ? 'Sondeo' : 'Polling'}: {pol.totalRequestsCompleted}
                </span>
              </div>
            </div>

            {/* Chart 3: Device Latency & Waiting Time Breakdown (Bar Chart) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isEs
                    ? 'Comparativa de Tiempo de Espera en Cola por Periférico (Ticks de Retraso)'
                    : 'Queue Wait Time Comparison by Peripheral (Delay Ticks)'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEs ? 'Menor tiempo en cola = mayor responsividad' : 'Lower queue time = higher responsiveness'}
                </span>
              </div>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {(['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'] as const).map((devId) => {
                  const irqMap = { KEYBOARD: 1, DISK: 14, PRINTER: 7, NETWORK: 11 };
                  const devName = `${DEVICE_LABELS[lang][devId].displayName} (IRQ ${irqMap[devId]})`;

                  const polDev = pol.deviceBreakdown?.[devId] || { avgWait: pol.avgWaitTicks };
                  const irqDev = irq.deviceBreakdown?.[devId] || { avgWait: irq.avgWaitTicks };

                  const maxWait = Math.max(polDev.avgWait, irqDev.avgWait, 10);
                  const polBarH = Math.min(100, Math.round((polDev.avgWait / maxWait) * 100));
                  const irqBarH = Math.min(100, Math.round((irqDev.avgWait / maxWait) * 100));

                  return (
                    <div key={devId} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{devName}</div>

                      {/* Side-by-side vertical bar indicators */}
                      <div className="h-24 flex items-end justify-center gap-3 pt-2 px-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        {/* Interrupts Bar */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[10px] font-mono font-bold text-[#09843B] dark:text-emerald-400">
                            {irqDev.avgWait}t
                          </span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-16 flex items-end">
                            <div
                              className="w-full bg-[#09843B] dark:bg-emerald-500 rounded-t-md transition-all duration-300"
                              style={{ height: `${Math.max(8, irqBarH)}%` }}
                              title={`${isEs ? 'Interrupciones' : 'Interrupts'}: ${irqDev.avgWait} ticks`}
                            />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">IRQ</span>
                        </div>

                        {/* Polling Bar */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                            {polDev.avgWait}t
                          </span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-16 flex items-end">
                            <div
                              className="w-full bg-amber-500 rounded-t-md transition-all duration-300"
                              style={{ height: `${Math.max(8, polBarH)}%` }}
                              title={`${isEs ? 'Sondeo' : 'Polling'}: ${polDev.avgWait} ticks`}
                            />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">Poll</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                        {isEs ? 'Diferencia:' : 'Difference:'}{' '}
                        <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                          -{Math.max(0, Math.round((polDev.avgWait - irqDev.avgWait) * 10) / 10)}t
                        </strong>{' '}
                        {isEs ? 'en IRQ' : 'in IRQ'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytical Conclusion Box */}
      {pol && irq && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs transition-colors">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#09843B] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {isEs ? 'Dictamen Comparativo del Sistema Operativo' : 'Operating System Comparative Verdict'}
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
            {isEs ? (
              <>
                <p>
                  <strong>Ganancia de Rendimiento:</strong> El mecanismo de{' '}
                  <span className="text-[#09843B] dark:text-emerald-400 font-bold">Interrupciones</span> liberó un{' '}
                  <span className="text-[#09843B] dark:text-emerald-400 font-bold font-mono">
                    +{(irq.cpuEfficiencyPct - pol.cpuEfficiencyPct).toFixed(1)}%
                  </span>{' '}
                  adicional de capacidad de cómputo para tareas de usuario, eliminando los{' '}
                  <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">{pol.pollingWasteTicks} ciclos</span> que el
                  Sondeo desperdició testeando los registros de estado (<code className="font-mono text-[#09843B] dark:text-emerald-400">STATUS_REG</code>).
                </p>
                <p>
                  <strong>Cuándo conviene cada uno:</strong> El Sondeo es únicamente viable en controladores ultra-rápidos
                  o sistemas embebidos de un solo hilo donde el overhead de guardar registros en pila y cambiar de contexto
                  supera el tiempo de la propia transferencia. Para periféricos con latencia mecánica (disco, impresora) o
                  red interactiva, las <strong>Interrupciones</strong> son indiscutiblemente superiores.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Performance Gain:</strong> The{' '}
                  <span className="text-[#09843B] dark:text-emerald-400 font-bold">Interrupts</span> mechanism freed an additional{' '}
                  <span className="text-[#09843B] dark:text-emerald-400 font-bold font-mono">
                    +{(irq.cpuEfficiencyPct - pol.cpuEfficiencyPct).toFixed(1)}%
                  </span>{' '}
                  of compute capacity for user tasks, eliminating the{' '}
                  <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">{pol.pollingWasteTicks} cycles</span> that
                  Polling wasted checking status registers (<code className="font-mono text-[#09843B] dark:text-emerald-400">STATUS_REG</code>).
                </p>
                <p>
                  <strong>When each mechanism applies:</strong> Polling is only viable on ultra-fast controllers or single-threaded
                  embedded systems where the overhead of pushing registers to the stack and context-switching exceeds the transfer
                  time itself. For peripherals with mechanical latency (disk, printer) or interactive networking,{' '}
                  <strong>Interrupts</strong> are indisputably superior.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
