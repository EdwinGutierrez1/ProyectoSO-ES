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
  Languages,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { lang, toggleLang } = useLanguage();
  const isEs = lang === 'es';

  const handleTabClick = (tab: 'simulator' | 'comparison' | 'experiments' | 'testmatrix' | 'report') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'simulator',
      label: isEs ? 'Simulador' : 'Simulator',
      icon: Layers,
      subtitle: isEs ? 'Arquitectura & Periféricos' : 'Architecture & Peripherals',
    },
    {
      id: 'comparison',
      label: isEs ? 'Sondeo vs IRQ' : 'Polling vs IRQ',
      icon: GitCompare,
      subtitle: isEs ? 'Gráficas en Tiempo Real' : 'Real-Time Charts',
    },
    {
      id: 'experiments',
      label: isEs ? 'Reto de Fallos' : 'Fault Challenge',
      icon: Activity,
      subtitle: isEs ? 'Inyección de Retrasos' : 'Delay & Fault Injection',
    },
    {
      id: 'testmatrix',
      label: isEs ? 'Matriz de Pruebas' : 'Test Matrix',
      icon: HelpCircle,
      subtitle: isEs ? 'Rúbrica de Evaluación' : 'Evaluation Rubric',
    },
    {
      id: 'report',
      label: isEs ? 'Informe Técnico' : 'Technical Report',
      icon: FileText,
      subtitle: isEs ? 'Sustentación & Teoría SO' : 'Defense & OS Theory',
    },
  ] as const;

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 shadow-xs w-full max-w-full transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 min-h-16 sm:min-h-20 py-2">
          {/* Zone 1 (Left): Project Title */}
          <div className="hidden sm:flex items-center min-w-0 justify-self-start">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                I/O Simulator
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {isEs ? 'Sistemas Operativos · Proyecto #10' : 'Operating Systems · Project #10'}
              </div>
            </div>
          </div>

          {/* Zone 2 (Center): Universidad Simón Bolívar Logo embedded directly without button/hover */}
          <div className="flex items-center justify-start sm:justify-center justify-self-start sm:justify-self-center shrink-0">
            {/* Light mode logo (green) */}
            <img
              src="/assets/aistudio/image_dddfa0f9.png"
              alt="Universidad Simón Bolívar"
              className="h-9 min-[420px]:h-10 sm:h-11 md:h-12 w-auto object-contain select-none dark:hidden"
            />
            {/* Dark mode logo (white transparent) */}
            <img
              src="/assets/aistudio/Captura_de_pantalla_2026-11-12_085043-removebg-preview_0b4e7ef0.png"
              alt="Universidad Simón Bolívar"
              className="h-9 min-[420px]:h-10 sm:h-11 md:h-12 w-auto object-contain select-none hidden dark:block"
            />
          </div>

          {/* Zone 3: Actions on the Right (Consistent & Never Overflowing on Any Screen) */}
          <div className="flex items-center justify-self-end gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Button (ES / EN) */}
            <button
              onClick={toggleLang}
              aria-label={isEs ? 'Switch to English' : 'Cambiar a español'}
              title={isEs ? 'Switch language to English (EN)' : 'Cambiar idioma a Español (ES)'}
              className="px-2 sm:px-2.5 py-2 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 shadow-2xs shrink-0"
            >
              <Languages className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a] shrink-0" />
              <span>{isEs ? 'EN' : 'ES'}</span>
            </button>

            {/* Theme Toggle Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                aria-label={
                  darkMode
                    ? isEs
                      ? 'Cambiar a modo claro'
                      : 'Switch to light mode'
                    : isEs
                    ? 'Cambiar a modo oscuro'
                    : 'Switch to dark mode'
                }
                title={
                  darkMode
                    ? isEs
                      ? 'Cambiar a modo claro'
                      : 'Switch to light mode'
                    : isEs
                    ? 'Cambiar a modo oscuro'
                    : 'Switch to dark mode'
                }
                className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewRequest}
              className="px-2.5 sm:px-4 py-2 text-xs font-bold text-white bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              title={isEs ? 'Crear y encolar nueva solicitud de E/S' : 'Create and enqueue a new I/O request'}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden min-[400px]:inline">
                {isEs ? 'Nueva Solicitud' : 'New Request'}
              </span>
              <span className="min-[400px]:hidden">{isEs ? 'E/S' : 'I/O'}</span>
            </button>

            {/* Quick Navigation Drawer Toggle (Always accessible) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={
                mobileMenuOpen
                  ? isEs
                    ? 'Cerrar menú'
                    : 'Close menu'
                  : isEs
                  ? 'Abrir menú de navegación'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className={`p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border transition-all cursor-pointer flex items-center justify-center shadow-2xs shrink-0 ${
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

        {/* Row 2: Organized Navigation Strip across ALL screen sizes (visible when drawer is closed) */}
        {!mobileMenuOpen && (
          <nav
            aria-label={isEs ? 'Navegación principal' : 'Main navigation'}
            className="flex items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 py-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-medium w-full max-w-full"
          >
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
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] font-bold border border-[#09843B]/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onOpenLiveReport && (
              <button
                onClick={onOpenLiveReport}
                className="px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 text-[#09843B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/60 font-semibold transition-colors shrink-0 cursor-pointer"
                title={
                  isEs
                    ? 'Generar informe de auditoría de la simulación cargada en memoria RAM'
                    : 'Generate audit report for the simulation loaded in RAM'
                }
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>{isEs ? 'Informe RAM' : 'RAM Report'}</span>
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Expandable Overview Menu Drawer */}
      {mobileMenuOpen && (
        <div className="w-full max-w-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 sm:px-6 py-4 shadow-xl">
          <div className="max-w-7xl mx-auto space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {isEs ? 'Módulos del Simulador' : 'Simulator Modules'}
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
                {isEs ? 'Acciones & Reportes' : 'Actions & Reports'}
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
                      <div className="truncate">{isEs ? 'Informe en RAM (En Vivo)' : 'RAM Report (Live)'}</div>
                      <div className="text-[10px] font-normal text-emerald-800 dark:text-emerald-300/80 truncate">
                        {isEs ? 'Estado cargado en memoria volátil' : 'State loaded in volatile memory'}
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
                    <div className="truncate">
                      {isEs ? 'Informe Técnico y Sustentación' : 'Technical Report & Defense'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {isEs ? 'Rúbrica 5.0 · Conceptos SO' : 'Rubric 5.0 · OS Concepts'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Academic Info & Quick Close in Deployed Menu */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                {isEs ? 'Universidad Simón Bolívar · SO V' : 'Universidad Simón Bolívar · OS V'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#09843B] dark:text-[#0ca54a] font-bold text-xs cursor-pointer hover:underline"
              >
                {isEs ? 'Cerrar menú' : 'Close menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
