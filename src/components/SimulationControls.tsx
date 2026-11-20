/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Simulador de Periféricos & Interrupciones
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { IOMode } from '../types/io-simulator';
import { Play, Pause, SkipForward, RotateCcw, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SimulationControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  mode: IOMode;
  onChangeMode: (newMode: IOMode) => void;
  speedMs: number;
  onChangeSpeed: (newSpeedMs: number) => void;
  autoGenerate: boolean;
  onToggleAutoGenerate: () => void;
  tickCount: number;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onTogglePlay,
  onStep,
  onReset,
  mode,
  onChangeMode,
  speedMs,
  onChangeSpeed,
  autoGenerate,
  onToggleAutoGenerate,
  tickCount,
}) => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4 shadow-xs transition-colors">
      {/* Primary Action Buttons: Play/Pause, Step, Reset */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
        <button
          onClick={onTogglePlay}
          className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current shrink-0" />
              <span>{isEs ? 'Pausar Simulación' : 'Pause Simulation'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>{isEs ? 'Iniciar Simulación' : 'Start Simulation'}</span>
            </>
          )}
        </button>

        <button
          onClick={onStep}
          disabled={isRunning}
          className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer shrink-0"
          title={isEs ? 'Avanzar exactamente 1 tick de reloj de CPU' : 'Advance exactly 1 CPU clock tick'}
        >
          <SkipForward className="w-4 h-4 text-[#09843B] dark:text-emerald-400" />
          <span className="hidden sm:inline">{isEs ? 'Paso a Paso' : 'Step'}</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer shrink-0"
          title={isEs ? 'Reiniciar ticks y estado de dispositivos' : 'Reset ticks and device states'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEs ? 'Reiniciar' : 'Reset'}</span>
        </button>

        <div className="font-mono text-xs px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs shrink-0">
          <span className="text-slate-400 dark:text-slate-500 font-sans">Tick: </span>
          <span className="font-bold text-[#09843B] dark:text-emerald-400">{tickCount}</span>
        </div>
      </div>

      {/* Mechanism Selector (Segmented Tab Control) */}
      <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 w-full xl:w-auto">
        <button
          onClick={() => onChangeMode('INTERRUPTS')}
          className={`flex-1 xl:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            mode === 'INTERRUPTS'
              ? 'bg-[#09843B] dark:bg-[#09843B] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 shrink-0 ${mode === 'INTERRUPTS' ? 'text-white' : 'text-[#09843B] dark:text-emerald-400'}`} />
          <span>{isEs ? 'Interrupciones (IRQ)' : 'Interrupts (IRQ)'}</span>
        </button>

        <button
          onClick={() => onChangeMode('POLLING')}
          className={`flex-1 xl:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            mode === 'POLLING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${mode === 'POLLING' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
          <span>{isEs ? 'Sondeo (Polling)' : 'Polling (Busy-Wait)'}</span>
        </button>
      </div>

      {/* Speed & Auto-generation Controls */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full xl:w-auto justify-between xl:justify-end">
        {/* Auto generator toggle */}
        <button
          onClick={onToggleAutoGenerate}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-xs cursor-pointer whitespace-nowrap ${
            autoGenerate
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#09843B] dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 font-bold'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          title={
            isEs
              ? 'Genera solicitudes de entrada/salida de forma automática y continua'
              : 'Automatically and continuously generates I/O requests'
          }
        >
          <Sparkles className="w-3.5 h-3.5 text-[#09843B] dark:text-emerald-400 shrink-0" />
          <span>
            {isEs
              ? `Carga Auto: ${autoGenerate ? 'ACTIVA' : 'OFF'}`
              : `Auto Load: ${autoGenerate ? 'ON' : 'OFF'}`}
          </span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {isEs ? 'Velocidad:' : 'Speed:'}
          </span>
          <select
            value={speedMs}
            onChange={(e) => onChangeSpeed(parseInt(e.target.value, 10))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-emerald-400 shadow-xs"
          >
            <option value={1500}>{isEs ? '0.5x (Lenta)' : '0.5x (Slow)'}</option>
            <option value={800}>1.0x (Normal)</option>
            <option value={400}>{isEs ? '2.0x (Rápida)' : '2.0x (Fast)'}</option>
            <option value={150}>5.0x (Ultra)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
