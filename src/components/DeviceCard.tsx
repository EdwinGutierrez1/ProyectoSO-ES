/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyecto 10: I/O Simulator - Tarjeta de Dispositivo Periférico
 * Katherine Peñaloza - Edwin Gutierrez | Sistemas Operativos V Semestre
 */

import React from 'react';
import { IODevice, FaultType } from '../types/io-simulator';
import {
  Keyboard,
  HardDrive,
  Printer,
  Network,
  AlertTriangle,
  Clock,
  Layers,
  Sliders,
  Check,
  Send,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DEVICE_LABELS } from '../i18n/translations';

interface DeviceCardProps {
  device: IODevice;
  onInjectQuickEvent: (deviceId: IODevice['id']) => void;
  onToggleFault: (deviceId: IODevice['id'], fault: FaultType) => void;
  onChangeLatency: (deviceId: IODevice['id'], latencyTicks: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onInjectQuickEvent,
  onToggleFault,
  onChangeLatency,
}) => {
  const { lang } = useLanguage();
  const isEs = lang === 'es';
  const labels = DEVICE_LABELS[lang][device.id];

  const getDeviceIcon = () => {
    switch (device.id) {
      case 'KEYBOARD':
        return <Keyboard className="w-5 h-5" />;
      case 'DISK':
        return <HardDrive className="w-5 h-5" />;
      case 'PRINTER':
        return <Printer className="w-5 h-5" />;
      case 'NETWORK':
        return <Network className="w-5 h-5" />;
    }
  };

  const getSpecificFault = (): FaultType => {
    switch (device.id) {
      case 'KEYBOARD':
        return 'BUFFER_OVERFLOW';
      case 'DISK':
        return 'BAD_SECTOR';
      case 'PRINTER':
        return 'PAPER_JAM';
      case 'NETWORK':
        return 'PACKET_LOSS';
    }
  };

  const specificFault = getSpecificFault();
  const hasActiveFault = device.activeFault !== 'NONE';

  return (
    <div
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
        hasActiveFault
          ? 'border-rose-300 dark:border-rose-700 ring-2 ring-rose-500/10 dark:ring-rose-500/20'
          : device.status === 'BUSY'
          ? 'border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/10 dark:ring-emerald-500/20 shadow-sm'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                hasActiveFault
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : device.status === 'BUSY'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#09843B] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {getDeviceIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {labels.displayName}
                </h3>
                <span className="text-[10px] font-mono text-[#09843B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold border border-emerald-200/60 dark:border-emerald-800 shrink-0">
                  IRQ {device.irqNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{labels.name}</p>
            </div>
          </div>

          {/* Status Label */}
          <div className="text-right shrink-0">
            {hasActiveFault ? (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isEs ? 'Fallo Activo' : 'Active Fault'}
              </span>
            ) : device.status === 'BUSY' ? (
              <span className="text-xs font-bold text-[#09843B] dark:text-emerald-400 inline-flex items-center gap-1 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {isEs ? 'Ocupado' : 'Busy'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {isEs ? 'Listo' : 'Ready'}
              </span>
            )}
          </div>
        </div>

        {/* Current Active Request */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{isEs ? 'Operación en Curso' : 'Operation in Progress'}</span>
            {device.currentRequest && (
              <span className="font-mono text-[#09843B] dark:text-emerald-400 text-[10px] font-bold">
                {device.currentRequest.id}
              </span>
            )}
          </div>

          {device.currentRequest ? (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-900 dark:text-slate-100 font-bold truncate">
                  {device.currentRequest.operation}: {device.currentRequest.processName}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0 font-medium">
                  {device.currentRequest.bytes} B
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate">
                {device.currentRequest.payload}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>{isEs ? 'Tiempo de servicio' : 'Service time'}</span>
                  <span>
                    {device.totalRequiredTicks - device.currentProgressTicks}/{device.totalRequiredTicks} ticks
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${
                      hasActiveFault ? 'bg-rose-500' : 'bg-[#09843B] dark:bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.round(
                        ((device.totalRequiredTicks - device.currentProgressTicks) /
                          Math.max(1, device.totalRequiredTicks)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-400 dark:text-slate-500">
              {isEs ? 'Sin operaciones activas. Controlador a la espera.' : 'No active operations. Controller waiting.'}
            </div>
          )}
        </div>

        {/* Device Queue */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>{isEs ? 'Cola de Espera (Prioridad)' : 'Waiting Queue (Priority)'}</span>
            </span>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-bold">
              {device.queue.length}
            </span>
          </div>

          {device.queue.length > 0 ? (
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
              {device.queue.map((req) => (
                <div
                  key={req.id}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                >
                  <div className="truncate flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        req.priority === 'HIGH'
                          ? 'bg-rose-500'
                          : req.priority === 'NORMAL'
                          ? 'bg-[#09843B] dark:bg-emerald-400'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{req.id}</span>
                    <span className="text-slate-500 dark:text-slate-400 truncate">({req.processName})</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] shrink-0">
                    {req.waitTime}t
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              {isEs ? 'Cola vacía' : 'Empty queue'}
            </p>
          )}
        </div>
      </div>

      {/* Latency and Fault Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        {/* Latency Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <Sliders className="w-3 h-3 text-slate-400" />
              <span>{isEs ? 'Latencia Base:' : 'Base Latency:'}</span>
            </span>
            <span className="font-mono font-bold text-[#09843B] dark:text-emerald-400">
              {device.baseLatencyTicks} ticks
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={device.baseLatencyTicks}
            onChange={(e) => onChangeLatency(device.id, parseInt(e.target.value, 10))}
            className="w-full accent-[#09843B] dark:accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onInjectQuickEvent(device.id)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer min-w-0"
          >
            <Send className="w-3 h-3 text-[#09843B] dark:text-emerald-400 shrink-0" />
            <span className="truncate">{labels.quickAction}</span>
          </button>

          <button
            onClick={() => onToggleFault(device.id, hasActiveFault ? 'NONE' : specificFault)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border shadow-2xs cursor-pointer min-w-0 ${
              hasActiveFault
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={
              isEs
                ? 'Inyectar o resolver fallo de hardware según el reto de experimentación'
                : 'Inject or resolve hardware fault according to experimentation challenge'
            }
          >
            <AlertTriangle className={`w-3 h-3 shrink-0 ${hasActiveFault ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <span className="truncate">{hasActiveFault ? (isEs ? 'Resolver' : 'Resolve') : labels.faultLabel}</span>
          </button>
        </div>

        {/* Device Metrics Footer */}
        <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>
            {isEs ? 'Atendidas:' : 'Handled:'}{' '}
            <strong className="text-slate-700 dark:text-slate-200">{device.metrics.totalHandled}</strong>
          </span>
          <span>
            {isEs ? 'Fallos:' : 'Faults:'}{' '}
            <strong className="text-slate-700 dark:text-slate-200">{device.metrics.faultsCount}</strong>
          </span>
          <span>
            Ticks: <strong className="text-slate-700 dark:text-slate-200">{device.metrics.busyTicks}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
