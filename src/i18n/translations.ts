/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Bilingual Dictionaries & Helpers (ES / EN)
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import { DeviceType, FaultType, TestScenario } from '../types/io-simulator';

export type Language = 'es' | 'en';

export const DEVICE_LABELS: Record<
  Language,
  Record<
    DeviceType,
    {
      displayName: string;
      name: string;
      category: string;
      transferRateDesc: string;
      quickAction: string;
      faultLabel: string;
      faultDesc: string;
    }
  >
> = {
  es: {
    KEYBOARD: {
      displayName: 'Teclado',
      name: 'Teclado Estándar PS/2',
      category: 'Entrada',
      transferRateDesc: '10-20 B/s (Interactivo)',
      quickAction: 'Teclear Teclas',
      faultLabel: 'Buffer Overflow',
      faultDesc: 'Desbordamiento de búfer FIFO en Teclado (Ráfaga de teclas supera capacidad de 64 bytes).',
    },
    DISK: {
      displayName: 'Disco Duro',
      name: 'Controlador Disco SATA / NVMe',
      category: 'Almacenamiento',
      transferRateDesc: '550 MB/s (Bloques 4KB)',
      quickAction: 'Leer Bloque 4KB',
      faultLabel: 'Sector Dañado (CRC)',
      faultDesc: 'Error de lectura CRC en Disco (Sector LBA 0x3F8 defectuoso / fallo de cabezal).',
    },
    PRINTER: {
      displayName: 'Impresora',
      name: 'Impresora Láser USB / Spooler',
      category: 'Salida',
      transferRateDesc: '35 ppm (Mecánica lenta)',
      quickAction: 'Imprimir Página',
      faultLabel: 'Atasco de Papel',
      faultDesc: 'Atasco de papel en rodillo mecánico de Impresora (Sensor óptico bloqueado).',
    },
    NETWORK: {
      displayName: 'Tarjeta de Red',
      name: 'Adaptador de Red Gigabit Ethernet',
      category: 'Comunicaciones',
      transferRateDesc: '1000 Mbps (Full Duplex)',
      quickAction: 'Enviar Paquete',
      faultLabel: 'Pérdida de Paquetes',
      faultDesc: 'Pérdida de tramas Ethernet en Tarjeta de Red (Timeout de conexión / enlace caído).',
    },
  },
  en: {
    KEYBOARD: {
      displayName: 'Keyboard',
      name: 'Standard PS/2 Keyboard',
      category: 'Input',
      transferRateDesc: '10-20 B/s (Interactive)',
      quickAction: 'Type Keys',
      faultLabel: 'Buffer Overflow',
      faultDesc: 'Keyboard FIFO buffer overflow (Keystroke burst exceeds 64-byte capacity).',
    },
    DISK: {
      displayName: 'Hard Disk',
      name: 'SATA / NVMe Disk Controller',
      category: 'Storage',
      transferRateDesc: '550 MB/s (4KB Blocks)',
      quickAction: 'Read 4KB Block',
      faultLabel: 'Bad Sector (CRC)',
      faultDesc: 'Disk CRC read error (Defective LBA sector 0x3F8 / head failure).',
    },
    PRINTER: {
      displayName: 'Printer',
      name: 'USB Laser Printer / Spooler',
      category: 'Output',
      transferRateDesc: '35 ppm (Slow mechanical)',
      quickAction: 'Print Page',
      faultLabel: 'Paper Jam',
      faultDesc: 'Paper jam in Printer mechanical roller (Optical sensor blocked).',
    },
    NETWORK: {
      displayName: 'Network Card',
      name: 'Gigabit Ethernet Adapter',
      category: 'Networking',
      transferRateDesc: '1000 Mbps (Full Duplex)',
      quickAction: 'Send Packet',
      faultLabel: 'Packet Loss',
      faultDesc: 'Ethernet frame loss on Network Card (Connection timeout / link down).',
    },
  },
};

export function getFaultMessage(deviceType: DeviceType, fault: FaultType, lang: Language): string {
  switch (fault) {
    case 'BUFFER_OVERFLOW':
      return DEVICE_LABELS[lang].KEYBOARD.faultDesc;
    case 'BAD_SECTOR':
      return DEVICE_LABELS[lang].DISK.faultDesc;
    case 'PAPER_JAM':
      return DEVICE_LABELS[lang].PRINTER.faultDesc;
    case 'PACKET_LOSS':
      return DEVICE_LABELS[lang].NETWORK.faultDesc;
    default:
      return lang === 'en' ? 'Generic I/O hardware fault.' : 'Fallo genérico de hardware de E/S.';
  }
}

export const TRANSLATED_SCENARIOS: Record<Language, TestScenario[]> = {
  es: [
    {
      id: 'SCENARIO_NORMAL',
      name: 'Escenario 1: Carga Normal Balanceada',
      category: 'NORMAL',
      description:
        'Flujo habitual de operaciones de usuario: entrada de texto por teclado, lectura de archivo de disco, descarga de paquete web y envío de reporte a impresora.',
      expectedOutcome:
        'Ambos mecanismos completan las 4 solicitudes. Sin embargo, en Interrupciones la CPU dedica el 95%+ de su tiempo a cómputo útil, mientras que en Sondeo gasta ~40-60% de ciclos esperando en busy-waiting.',
      requestsToInject: [
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Tecla [Enter] presionada', bytes: 2, priority: 'NORMAL', processName: 'Editor de Código' },
        { deviceType: 'DISK', operation: 'READ', payload: 'Sector /home/user/documento.pdf', bytes: 4096, priority: 'NORMAL', processName: 'Lector PDF' },
        { deviceType: 'NETWORK', operation: 'READ', payload: 'GET /api/metricas HTTP/1.1', bytes: 1420, priority: 'HIGH', processName: 'Navegador Web' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Página 1 de informe de sistemas', bytes: 8192, priority: 'LOW', processName: 'Spooler Impresión' },
      ],
    },
    {
      id: 'SCENARIO_BURST_LIMIT',
      name: 'Escenario 2: Ráfaga Límite (Overload & Prioridades)',
      category: 'LIMITE',
      description:
        'Ráfaga simultánea masiva de 8 solicitudes con diferentes prioridades. Pone a prueba la saturación de colas y la capacidad del planificador de E/S.',
      expectedOutcome:
        'Se evidencia la saturación del bus. En Interrupciones, el PIC prioriza las IRQs críticas (Red IRQ 11 sobre Impresora IRQ 7) y la CPU sigue respondiendo. En Sondeo, la CPU se bloquea totalmente alternando entre periféricos lentos.',
      requestsToInject: [
        { deviceType: 'NETWORK', operation: 'READ', payload: 'Paquete VoIP streaming', bytes: 512, priority: 'HIGH', processName: 'App Teleconferencia' },
        { deviceType: 'NETWORK', operation: 'WRITE', payload: 'ACK Frame TCP', bytes: 64, priority: 'HIGH', processName: 'Stack TCP/IP' },
        { deviceType: 'DISK', operation: 'WRITE', payload: 'Commit Base de Datos SQLite', bytes: 8192, priority: 'HIGH', processName: 'Motor DBMS' },
        { deviceType: 'DISK', operation: 'READ', payload: 'Carga de DLL kernel32', bytes: 16384, priority: 'NORMAL', processName: 'Cargador Binario' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Atajo Ctrl+C', bytes: 2, priority: 'HIGH', processName: 'Terminal Bash' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Texto de entrada de usuario', bytes: 12, priority: 'NORMAL', processName: 'Formulario Web' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Impresión de contrato 12 págs', bytes: 24576, priority: 'LOW', processName: 'Ofimática' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Gráfico vectorial alta resolución', bytes: 32768, priority: 'LOW', processName: 'Diseño CAD' },
      ],
    },
    {
      id: 'SCENARIO_HIGH_LATENCY',
      name: 'Escenario 3: Retrasos Extremos (I/O Bound Systems)',
      category: 'LATENCIA',
      description:
        'Dispositivos con alta latencia mecánica y de red (Impresora 40 ticks, Disco 25 ticks). Simula un entorno altamente orientado a E/S (I/O Bound).',
      expectedOutcome:
        'Demuestra el caso extremo donde el Sondeo es inaceptable: la CPU desperdicia más del 80% de su capacidad en busy-waiting estéril. En Interrupciones la eficiencia de cómputo útil se mantiene superior al 90%.',
      latencyOverrides: { PRINTER: 38, DISK: 26, NETWORK: 16 },
      requestsToInject: [
        { deviceType: 'DISK', operation: 'READ', payload: 'Lectura de imagen ISO completa', bytes: 65536, priority: 'NORMAL', processName: 'Extractor ISO' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Plano arquitectónico tamaño póster', bytes: 49152, priority: 'LOW', processName: 'Plotter CAD' },
        { deviceType: 'NETWORK', operation: 'READ', payload: 'Descarga con alta latencia transatlántica', bytes: 10240, priority: 'NORMAL', processName: 'Cliente FTP' },
      ],
    },
    {
      id: 'SCENARIO_FAULT_ERROR',
      name: 'Escenario 4: Inyección de Fallos de Hardware',
      category: 'ERROR',
      description:
        'Se introducen fallos críticos: Atasco de papel en Impresora y Sector defectuoso en Disco. Evalúa el comportamiento de recuperación ante errores.',
      expectedOutcome:
        'En Interrupciones, el controlador genera un Error IRQ de inmediato, la CPU ejecuta la rutina de manejo de fallos y notifica al proceso sin colapsar. En Sondeo sin timeout, la CPU se quedaría atrapada indefinidamente sondeando un hardware colgado.',
      faultOverrides: { PRINTER: 'PAPER_JAM', DISK: 'BAD_SECTOR' },
      requestsToInject: [
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Documento confidencial atascado', bytes: 4096, priority: 'NORMAL', processName: 'Spooler', willFail: 'PAPER_JAM' },
        { deviceType: 'DISK', operation: 'READ', payload: 'Bloque dañado en sector 0x3F8', bytes: 2048, priority: 'HIGH', processName: 'Sistema de Archivos', willFail: 'BAD_SECTOR' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Comando de cancelación kill -9', bytes: 8, priority: 'HIGH', processName: 'Terminal Admin' },
      ],
    },
  ],
  en: [
    {
      id: 'SCENARIO_NORMAL',
      name: 'Scenario 1: Balanced Normal Load',
      category: 'NORMAL',
      description:
        'Typical user operation workflow: keyboard text input, disk file read, web packet download, and report sent to printer.',
      expectedOutcome:
        'Both mechanisms complete all 4 requests. However, with Interrupts the CPU devotes 95%+ of its time to useful computation, whereas Polling wastes ~40-60% of cycles waiting in busy-waiting.',
      requestsToInject: [
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Key [Enter] pressed', bytes: 2, priority: 'NORMAL', processName: 'Code Editor' },
        { deviceType: 'DISK', operation: 'READ', payload: 'Sector /home/user/document.pdf', bytes: 4096, priority: 'NORMAL', processName: 'PDF Reader' },
        { deviceType: 'NETWORK', operation: 'READ', payload: 'GET /api/metrics HTTP/1.1', bytes: 1420, priority: 'HIGH', processName: 'Web Browser' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Page 1 of systems report', bytes: 8192, priority: 'LOW', processName: 'Print Spooler' },
      ],
    },
    {
      id: 'SCENARIO_BURST_LIMIT',
      name: 'Scenario 2: Limit Burst (Overload & Priorities)',
      category: 'LIMITE',
      description:
        'Massive simultaneous burst of 8 requests with mixed priorities. Stress-tests queue saturation and the I/O scheduler capacity.',
      expectedOutcome:
        'Bus saturation becomes evident. With Interrupts, the PIC prioritizes critical IRQs (Network IRQ 11 over Printer IRQ 7) and the CPU stays responsive. Under Polling, the CPU completely stalls alternating across slow peripherals.',
      requestsToInject: [
        { deviceType: 'NETWORK', operation: 'READ', payload: 'VoIP streaming packet', bytes: 512, priority: 'HIGH', processName: 'Teleconf App' },
        { deviceType: 'NETWORK', operation: 'WRITE', payload: 'TCP ACK Frame', bytes: 64, priority: 'HIGH', processName: 'TCP/IP Stack' },
        { deviceType: 'DISK', operation: 'WRITE', payload: 'SQLite Database Commit', bytes: 8192, priority: 'HIGH', processName: 'DBMS Engine' },
        { deviceType: 'DISK', operation: 'READ', payload: 'kernel32 DLL load', bytes: 16384, priority: 'NORMAL', processName: 'Binary Loader' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Ctrl+C Shortcut', bytes: 2, priority: 'HIGH', processName: 'Bash Terminal' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'User text input', bytes: 12, priority: 'NORMAL', processName: 'Web Form' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: '12-page contract print', bytes: 24576, priority: 'LOW', processName: 'Office Suite' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'High-res vector graphic', bytes: 32768, priority: 'LOW', processName: 'CAD Design' },
      ],
    },
    {
      id: 'SCENARIO_HIGH_LATENCY',
      name: 'Scenario 3: Extreme Delays (I/O-Bound Systems)',
      category: 'LATENCIA',
      description:
        'Devices with high mechanical and network latency (Printer 40 ticks, Disk 25 ticks). Simulates a heavily I/O-bound environment.',
      expectedOutcome:
        'Demonstrates the extreme case where Polling is unacceptable: the CPU wastes over 80% of its capacity in sterile busy-waiting. Under Interrupts, useful compute efficiency stays above 90%.',
      latencyOverrides: { PRINTER: 38, DISK: 26, NETWORK: 16 },
      requestsToInject: [
        { deviceType: 'DISK', operation: 'READ', payload: 'Full ISO image read', bytes: 65536, priority: 'NORMAL', processName: 'ISO Extractor' },
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Poster-size architectural blueprint', bytes: 49152, priority: 'LOW', processName: 'CAD Plotter' },
        { deviceType: 'NETWORK', operation: 'READ', payload: 'High-latency transatlantic download', bytes: 10240, priority: 'NORMAL', processName: 'FTP Client' },
      ],
    },
    {
      id: 'SCENARIO_FAULT_ERROR',
      name: 'Scenario 4: Hardware Fault Injection',
      category: 'ERROR',
      description:
        'Critical faults are injected: Paper Jam on Printer and Bad Sector on Disk. Evaluates error recovery behavior.',
      expectedOutcome:
        'Under Interrupts, the controller raises an Error IRQ immediately, the CPU executes the fault-handling routine, and notifies the process without crashing. In Polling without timeout, the CPU would remain trapped indefinitely polling stalled hardware.',
      faultOverrides: { PRINTER: 'PAPER_JAM', DISK: 'BAD_SECTOR' },
      requestsToInject: [
        { deviceType: 'PRINTER', operation: 'WRITE', payload: 'Jammed confidential document', bytes: 4096, priority: 'NORMAL', processName: 'Spooler', willFail: 'PAPER_JAM' },
        { deviceType: 'DISK', operation: 'READ', payload: 'Damaged block at sector 0x3F8', bytes: 2048, priority: 'HIGH', processName: 'File System', willFail: 'BAD_SECTOR' },
        { deviceType: 'KEYBOARD', operation: 'READ', payload: 'Cancel command kill -9', bytes: 8, priority: 'HIGH', processName: 'Admin Terminal' },
      ],
    },
  ],
};
