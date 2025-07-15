import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-700 w-full max-w-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-800/60 rounded-t-xl">
          <div className="flex items-center gap-3">
            {icon && <span className="text-purple-400">{icon}</span>}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
