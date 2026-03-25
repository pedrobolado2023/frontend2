'use client';

import React from 'react';

interface CalendarProps {
  viewDate: Date;
  dbCalendarData: any;
  searchParams: any;
  handleDateClick: (dStr: string) => void;
  renderMonth: (y: number, m: number) => React.ReactNode;
}

export const SelectionCalendar = ({ viewDate, dbCalendarData, searchParams, handleDateClick }: {
  viewDate: Date;
  dbCalendarData: any;
  searchParams: any;
  handleDateClick: (dStr: string) => void;
}) => {

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const renderSingleMonth = (year: number, month: number) => {
    const days = generateDays(year, month);
    return (
      <div className="w-full">
        <h5 className="text-center font-black text-[#004253] mb-10 uppercase tracking-widest text-[11px] opacity-70">
          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month))}
        </h5>
        <div className="grid grid-cols-7 gap-1">
          {['DOM','SEG','TER','QUA','QUI','SEX','SÁB'].map(d => (
            <span key={d} className="text-[10px] font-black text-slate-300 text-center py-4">{d}</span>
          ))}
          {days.map((d, i) => {
            if (d === null) return <div key={`empty-${i}`} className="aspect-square" />;
            const dStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const info = dbCalendarData[dStr];
            const isAvailable = info?.available === true;
            const isCheckIn = searchParams.checkIn === dStr;
            const isCheckOut = searchParams.checkOut === dStr;
            const inRange = new Date(dStr) > new Date(searchParams.checkIn) && new Date(dStr) < new Date(searchParams.checkOut);
            
            return (
              <div 
                key={i} 
                onClick={() => isAvailable && handleDateClick(dStr)}
                className={`aspect-square border border-[#F3F6F8] rounded-[24px] p-2 flex flex-col items-center justify-center transition-all group relative 
                  ${!isAvailable ? 'bg-slate-50 cursor-not-allowed border-transparent opacity-40' : (isCheckIn || isCheckOut) ? 'bg-[#004253] text-white shadow-xl shadow-[#004253]/20 border-[#004253] cursor-pointer' : inRange ? 'bg-[#004253]/[0.03] border-transparent cursor-pointer' : 'bg-white hover:bg-slate-50 cursor-pointer'}`}
              >
                {/* MinStay dot */}
                {isAvailable && info?.minStay > 1 && (
                  <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isCheckIn || isCheckOut ? 'bg-white' : 'bg-[#F88F01]'}`} />
                )}

                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[#F88F01] opacity-60 text-3xl font-light">close</span>
                  </div>
                )}
                
                <span className={`text-[15px] font-black ${!isAvailable ? 'text-slate-300' : (isCheckIn || isCheckOut) ? 'text-white' : 'text-[#004253]'}`}>
                  {d}
                </span>
                
                {isAvailable && (
                  <span className={`text-[9px] font-bold mt-1 ${(isCheckIn || isCheckOut) ? 'text-white/60' : 'text-slate-400 opacity-60'}`}>
                    {Math.round(info.price)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-16">
      {renderSingleMonth(viewDate.getFullYear(), viewDate.getMonth())}
      {renderSingleMonth(viewDate.getFullYear(), viewDate.getMonth() + 1)}
    </div>
  );
};
