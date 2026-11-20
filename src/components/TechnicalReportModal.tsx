/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Informe Técnico y Guía de Sustentación
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { X, FileText, Download, Award, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

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
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {isEs ? 'Informe Técnico y Sustentación' : 'Technical Report & Defense'}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {isEs
                    ? 'Universidad Simón Bolívar · Sistemas Operativos V Semestre · Documento de Entrega'
                    : 'Universidad Simón Bolívar · Operating Systems 5th Semester · Submission Document'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label={isEs ? 'Cerrar informe técnico' : 'Close technical report'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            <button
              onClick={handlePrintOrDownload}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
              title={isEs ? 'Imprimir o guardar como PDF' : 'Print or save as PDF'}
            >
              <Download className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
              <span>{isEs ? 'Imprimir / PDF' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={isEs ? 'Cerrar informe técnico' : 'Close technical report'}
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
              <span>
                {isEs
                  ? 'Proyecto Final de Programación #10 · Rúbrica 5.0'
                  : 'Final Programming Project #10 · Rubric 5.0'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEs
                ? 'I/O Simulator: Simulador de Periféricos & Interrupciones'
                : 'I/O Simulator: Peripheral & Interrupt Simulator'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              {isEs
                ? 'Universidad Simón Bolívar · Facultad de Ingenierías · Carrera de Ingeniería de Sistemas'
                : 'Universidad Simón Bolívar · Faculty of Engineering · Systems Engineering Program'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEs ? 'Asignatura: Sistemas Operativos (V Semestre)' : 'Course: Operating Systems (5th Semester)'}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">{isEs ? 'Docente:' : 'Instructor:'}</span>
                <strong className="text-[#09843B] dark:text-[#0ca54a]">MSc. Alvaro Salamanca</strong>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Users className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
                <span>{isEs ? 'Estudiante:' : 'Student:'} <strong className="text-slate-900 dark:text-slate-100">Katherine Peñaloza</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Users className="w-3.5 h-3.5 text-[#09843B] dark:text-[#0ca54a]" />
                <span>{isEs ? 'Estudiante:' : 'Student:'} <strong className="text-slate-900 dark:text-slate-100">Edwin Gutierrez</strong></span>
              </div>
            </div>
          </div>

          {/* Section 1: Problem Definition */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                01
              </span>
              <span>{isEs ? 'Definición del Problema' : 'Problem Definition'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
              {isEs ? (
                <>
                  Los dispositivos de Entrada/Salida operan a velocidades de varios órdenes de magnitud inferiores a la
                  de la Unidad Central de Procesamiento (CPU). Mientras una CPU ejecuta miles de millones de instrucciones
                  por segundo, un disco mecánico o una impresora requieren milisegundos o segundos para completar una transferencia.
                  El objetivo de este proyecto es simular y contrastar cuantitativamente dos paradigmas de atención:
                  la <strong className="text-slate-900 dark:text-slate-100">espera activa (Polling o Sondeo)</strong> y la{' '}
                  <strong className="text-[#09843B] dark:text-[#0ca54a]">E/S gobernada por interrupciones de hardware (Interrupt-driven I/O)</strong>,
                  evaluando su impacto en el tiempo de CPU útil, la latencia de respuesta y la tolerancia ante fallos de periféricos.
                </>
              ) : (
                <>
                  Input/Output devices operate at speeds several orders of magnitude slower than the Central Processing Unit (CPU).
                  While a CPU executes billions of instructions per second, a mechanical disk or printer requires milliseconds or seconds
                  to complete a transfer. The objective of this project is to simulate and quantitatively contrast two servicing paradigms:{' '}
                  <strong className="text-slate-900 dark:text-slate-100">busy waiting (Polling)</strong> and{' '}
                  <strong className="text-[#09843B] dark:text-[#0ca54a]">Interrupt-driven I/O</strong>, evaluating their impact on useful
                  CPU time, response latency, and peripheral fault tolerance.
                </>
              )}
            </p>
          </section>

          {/* Section 2: OS Concepts Represented */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                02
              </span>
              <span>{isEs ? 'Conceptos de Sistemas Operativos Representados' : 'Operating Systems Concepts Represented'}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">
                  {isEs ? 'Controladores y Registros de Hardware' : 'Hardware Controllers & Registers'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEs ? (
                    <>
                      Cada dispositivo cuenta con un controlador que expone registros de hardware:{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">STATUS_REG</code>{' '}
                      (READY, BUSY, DONE, ERROR),{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">CONTROL_REG</code>{' '}
                      (Start, InterruptEnable, Reset) y{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">DATA_REG</code>.
                    </>
                  ) : (
                    <>
                      Each device has a controller exposing hardware registers:{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">STATUS_REG</code>{' '}
                      (READY, BUSY, DONE, ERROR),{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">CONTROL_REG</code>{' '}
                      (Start, InterruptEnable, Reset), and{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">DATA_REG</code>.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">
                  {isEs ? 'Líneas IRQ y PIC (Controlador de Interrupciones)' : 'IRQ Lines & PIC (Interrupt Controller)'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEs
                    ? 'Modelado de las líneas de solicitud de interrupción estándar x86: IRQ 1 (Teclado), IRQ 14 (Controlador de Disco), IRQ 7 (Puerto de Impresora) e IRQ 11 (Tarjeta de Red).'
                    : 'Modeling of standard x86 interrupt request lines: IRQ 1 (Keyboard), IRQ 14 (Disk Controller), IRQ 7 (Printer Port), and IRQ 11 (Network Card).'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">
                  {isEs ? 'Rutinas ISR y Cambio de Contexto' : 'ISR Routines & Context Switching'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEs
                    ? 'Simulación del ciclo de interrupción de hardware: salvaguarda de registros en pila, indexación de la Tabla de Vectores de Interrupción (IVT), ejecución de la ISR para transferir datos a memoria RAM, y reanudación del proceso con IRET.'
                    : 'Simulation of the hardware interrupt cycle: saving registers on the stack, indexing the Interrupt Vector Table (IVT), executing the ISR to transfer data into RAM, and resuming the process via IRET.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 className="font-bold text-[#09843B] dark:text-[#0ca54a]">
                  {isEs ? 'Espera Activa vs Asincronía' : 'Busy Waiting vs Asynchrony'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEs ? (
                    <>
                      En Sondeo, la CPU queda bloqueada en un bucle{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">while(!ready)</code>{' '}
                      consumiendo ciclos sin cómputo útil. En Interrupciones, el proceso se bloquea y la CPU ejecuta otros procesos hasta el pulso IRQ.
                    </>
                  ) : (
                    <>
                      In Polling, the CPU stalls in a{' '}
                      <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">while(!ready)</code>{' '}
                      loop consuming cycles without useful work. With Interrupts, the process yields and the CPU runs other tasks until the IRQ pulse arrives.
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Model Simplifications */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                03
              </span>
              <span>
                {isEs ? 'Simplificaciones del Modelo (Exigencia Documental)' : 'Model Simplifications (Documentation Requirement)'}
              </span>
            </h3>
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p className="font-medium text-amber-900 dark:text-amber-300">
                {isEs
                  ? 'Como estipula la pauta docente, todo simulador de sistemas operativos debe explicitar sus simplificaciones y no presentarse como medición de hardware físico:'
                  : 'As required by course guidelines, any OS simulator must explicitly state its simplifications and not present itself as physical hardware benchmarking:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                {isEs ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <li>
                      <strong className="text-slate-800 dark:text-slate-100">Discrete Time Scale:</strong> The CPU and controllers advance in discrete logical clock <em>ticks</em> rather than real physical nanoseconds.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-slate-100">Physical DMA Abstraction:</strong> Data transfers between the controller buffer and main RAM are modeled instantaneously within the ISR context without implementing 8237 DMA channels or physical scatter-gather.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-slate-100">Environment Isolation:</strong> Host physical hardware is not directly controlled; the simulation runs safely and deterministically inside a virtual state machine in the web browser.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-slate-100">Simplified Memory Hierarchy:</strong> L1/L2 cache misses and PCIe bus contention during simultaneous bursts are not modeled.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </section>

          {/* Section 4: Experimental Findings & Conclusion */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                04
              </span>
              <span>{isEs ? 'Resultados Experimentales y Conclusiones' : 'Experimental Results & Conclusions'}</span>
            </h3>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {isEs ? (
                <>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">1. Eficiencia de CPU:</strong> En cargas de trabajo normales, el esquema de interrupciones
                    mantiene una eficiencia de CPU del 93-98%, mientras que el sondeo activo cae a menos del 40-50%,
                    desperdiciando la mayoría de los ciclos en comprobaciones estériles del registro{' '}
                    <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG</code>.
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">2. Reto de Fallos y Retrasos:</strong> Al inyectar altas latencias o fallos de hardware
                    (atasco en impresora, sector defectuoso en disco), el Sondeo colapsa el rendimiento global del sistema,
                    reteniendo el procesador en bucles de espera. Por el contrario, las Interrupciones gestionan la excepción
                    inmediatamente sin bloquear a los demás procesos de usuario.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">1. CPU Efficiency:</strong> Under normal workloads, the interrupt-driven scheme
                    maintains 93–98% CPU efficiency, whereas active polling drops below 40–50%, wasting most cycles on sterile checks of{' '}
                    <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG</code>.
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-100">2. Fault & Latency Challenge:</strong> When injecting high latencies or hardware faults
                    (printer jam, bad disk sector), Polling collapses overall system throughput by trapping the processor in wait loops. Conversely, Interrupts handle
                    the exception immediately without stalling other user processes.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Section 5: Oral Defense Prep Q&A */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#09843B] dark:bg-[#0ca54a] text-white flex items-center justify-center text-xs font-mono font-bold">
                05
              </span>
              <span>
                {isEs
                  ? 'Guía de Preguntas para Sustentación Oral (Rúbrica 5.0)'
                  : 'Oral Defense Q&A Guide (Rubric 5.0)'}
              </span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  {isEs
                    ? 'P1: ¿Por qué el sondeo (polling) no siempre es descartado en sistemas reales?'
                    : 'Q1: Why is polling not always discarded in real-world systems?'}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">{isEs ? 'R:' : 'A:'}</strong>{' '}
                  {isEs
                    ? 'En dispositivos ultra-rápidos (ej. tarjetas de red de 100 Gbps o memoria NVMe ultra-veloz), el costo en nanosegundos de un cambio de contexto por interrupción (salvar registros, vaciar pipeline de CPU, saltar a la ISR) es mayor que el tiempo de espera. Mecanismos como Linux NAPI o DPDK usan sondeo controlado cuando hay tráfico masivo para evitar tormentas de interrupciones (interrupt storms).'
                    : 'On ultra-fast devices (e.g., 100 Gbps NICs or ultra-fast NVMe memory), the nanosecond cost of an interrupt context switch (saving registers, flushing CPU pipeline, jumping to ISR) exceeds the wait time. Mechanisms like Linux NAPI or DPDK use controlled polling under heavy traffic to prevent interrupt storms.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  {isEs
                    ? 'P2: ¿Qué ocurre a nivel de CPU cuando una línea IRQ se dispara?'
                    : 'Q2: What happens at the CPU level when an IRQ line fires?'}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">{isEs ? 'R:' : 'A:'}</strong>{' '}
                  {isEs
                    ? 'La CPU termina la instrucción en curso, verifica que el flag IF (Interrupt Flag) esté activo, envía una señal INTA al PIC, recibe el número de vector de interrupción, empuja el contador de programa (PC) y registros a la pila del kernel, salta a la dirección de la ISR según la tabla IVT, ejecuta el servicio de E/S y retorna con IRET.'
                    : 'The CPU finishes the current instruction, checks that the IF (Interrupt Flag) is enabled, sends an INTA signal to the PIC, receives the interrupt vector number, pushes the program counter (PC) and registers onto the kernel stack, jumps to the ISR address via the IVT, executes the I/O handler, and returns with IRET.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">
                  {isEs
                    ? 'P3: ¿Cómo manejó el simulador los fallos de hardware?'
                    : 'Q3: How did the simulator handle hardware faults?'}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">{isEs ? 'R:' : 'A:'}</strong>{' '}
                  {isEs ? (
                    <>
                      Mediante bits dedicados en{' '}
                      <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG (0x08)</code>{' '}
                      y activación de interrupciones de excepción de hardware que permiten al kernel abortar la solicitud fallida sin colgar los procesos paralelos.
                    </>
                  ) : (
                    <>
                      Through dedicated bits in{' '}
                      <code className="text-[#09843B] dark:text-[#0ca54a] font-mono bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">STATUS_REG (0x08)</code>{' '}
                      and hardware exception interrupts that let the kernel abort the failed request without hanging parallel processes.
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-2.5 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
            Universidad Simón Bolívar · {isEs ? 'Ingeniería de Sistemas · Docente:' : 'Systems Engineering · Instructor:'}{' '}
            <strong className="text-slate-800 dark:text-slate-200">MSc. Alvaro Salamanca</strong> ·{' '}
            {isEs ? 'Autores:' : 'Authors:'} Katherine Peñaloza & Edwin Gutierrez
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#09843B] hover:bg-[#07692e] dark:bg-[#0ca54a] dark:hover:bg-[#09843B] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm shrink-0"
          >
            {isEs ? 'Cerrar Informe' : 'Close Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
