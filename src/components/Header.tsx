/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Simulador de Periféricos & Interrupciones
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 * Universidad Simón Bolívar
 */

import React from 'react';
import { Cpu, FileText, Plus, HelpCircle, Layers, Activity, GitCompare, Database, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: 'simulator' | 'comparison' | 'experiments' | 'testmatrix' | 'report';
  onSelectTab: (tab: 'simulator' | 'comparison' | 'experiments' | 'testmatrix' | 'report') => void;
  onOpenNewRequest: () => void;
  onOpenReport: () => void;
  onOpenLiveReport?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewRequest,
  onOpenReport,
  onOpenLiveReport,
  darkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 shadow-xs w-full max-w-full overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Zone 1: Universidad Simón Bolívar Logo & Project Title */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#simulator"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('simulator');
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="p-1 sm:p-1.5 rounded-xl bg-white dark:bg-transparent shadow-2xs dark:shadow-none border border-slate-200/60 dark:border-transparent transition-all">
                {/* Light mode logo */}
                <img
                  src="/assets/aistudio/image_dddfa0f9.png"
                  alt="Universidad Simón Bolívar"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102 dark:hidden"
                />
                {/* Dark mode logo */}
                <img
                  src="/assets/aistudio/Captura_de_pantalla_2026-11-12_085043-removebg-preview_0b4e7ef0.png"
                  alt="Universidad Simón Bolívar"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102 hidden dark:block"
                />
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-[#09843B] dark:group-hover:text-[#0ca54a] transition-colors">
                  I/O Simulator
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Sistemas Operativos · Proyecto #10
                </div>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links with USB Green Active Indicators */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectTab('simulator')}
              className={`flex items-center gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium ${
                currentTab === 'simulator'
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Simulador</span>
            </button>

            <button
              onClick={() => onSelectTab('comparison')}
              className={`flex items-center gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium ${
                currentTab === 'comparison'
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Sondeo vs IRQ</span>
            </button>

            <button
              onClick={() => onSelectTab('experiments')}
              className={`flex items-center gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium ${
                currentTab === 'experiments'
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Reto de Fallos</span>
            </button>

            <button
              onClick={() => onSelectTab('testmatrix')}
              className={`flex items-center gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium ${
                currentTab === 'testmatrix'
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Matriz de Pruebas</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('report');
                onOpenReport();
              }}
              className={`flex items-center gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium ${
                currentTab === 'report'
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Informe Técnico</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Academic Info & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {onOpenLiveReport && (
              <button
                onClick={onOpenLiveReport}
                className="px-3.5 py-2 text-xs font-bold text-[#09843B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Generar informe de auditoría de la simulación cargada en memoria RAM"
              >
                <Database className="w-3.5 h-3.5 text-[#09843B] dark:text-emerald-400" />
                <span>Informe en RAM</span>
              </button>
            )}

            <button
              onClick={onOpenReport}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap hidden md:inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Ver sustentación técnica, conceptos de SO y simplificaciones"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sustentación</span>
            </button>

            <button
              onClick={onOpenNewRequest}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nueva Solicitud</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet nav bar */}
        <div className="flex xl:hidden items-center justify-between gap-3 py-2 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center overflow-x-auto gap-4 py-0.5">
            <button
              onClick={() => onSelectTab('simulator')}
              className={`whitespace-nowrap ${currentTab === 'simulator' ? 'text-[#09843B] dark:text-[#0ca54a] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Simulador
            </button>
            <button
              onClick={() => onSelectTab('comparison')}
              className={`whitespace-nowrap ${currentTab === 'comparison' ? 'text-[#09843B] dark:text-[#0ca54a] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Sondeo vs IRQ
            </button>
            <button
              onClick={() => onSelectTab('experiments')}
              className={`whitespace-nowrap ${currentTab === 'experiments' ? 'text-[#09843B] dark:text-[#0ca54a] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Reto de Fallos
            </button>
            <button
              onClick={() => onSelectTab('testmatrix')}
              className={`whitespace-nowrap ${currentTab === 'testmatrix' ? 'text-[#09843B] dark:text-[#0ca54a] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Matriz de Pruebas
            </button>
            <button
              onClick={() => {
                onSelectTab('report');
                onOpenReport();
              }}
              className={`whitespace-nowrap ${currentTab === 'report' ? 'text-[#09843B] dark:text-[#0ca54a] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Sustentación
            </button>
            {onOpenLiveReport && (
              <button
                onClick={onOpenLiveReport}
                className="whitespace-nowrap font-bold text-[#09843B] dark:text-emerald-400"
              >
                Informe en RAM
              </button>
            )}
          </div>

          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 cursor-pointer"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
