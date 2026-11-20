/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Simulador de Periféricos & Interrupciones
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulatorEngine } from './services/simulatorEngine';
import { IOMode, DeviceType, FaultType, IORequest } from './types/io-simulator';
import { Header } from './components/Header';
import { SimulationControls } from './components/SimulationControls';
import { ArchitectureView } from './components/ArchitectureView';
import { DeviceCard } from './components/DeviceCard';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ComparisonBench } from './components/ComparisonBench';
import { ExperimentationLab } from './components/ExperimentationLab';
import { TestMatrixView } from './components/TestMatrixView';
import { TechnicalReportModal } from './components/TechnicalReportModal';
import { NewRequestModal } from './components/NewRequestModal';
import { KernelLogView } from './components/KernelLogView';
import { LiveSessionReportModal } from './components/LiveSessionReportModal';
import { RealTimeCharts } from './components/RealTimeCharts';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<
    'simulator' | 'comparison' | 'experiments' | 'testmatrix' | 'report'
  >('simulator');

  // Simulator Instance Reference
  const engineRef = useRef<SimulatorEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new SimulatorEngine('INTERRUPTS', lang);
  }

  // Reactive State Synced from Engine
  const [mode, setMode] = useState<IOMode>('INTERRUPTS');
  const [tickCount, setTickCount] = useState<number>(0);
  const [devices, setDevices] = useState(engineRef.current.devices);
  const [cpu, setCpu] = useState(engineRef.current.cpu);
  const [logs, setLogs] = useState(engineRef.current.logs);
  const [completedRequests, setCompletedRequests] = useState<IORequest[]>([]);
  const [failedRequests, setFailedRequests] = useState<IORequest[]>([]);
  const [history, setHistory] = useState(engineRef.current.history);

  // Simulation Loop Controls
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isLiveReportOpen, setIsLiveReportOpen] = useState<boolean>(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState<boolean>(false);

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Sync state helper
  const syncStateFromEngine = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    setTickCount(engine.tickCount);
    setDevices({ ...engine.devices });
    setCpu({ ...engine.cpu });
    setLogs([...engine.logs]);
    setCompletedRequests([...engine.completedRequests]);
    setFailedRequests([...engine.failedRequests]);
    setHistory([...engine.history]);
  }, []);

  // Sync simulator engine language when UI language changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setLanguage(lang);
      syncStateFromEngine();
    }
  }, [lang, syncStateFromEngine]);

  // Step function
  const handleStep = useCallback(() => {
    const engine = engineRef.current!;

    // If auto-generator is enabled, occasionally inject random request
    if (autoGenerate && Math.random() < 0.35) {
      const devTypes: DeviceType[] = ['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'];
      const chosenDev = devTypes[Math.floor(Math.random() * devTypes.length)];
      const samplePayloads: Record<DeviceType, string> = isEs
        ? {
            KEYBOARD: 'Entrada interactiva de usuario',
            DISK: 'Lectura /etc/hosts (4KB)',
            PRINTER: 'Página de documento PDF',
            NETWORK: 'GET /api/v1/status HTTP/1.1',
          }
        : {
            KEYBOARD: 'Interactive user input',
            DISK: 'Read /etc/hosts (4KB)',
            PRINTER: 'PDF document page',
            NETWORK: 'GET /api/v1/status HTTP/1.1',
          };
      const sampleBytes: Record<DeviceType, number> = {
        KEYBOARD: 4,
        DISK: 4096,
        PRINTER: 8192,
        NETWORK: 1420,
      };

      engine.addRequest({
        deviceType: chosenDev,
        operation: chosenDev === 'PRINTER' ? 'WRITE' : 'READ',
        payload: samplePayloads[chosenDev],
        bytes: sampleBytes[chosenDev],
        priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
        processName: `${isEs ? 'Proceso-Worker' : 'Worker-Process'}-${Math.floor(Math.random() * 90 + 10)}`,
      });
    }

    engine.step();
    syncStateFromEngine();
  }, [autoGenerate, isEs, syncStateFromEngine]);

  // Clock Timer Effect
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      handleStep();
    }, speedMs);

    return () => clearInterval(intervalId);
  }, [isRunning, speedMs, handleStep]);

  // Mode Change
  const handleChangeMode = (newMode: IOMode) => {
    setMode(newMode);
    engineRef.current?.setMode(newMode);
    syncStateFromEngine();
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    engineRef.current?.reset(mode);
    syncStateFromEngine();
  };

  // Quick Event Injection
  const handleInjectQuickEvent = (deviceId: DeviceType) => {
    const engine = engineRef.current!;
    if (deviceId === 'KEYBOARD') {
      engine.addRequest({
        deviceType: 'KEYBOARD',
        operation: 'READ',
        payload: isEs ? 'Pulsación de tecla [Espacio]' : 'Keystroke [Space]',
        bytes: 1,
        priority: 'HIGH',
        processName: isEs ? 'Editor de Texto' : 'Text Editor',
      });
    } else if (deviceId === 'DISK') {
      engine.addRequest({
        deviceType: 'DISK',
        operation: 'READ',
        payload: isEs ? 'Sector LBA 0x0F4B (data.bin)' : 'LBA Sector 0x0F4B (data.bin)',
        bytes: 4096,
        priority: 'NORMAL',
        processName: isEs ? 'Gestor de BD' : 'DB Manager',
      });
    } else if (deviceId === 'PRINTER') {
      engine.addRequest({
        deviceType: 'PRINTER',
        operation: 'WRITE',
        payload: isEs ? 'Documento informe_final.ps' : 'Document final_report.ps',
        bytes: 12288,
        priority: 'LOW',
        processName: isEs ? 'Daemon de Impresión' : 'Print Daemon',
      });
    } else if (deviceId === 'NETWORK') {
      engine.addRequest({
        deviceType: 'NETWORK',
        operation: 'READ',
        payload: isEs ? 'Paquete entrante UDP (Streaming)' : 'Incoming UDP Packet (Streaming)',
        bytes: 1420,
        priority: 'HIGH',
        processName: isEs ? 'Socket de Red' : 'Network Socket',
      });
    }
    syncStateFromEngine();
  };

  // Fault toggle
  const handleToggleFault = (deviceId: DeviceType, fault: FaultType) => {
    engineRef.current?.setFault(deviceId, fault);
    syncStateFromEngine();
  };

  // Latency Change
  const handleChangeLatency = (deviceId: DeviceType, latency: number) => {
    engineRef.current?.setDeviceLatency(deviceId, latency);
    syncStateFromEngine();
  };

  // Custom Request from Modal
  const handleCreateCustomRequest = (params: {
    deviceType: DeviceType;
    operation: 'READ' | 'WRITE';
    payload: string;
    bytes: number;
    priority: 'LOW' | 'NORMAL' | 'HIGH';
    processName: string;
    willFail?: FaultType;
  }) => {
    engineRef.current?.addRequest(params);
    syncStateFromEngine();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} flex flex-col font-sans w-full max-w-full overflow-x-hidden transition-colors`}>
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'report') {
            setIsReportOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenLiveReport={() => setIsLiveReportOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 overflow-x-hidden">
        {/* Tab 1: Interactive Simulator (Hardware, Peripherals, Architecture & Metrics) */}
        {currentTab === 'simulator' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Simulation Controls Toolbar */}
            <SimulationControls
              isRunning={isRunning}
              onTogglePlay={() => setIsRunning(!isRunning)}
              onStep={handleStep}
              onReset={handleReset}
              mode={mode}
              onChangeMode={handleChangeMode}
              speedMs={speedMs}
              onChangeSpeed={setSpeedMs}
              autoGenerate={autoGenerate}
              onToggleAutoGenerate={() => setAutoGenerate(!autoGenerate)}
              tickCount={tickCount}
            />

            {/* Visual Hardware Architecture Model */}
            <ArchitectureView
              cpu={cpu}
              devices={devices}
              mode={mode}
              tickCount={tickCount}
            />

            {/* 4 Peripheral Devices Cards Grid */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#09843B] dark:bg-[#0ca54a] shrink-0" />
                  <span>
                    {isEs
                      ? 'Dispositivos de Entrada/Salida Simulados (Página 12)'
                      : 'Simulated Input/Output Devices (Page 12)'}
                  </span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isEs
                    ? 'Teclado (IRQ 1) · Disco (IRQ 14) · Impresora (IRQ 7) · Red (IRQ 11)'
                    : 'Keyboard (IRQ 1) · Disk (IRQ 14) · Printer (IRQ 7) · Network (IRQ 11)'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {(['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'] as DeviceType[]).map((devId) => (
                  <DeviceCard
                    key={devId}
                    device={devices[devId]}
                    onInjectQuickEvent={handleInjectQuickEvent}
                    onToggleFault={handleToggleFault}
                    onChangeLatency={handleChangeLatency}
                  />
                ))}
              </div>
            </div>

            {/* Metrics Dashboard */}
            <MetricsDashboard
              devices={devices}
              cpu={cpu}
              completedRequests={completedRequests}
              failedRequests={failedRequests}
              totalTicks={tickCount}
              mode={mode}
              onOpenLiveReport={() => setIsLiveReportOpen(true)}
            />

            {/* Real-time Dynamic Behavioral Charts */}
            <RealTimeCharts
              history={history}
              mode={mode}
              devices={devices}
              cpu={cpu}
              completedRequests={completedRequests}
              failedRequests={failedRequests}
              tickCount={tickCount}
            />

            {/* Kernel Event Log Console */}
            <KernelLogView logs={logs} />
          </div>
        )}

        {/* Tab 2: Side-by-Side Comparison (Polling vs Interrupts) */}
        {currentTab === 'comparison' && <ComparisonBench />}

        {/* Tab 3: Experimentation Lab (Delays and Fault Injection) */}
        {currentTab === 'experiments' && <ExperimentationLab />}

        {/* Tab 4: Test Matrix View (Rúbrica Escenarios) */}
        {currentTab === 'testmatrix' && <TestMatrixView />}
      </main>

      {/* Comprehensive Professional Academic University Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-xs mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Institutional & Career Branding */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-3.5">
                {/* Universidad Simón Bolívar Logo (embedded directly) */}
                <img
                  src="/assets/aistudio/image_dddfa0f9.png"
                  alt="Universidad Simón Bolívar"
                  className="h-11 sm:h-12 w-auto object-contain select-none dark:hidden"
                />
                <img
                  src="/assets/aistudio/Captura_de_pantalla_2026-11-12_085043-removebg-preview_0b4e7ef0.png"
                  alt="Universidad Simón Bolívar"
                  className="h-11 sm:h-12 w-auto object-contain select-none hidden dark:block"
                />

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

                {/* Ingeniería de Sistemas Career Logo (adaptive light/dark) */}
                <img
                  src="/assets/aistudio/logosist-removebg-preview_c932a8d5.png"
                  alt="Ingeniería de Sistemas"
                  className="h-12 w-12 sm:h-13 sm:w-13 object-contain select-none dark:hidden"
                />
                <img
                  src="/assets/aistudio/logo-sistemas_c9e1268f.png"
                  alt="Ingeniería de Sistemas"
                  className="h-12 w-12 sm:h-13 sm:w-13 object-contain select-none hidden dark:block"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#09843B] dark:text-emerald-400">
                  {isEs ? 'Programa de Ingeniería de Sistemas' : 'Systems Engineering Program'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {isEs
                    ? 'Institución de Educación Superior comprometida con la excelencia académica, la formación integral y el rigor científico en ingeniería.'
                    : 'Higher Education Institution committed to academic excellence, comprehensive education, and scientific rigor in engineering.'}
                </p>
              </div>
            </div>

            {/* Column 2: Academic Unit & Faculty */}
            <div className="space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                {isEs ? 'Cátedra y Docencia' : 'Course & Faculty'}
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                    {isEs ? 'Asignatura:' : 'Course:'}
                  </span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {isEs ? 'Sistemas Operativos' : 'Operating Systems'}
                  </strong>{' '}
                  {isEs ? '(V Semestre)' : '(5th Semester)'}
                </li>
                <li>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                    {isEs ? 'Docente Titular:' : 'Course Instructor:'}
                  </span>
                  <strong className="text-[#09843B] dark:text-emerald-400 font-bold">MSc. Alvaro Salamanca</strong>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                    {isEs ? 'Facultad:' : 'Faculty:'}
                  </span>
                  <span>{isEs ? 'Facultad de Ingenierías' : 'Faculty of Engineering'}</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Authors & Project Metadata */}
            <div className="space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                {isEs ? 'Equipo de Desarrollo' : 'Development Team'}
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                    {isEs ? 'Estudiantes Asignados:' : 'Assigned Students:'}
                  </span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 space-y-0.5 mt-0.5">
                    <p className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09843B] dark:bg-emerald-400" />
                      <span>Katherine Peñaloza</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09843B] dark:bg-emerald-400" />
                      <span>Edwin Gutierrez</span>
                    </p>
                  </div>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                    {isEs ? 'Propuesta:' : 'Proposal:'}
                  </span>
                  <span>
                    {isEs ? 'Proyecto Final #10 · I/O Simulator' : 'Final Project #10 · I/O Simulator'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Navigation & Defense */}
            <div className="space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                {isEs ? 'Acciones de Sustentación' : 'Defense & Audit Actions'}
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setIsLiveReportOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#09843B] dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <span>{isEs ? 'Informe en Memoria RAM' : 'RAM Memory Report'}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                    {isEs ? 'En Vivo' : 'Live'}
                  </span>
                </button>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-[#09843B]/10 dark:hover:bg-slate-700 hover:text-[#09843B] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{isEs ? 'Sustentación Teórica' : 'Theoretical Defense'}</span>
                  <span className="text-[10px] text-slate-400">PDF</span>
                </button>
                <button
                  onClick={() => setCurrentTab('testmatrix')}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-[#09843B]/10 dark:hover:bg-slate-700 hover:text-[#09843B] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{isEs ? 'Matriz de Pruebas Controladas' : 'Controlled Test Matrix'}</span>
                  <span className="text-[10px] text-slate-400">{isEs ? '4 Casos' : '4 Cases'}</span>
                </button>
                <button
                  onClick={() => setIsNewRequestOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[#09843B] hover:bg-[#076b30] dark:bg-[#09843B] dark:hover:bg-[#0ca54a] text-white text-xs font-bold transition-colors flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <span>{isEs ? 'Generar Solicitud E/S' : 'Generate I/O Request'}</span>
                  <span className="text-[10px] text-emerald-100">{isEs ? '+ Inyectar' : '+ Inject'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Accreditation Line */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <p>
              {isEs
                ? '© 2026 Universidad Simón Bolívar · Ingeniería de Sistemas · Sistemas Operativos V Semestre'
                : '© 2026 Universidad Simón Bolívar · Systems Engineering · Operating Systems 5th Semester'}
            </p>
            <p className="text-slate-400 dark:text-slate-500">
              {isEs ? 'Evaluación Final con Rúbrica de Excelencia · Docente: ' : 'Final Evaluation with Excellence Rubric · Instructor: '}
              <span className="text-slate-600 dark:text-slate-300 font-medium">MSc. Alvaro Salamanca</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Live RAM Simulation Session Report Modal */}
      <LiveSessionReportModal
        isOpen={isLiveReportOpen}
        onClose={() => setIsLiveReportOpen(false)}
        tickCount={tickCount}
        mode={mode}
        cpu={cpu}
        devices={devices}
        completedRequests={completedRequests}
        failedRequests={failedRequests}
        logs={logs}
        history={history}
      />

      {/* Technical Report & Academic Defense Modal */}
      <TechnicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleCreateCustomRequest}
      />
    </div>
  );
}
