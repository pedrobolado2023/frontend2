'use client';

import React from 'react';

interface GuestPickerProps {
  guests: { rooms: number; adults: number; children: number };
  handleGuestChange: (type: 'rooms' | 'adults' | 'children', delta: number) => void;
  onClose: () => void;
}

export const GuestPicker = ({ guests, handleGuestChange, onClose }: GuestPickerProps) => {
  return (
    <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white shadow-[0px_24px_64px_rgba(0,0,0,0.12)] border border-[#004253]/5 rounded-3xl p-8 z-[100]">
      <h4 className="font-bold text-[#004253] mb-8">Quartos e hóspedes</h4>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Nº de Quartos</span>
          <div className="flex items-center gap-5">
            <button onClick={() => handleGuestChange('rooms', -1)} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50">-</button>
            <span className="font-bold text-base min-w-[20px] text-center">{guests.rooms}</span>
            <button onClick={() => handleGuestChange('rooms', 1)} className="w-9 h-9 rounded-xl border border-[#004253] flex items-center justify-center font-bold text-xl hover:bg-[#004253] hover:text-white transition-colors">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t pt-6 border-slate-50">
          <span className="font-bold text-sm">Adultos</span>
          <div className="flex items-center gap-5">
            <button onClick={() => handleGuestChange('adults', -1)} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50">-</button>
            <span className="font-bold text-base min-w-[20px] text-center">{guests.adults}</span>
            <button onClick={() => handleGuestChange('adults', 1)} className="w-9 h-9 rounded-xl border border-[#004253] flex items-center justify-center font-bold text-xl hover:bg-[#004253] hover:text-white transition-colors">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t pt-6 border-slate-50">
          <div>
            <p className="font-bold text-sm">Crianças</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">0 aos 17 anos</p>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => handleGuestChange('children', -1)} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-xl hover:bg-slate-50">-</button>
            <span className="font-bold text-base min-w-[20px] text-center">{guests.children}</span>
            <button onClick={() => handleGuestChange('children', 1)} className="w-9 h-9 rounded-xl border border-[#004253] flex items-center justify-center font-bold text-xl hover:bg-[#004253] hover:text-white transition-colors">+</button>
          </div>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-full mt-10 bg-[#004253] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#004253]/20 hover:brightness-110 active:scale-[0.98] transition-all"
      >
        Aplicar Seleção
      </button>
    </div>
  );
};
