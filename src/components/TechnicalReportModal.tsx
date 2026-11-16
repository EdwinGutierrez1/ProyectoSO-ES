/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Informe Técnico y Guía de Sustentación
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Award, Users } from 'lucide-react';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-start sm:items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] border border-[#09843B]/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Informe Técnico y Sustentación</h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Universidad Simón Bolívar · Sistemas Operativos V Semestre · Documento de Entrega
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar informe técnico"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            <button
              onClick={handlePrintOrDownload}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
              title="Imprimir o guardar como PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar informe técnico"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-sm flex-1 overflow-y-auto leading-relaxed">
          {/* Academic Header with Official USB Vertical Logo */}
          <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-3">
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
              <span>Proyecto Final de Programación #10 · Rúbrica 5.0</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              I/O Simulator: Simulador de Periféricos & Interrupciones
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Universidad Simón Bolívar · Facultad de Ingenierías · Carrera de Ingeniería de Sistemas
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Asignatura: Sistemas Operativos (V Semestre)
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Docente:</span>
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

          {/* Section 1: Problem Definition */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                01
              </span>
              <span>Definición del Problema</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
              Los dispositivos de Entrada/Salida operan a velocidades de varios órdenes de magnitud inferiores a la
              de la Unidad Central de Procesamiento (CPU). Mientras una CPU ejecuta miles de millones de instrucciones
              por segundo, un disco mecánico o una impresora requieren milisegundos o segundos para completar una transferencia.
              El objetivo de este proyecto es simular y contrastar cuantitativamente dos paradigmas de atención:
              la <strong className="text-slate-900 dark:text-slate-100">espera activa (Polling o Sondeo)</strong> y la <strong className="text-[#09843B] dark:text-[#0ca54a]">E/S gobernada por interrupciones de hardware (Interrupt-driven I/O)</strong>,
              evaluando su impacto en el tiempo de CPU útil, la latencia de respuesta y la tolerancia ante fallos de periféricos.
            </p>
          </section>

          {/* Section 2: OS Concepts Represented */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                02
              </span>
              <span>Conceptos de Sistemas Operativos Representados</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">Controladores y Registros de Hardware</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cada dispositivo cuenta con un controlador que expone registros de hardware: <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">STATUS_REG</code> (READY, BUSY, DONE, ERROR), <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">CONTROL_REG</code> (Start, InterruptEnable, Reset) y <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">DATA_REG</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">Líneas IRQ y PIC (Controlador de Interrupciones)</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Modelado de las líneas de solicitud de interrupción estándar x86: IRQ 1 (Teclado), IRQ 14 (Controlador de Disco), IRQ 7 (Puerto de Impresora) e IRQ 11 (Tarjeta de Red).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">Rutinas ISR y Cambio de Contexto</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Simulación del ciclo de interrupción de hardware: salvaguarda de registros en pila, indexación de la Tabla de Vectores de Interrupción (IVT), ejecución de la ISR para transferir datos a memoria RAM, y reanudación del proceso con IRET.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">Espera Activa vs Asincronía</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  En Sondeo, la CPU queda bloqueada en un bucle <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">while(!ready)</code> consumiendo ciclos sin cómputo útil. En Interrupciones, el proceso se bloquea y la CPU ejecuta otros procesos hasta el pulso IRQ.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Model Simplifications (Mandatory per PDF page 2) */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                03
              </span>
              <span>Simplificaciones del Modelo (Exigencia Documental)</span>
            </h3>
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p className="font-medium text-amber-900 dark:text-amber-300">
                Como estipula la pauta docente, todo simulador de sistemas operativos debe explicitar sus simplificaciones y no presentarse como medición de hardware físico:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                <li>
                  <strong className="text-slate-800 dark:text-slate-100">Escala Temporal Discreta:</strong> La CPU y los controladores avanzan en unidades de <em>ticks</em> discretos de reloj lógico en lugar de nanosegundos físicos reales.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-100">Abstracción del DMA Físico:</strong> La transferencia de datos entre el búfer del controlador y la memoria RAM principal se modela en el contexto de la ISR de forma instantánea sin implementar canales DMA 8237 ni scatter-gather físico.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-100">Aislamiento de Entorno:</strong> No se controla hardware físico del equipo host; la simulación se ejecuta de manera segura y determinista dentro de una máquina de estados virtual en el navegador web.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-100">Jerarquía de Memoria Simplificada:</strong> No se modelan fallos de caché L1/L2 ni contención en el bus PCIe durante ráfagas simultáneas.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Experimental Findings & Conclusion */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                04
              </span>
              <span>Resultados Experimentales y Conclusiones</span>
            </h3>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p>
                <strong className="text-slate-900 dark:text-slate-100">1. Eficiencia de CPU:</strong> En cargas de trabajo normales, el esquema de interrupciones
                mantiene una eficiencia de CPU del 93-98%, mientras que el sondeo activo cae a menos del 40-50%,
                desperdiciando la mayoría de los ciclos en comprobaciones estériles del registro <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG</code>.
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-100">2. Reto de Fallos y Retrasos:</strong> Al inyectar altas latencias o fallos de hardware
                (atasco en impresora, sector defectuoso en disco), el Sondeo colapsa el rendimiento global del sistema,
                reteniendo el procesador en bucles de espera. Por el contrario, las Interrupciones gestionan la excepción
                inmediatamente sin bloquear a los demás procesos de usuario.
              </p>
            </div>
          </section>

          {/* Section 5: Sustentation Prep Q&A for Katherine & Edwin */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                05
              </span>
              <span>Guía de Preguntas para Sustentación Oral (Rúbrica 5.0)</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  P1: ¿Por qué el sondeo (polling) no siempre es descartado en sistemas reales?
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">R:</strong> En dispositivos ultra-rápidos (ej. tarjetas de red de 100 Gbps o memoria NVMe ultra-veloz), el costo en nanosegundos de un cambio de contexto por interrupción (salvar registros, vaciar pipeline de CPU, saltar a la ISR) es mayor que el tiempo de espera. Mecanismos como Linux NAPI o DPDK usan sondeo controlado cuando hay tráfico masivo para evitar tormentas de interrupciones (interrupt storms).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  P2: ¿Qué ocurre a nivel de CPU cuando una línea IRQ se dispara?
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">R:</strong> La CPU termina la instrucción en curso, verifica que el flag IF (Interrupt Flag) esté activo, envía una señal INTA al PIC, recibe el número de vector de interrupción, empuja el contador de programa (PC) y registros a la pila del kernel, salta a la dirección de la ISR según la tabla IVT, ejecuta el servicio de E/S y retorna con IRET.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  P3: ¿Cómo manejó el simulador los fallos de hardware?
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">R:</strong> Mediante bits dedicados en <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG (0x08)</code> y activación de interrupciones de excepción de hardware que permiten al kernel abortar la solicitud fallida sin colgar los procesos paralelos.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-2.5 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
            Universidad Simón Bolívar · Ingeniería de Sistemas · Docente: <strong className="text-slate-800 dark:text-slate-200">MSc. Alvaro Salamanca</strong> · Autores: Katherine Peñaloza & Edwin Gutierrez
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#09843B] hover:bg-[#07692e] dark:bg-[#0ca54a] dark:hover:bg-[#09843B] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm shrink-0"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </div>
  );
};
