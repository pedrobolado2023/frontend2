'use client';

import React from 'react';

interface HotelCardProps {
  res: any;
  rateType: string;
  selected: boolean;
  onClick: () => void;
}

export const HotelCard = ({ res, rateType, selected, onClick }: HotelCardProps) => {
  const basePrice = rateType === 'NET' ? res.totalPriceNet : (res.baseFinalPrice || res.totalPriceFinal / 1.04);
  const taxAmount = basePrice * 0.04;
  const totalPrice = basePrice + taxAmount;

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all cursor-pointer flex justify-between items-center group ${selected ? 'border-[#F88F01] bg-[#F88F01]/[0.02]' : 'border-transparent hover:border-[#004253]/20'}`}
    >
      <div>
        <h4 className="font-black text-2xl text-[#004253] group-hover:text-[#F88F01] transition-colors">{res.hotelName}</h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-[#004253]/5 px-3 py-1 rounded-full text-[10px] font-black text-[#004253] uppercase tracking-widest">{res.roomTypeName}</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">• {res.location}</span>
        </div>
      </div>
      <div className="text-right space-y-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Base ({rateType}): R$ {basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Taxa (4%): R$ {taxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <p className="text-3xl font-black text-[#F88F01] tabular-nums whitespace-nowrap">
          <span className="text-sm font-black opacity-60 mr-1">R$</span>
          {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[9px] font-black text-[#F88F01]/60 uppercase tracking-tighter">Total com impostos</p>
      </div>
    </div>
  );
};
