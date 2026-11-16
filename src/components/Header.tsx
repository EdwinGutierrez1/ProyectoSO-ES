/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Simulador de Periféricos & Interrupciones
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 * Universidad Simón Bolívar
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  HelpCircle,
  Layers,
  Activity,
  GitCompare,
  Database,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleTabClick = (tab: 'simulator' | 'comparison' | 'experiments' | 'testmatrix' | 'report') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'simulator', label: 'Simulador', icon: Layers, subtitle: 'Arquitectura & Periféricos' },
    { id: 'comparison', label: 'Sondeo vs IRQ', icon: GitCompare, subtitle: 'Gráficas en Tiempo Real' },
    { id: 'experiments', label: 'Reto de Fallos', icon: Activity, subtitle: 'Inyección de Retrasos' },
    { id: 'testmatrix', label: 'Matriz de Pruebas', icon: HelpCircle, subtitle: 'Rúbrica de Evaluación' },
    { id: 'report', label: 'Informe Técnico', icon: FileText, subtitle: 'Sustentación & Teoría SO' },
  ] as const;

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 shadow-xs w-full max-w-full transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 h-16 sm:h-20">
          {/* Zone 1: Universidad Simón Bolívar Logo & Project Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <a
              href="#simulator"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('simulator');
              }}
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0"
            >
              <div className="p-1 sm:p-1.5 rounded-xl bg-white dark:bg-transparent shadow-2xs dark:shadow-none border border-slate-200/60 dark:border-transparent transition-all shrink-0">
                {/* Light mode logo (green) */}
                <img
                  src="/assets/aistudio/image_dddfa0f9.png"
                  alt="Universidad Simón Bolívar"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-102 dark:hidden"
                />
                {/* Dark mode logo (white transparent) */}
                <img
                  src="/assets/aistudio/Captura_de_pantalla_2026-11-12_085043-removebg-preview_0b4e7ef0.png"
                  alt="Universidad Simón Bolívar"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-102 hidden dark:block"
                />
              </div>

              <div className="h-7 sm:h-8 w-px bg-slate-200 dark:bg-slate-700 hidden min-[480px]:block shrink-0" />

              <div className="min-w-0 hidden min-[480px]:block">
                <div className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-[#09843B] dark:group-hover:text-[#0ca54a] transition-colors truncate">
                  I/O Simulator
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate hidden sm:block">
                  Sistemas Operativos · Proyecto #10
                </div>
              </div>
            </a>
          </div>

          {/* Zone 2: Desktop Navigation Links (Visible on xl screens and wider) */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs 2xl:text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabClick(item.id);
                    if (item.id === 'report') {
                      onOpenReport();
                    }
                  }}
                  className={`flex items-center gap-1.5 2xl:gap-2 transition-all whitespace-nowrap shrink-0 py-2 border-b-2 font-medium cursor-pointer ${
                    isActive
                      ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-[#09843B] dark:hover:text-[#0ca54a]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions on the Right (Adaptive & Never Overflowing) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* Desktop Action: Live RAM Report (visible on xl+ so it's never orphaned between 1280px and 1535px) */}
            {onOpenLiveReport && (
              <button
                onClick={onOpenLiveReport}
                className="px-2.5 2xl:px-3 py-2 text-xs font-bold text-[#09843B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800 rounded-xl transition-colors whitespace-nowrap hidden xl:inline-flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                title="Generar informe de auditoría de la simulación cargada en memoria RAM"
              >
                <Database className="w-3.5 h-3.5 text-[#09843B] dark:text-emerald-400" />
                <span>Informe en RAM</span>
              </button>
            )}

            {/* Primary Action Button (Compact on small screens, full on tablet+) */}
            <button
              onClick={onOpenNewRequest}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] rounded-lg sm:rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
              title="Crear y encolar nueva solicitud de E/S"
            >
              <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
              <span className="hidden min-[400px]:inline">Nueva Solicitud</span>
              <span className="min-[400px]:hidden">E/S</span>
            </button>

            {/* Mobile / Tablet Menu Button (Toggles full responsive menu) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              aria-expanded={mobileMenuOpen}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border transition-all cursor-pointer xl:hidden flex items-center justify-center shadow-2xs shrink-0 ${
                mobileMenuOpen
                  ? 'border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a]'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-[#09843B] dark:text-[#0ca54a]" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Horizontal Scrollable Tab Bar for Tablet / Mobile (visible when menu is closed) */}
        {!mobileMenuOpen && (
          <div className="flex xl:hidden items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 py-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium w-full max-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabClick(item.id);
                    if (item.id === 'report') onOpenReport();
                  }}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] font-bold border border-[#09843B]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onOpenLiveReport && (
              <button
                onClick={onOpenLiveReport}
                className="px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 font-semibold shrink-0 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Informe RAM</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fully Responsive Mobile / Tablet Deployed Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full max-w-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 sm:px-6 py-4 shadow-xl space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Módulos del Simulador
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabClick(item.id);
                      if (item.id === 'report') onOpenReport();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#09843B]/10 dark:bg-[#0ca54a]/20 border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a]'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-[#09843B] text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Panels in Deployed Menu */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Acciones & Reportes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onOpenLiveReport && (
                <button
                  onClick={() => {
                    onOpenLiveReport();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-left flex items-center gap-2.5 text-xs font-bold text-[#09843B] dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                >
                  <Database className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate">Informe en RAM (En Vivo)</div>
                    <div className="text-[10px] font-normal text-emerald-800 dark:text-emerald-300/80 truncate">
                      Estado cargado en memoria volátil
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenReport();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <div className="truncate">Informe Técnico y Sustentación</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Rúbrica 5.0 · Conceptos SO
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic Info & Quick Close in Deployed Menu */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Universidad Simón Bolívar · SO V</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#09843B] dark:text-[#0ca54a] font-bold text-xs cursor-pointer hover:underline"
            >
              Cerrar menú
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
