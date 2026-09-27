import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

type ToastListener = (toasts: ToastMessage[]) => void;

let activeToasts: ToastMessage[] = [];
const listeners: Set<ToastListener> = new Set();

function notify() {
  listeners.forEach(l => l([...activeToasts]));
}

export function showToast(text: string, type: 'success' | 'info' | 'error' = 'success', durationMs = 4000) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  activeToasts = [...activeToasts, { id, text, type }];
  notify();

  setTimeout(() => {
    activeToasts = activeToasts.filter(t => t.id !== id);
    notify();
  }, durationMs);
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>(activeToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-warm-lg border text-xs font-medium backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
            t.type === 'error'
              ? 'bg-[#FEF2F2] border-red-200 text-red-900'
              : t.type === 'info'
              ? 'bg-[#EFF6FF] border-blue-200 text-blue-900'
              : 'bg-[#FFFDF9] border-[#A43E25]/30 text-[#2B211E]'
          }`}
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : t.type === 'info' ? (
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#1E5E4B] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 leading-snug">
            <p className="font-semibold text-sm mb-0.5">
              {t.type === 'error' ? 'Notice' : t.type === 'info' ? 'Sisterhood Info' : 'Success'}
            </p>
            <p className="text-xs text-[#6E5B55]">{t.text}</p>
          </div>

          <button
            onClick={() => {
              activeToasts = activeToasts.filter(item => item.id !== t.id);
              notify();
            }}
            className="text-[#6E5B55] hover:text-[#2B211E] p-1 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
