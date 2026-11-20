/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Modal de Nueva Solicitud de E/S
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React, { useEffect, useState } from 'react';
import { DeviceType, FaultType } from '../types/io-simulator';
import { useLanguage } from '../i18n/LanguageContext';
import { DEVICE_LABELS } from '../i18n/translations';
import { X, Plus, Send, AlertTriangle } from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    deviceType: DeviceType;
    operation: 'READ' | 'WRITE';
    payload: string;
    bytes: number;
    priority: 'LOW' | 'NORMAL' | 'HIGH';
    processName: string;
    willFail?: FaultType;
  }) => void;
}

const getDefaultPayload = (dev: DeviceType, isEs: boolean): string => {
  if (dev === 'KEYBOARD') {
    return isEs ? 'Entrada de caracteres [Cadena de prueba]' : 'Character input [Test string]';
  }
  if (dev === 'DISK') {
    return isEs ? 'Lectura de bloque LBA 0x4A20 (/var/log/syslog)' : 'Read LBA block 0x4A20 (/var/log/syslog)';
  }
  if (dev === 'PRINTER') {
    return isEs ? 'Impresión de reporte de auditoría' : 'Audit report print job';
  }
  return isEs ? 'GET /index.html (Paquete TCP/IP)' : 'GET /index.html (TCP/IP Packet)';
};

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

  const [deviceType, setDeviceType] = useState<DeviceType>('DISK');
  const [operation, setOperation] = useState<'READ' | 'WRITE'>('READ');
  const [processName, setProcessName] = useState<string>(
    isEs ? 'App de Usuario PID 2048' : 'User App PID 2048'
  );
  const [payload, setPayload] = useState<string>(getDefaultPayload('DISK', isEs));
  const [bytes, setBytes] = useState<number>(4096);
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH'>('NORMAL');
  const [willFail, setWillFail] = useState<boolean>(false);

  useEffect(() => {
    setProcessName((prev) => {
      if (prev === 'App de Usuario PID 2048' || prev === 'User App PID 2048') {
        return isEs ? 'App de Usuario PID 2048' : 'User App PID 2048';
      }
      return prev;
    });
    setPayload((prev) => {
      const esDefault = getDefaultPayload(deviceType, true);
      const enDefault = getDefaultPayload(deviceType, false);
      if (prev === esDefault || prev === enDefault) {
        return getDefaultPayload(deviceType, isEs);
      }
      return prev;
    });
  }, [isEs, deviceType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let fault: FaultType = 'NONE';
    if (willFail) {
      if (deviceType === 'PRINTER') fault = 'PAPER_JAM';
      else if (deviceType === 'DISK') fault = 'BAD_SECTOR';
      else if (deviceType === 'NETWORK') fault = 'PACKET_LOSS';
      else fault = 'BUFFER_OVERFLOW';
    }

    onSubmit({
      deviceType,
      operation,
      payload,
      bytes: Number(bytes),
      priority,
      processName,
      willFail: fault,
    });
    onClose();
  };

  const handleDeviceChange = (dev: DeviceType) => {
    setDeviceType(dev);
    if (dev === 'KEYBOARD') {
      setOperation('READ');
      setPayload(getDefaultPayload('KEYBOARD', isEs));
      setBytes(16);
    } else if (dev === 'DISK') {
      setOperation('READ');
      setPayload(getDefaultPayload('DISK', isEs));
      setBytes(4096);
    } else if (dev === 'PRINTER') {
      setOperation('WRITE');
      setPayload(getDefaultPayload('PRINTER', isEs));
      setBytes(16384);
    } else if (dev === 'NETWORK') {
      setOperation('READ');
      setPayload(getDefaultPayload('NETWORK', isEs));
      setBytes(1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-[#09843B]/10 dark:bg-[#0ca54a]/20 text-[#09843B] dark:text-[#0ca54a] shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {isEs ? 'Generar Solicitud de E/S' : 'Create I/O Request'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isEs ? 'Inyectar carga de trabajo al bus del sistema' : 'Inject workload onto the system bus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label={isEs ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs flex-1 overflow-y-auto">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              {isEs ? 'Dispositivo Destino' : 'Target Device'}
            </label>
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
              {(['KEYBOARD', 'DISK', 'PRINTER', 'NETWORK'] as DeviceType[]).map((d) => {
                const irq = d === 'KEYBOARD' ? 1 : d === 'DISK' ? 14 : d === 'PRINTER' ? 7 : 11;
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => handleDeviceChange(d)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors cursor-pointer ${
                      deviceType === d
                        ? 'bg-[#09843B]/10 dark:bg-[#0ca54a]/20 border-[#09843B] dark:border-[#0ca54a] text-[#09843B] dark:text-[#0ca54a] font-semibold'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {DEVICE_LABELS[lang][d].displayName} (IRQ {irq})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                {isEs ? 'Tipo de Operación' : 'Operation Type'}
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value as 'READ' | 'WRITE')}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] focus:ring-1 focus:ring-[#09843B]"
              >
                <option value="READ">{isEs ? 'Lectura (READ)' : 'Read (READ)'}</option>
                <option value="WRITE">{isEs ? 'Escritura (WRITE)' : 'Write (WRITE)'}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                {isEs ? 'Prioridad en Cola' : 'Queue Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'NORMAL' | 'HIGH')}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] focus:ring-1 focus:ring-[#09843B]"
              >
                <option value="LOW">{isEs ? 'Baja (LOW)' : 'Low (LOW)'}</option>
                <option value="NORMAL">Normal (NORMAL)</option>
                <option value="HIGH">{isEs ? 'Alta / Tiempo Real (HIGH)' : 'High / Real-Time (HIGH)'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              {isEs ? 'Nombre del Proceso Solicitante' : 'Requesting Process Name'}
            </label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] focus:ring-1 focus:ring-[#09843B]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                {isEs ? 'Descripción / Payload' : 'Description / Payload'}
              </label>
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] focus:ring-1 focus:ring-[#09843B]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                {isEs ? 'Tamaño (Bytes)' : 'Size (Bytes)'}
              </label>
              <input
                type="number"
                min={1}
                max={1048576}
                value={bytes}
                onChange={(e) => setBytes(parseInt(e.target.value, 10))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#09843B] dark:focus:border-[#0ca54a] focus:ring-1 focus:ring-[#09843B]"
                required
              />
            </div>
          </div>

          {/* Fault injection checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
              <input
                type="checkbox"
                checked={willFail}
                onChange={(e) => setWillFail(e.target.checked)}
                className="rounded accent-amber-600 w-4 h-4"
              />
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {isEs
                    ? 'Forzar fallo de hardware en esta solicitud (Para pruebas de resiliencia)'
                    : 'Force hardware fault on this request (For resilience testing)'}
                </span>
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#09843B] hover:bg-[#07692e] dark:bg-[#0ca54a] dark:hover:bg-[#09843B] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEs ? 'Encolar Solicitud' : 'Enqueue Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
