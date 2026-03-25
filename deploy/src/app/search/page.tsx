'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config';
import { HotelCard } from './components/HotelCard';
import { SelectionCalendar } from './components/SelectionCalendar';
import { GuestPicker } from './components/GuestPicker';

export default function SearchPage() {
  const router = useRouter();
  const [rateType, setRateType] = useState('NET');
  const [searchParams, setSearchParams] = useState({
    hotelName: '',
    checkIn: '2026-04-01',
    checkOut: '2026-04-03'
  });

  const [results, setResults] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  // States for UI
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [dbCalendarData, setDbCalendarData] = useState<any>({});

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...searchParams,
        adults: guests.adults.toString(),
        children: guests.children.toString(),
        rooms: guests.rooms.toString()
      }).toString();
      const response = await fetch(`${API_URL}/booking/search?${query}`);
      const data = await response.json();
      setResults(data);
      if (data.length > 0) setSelectedResult(data[0]);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${API_URL}/booking/hotels`);
      const data = await response.json();
      if (Array.isArray(data)) setHotels(data);
    } catch (error) {
      console.error('Erro ao buscar hotéis:', error);
    }
  };

  const fetchCalendarData = async () => {
    try {
      const resp = await fetch(`${API_URL}/booking/calendar?hotelName=${searchParams.hotelName}`);
      const data = await resp.json();
      setDbCalendarData(data || {});
    } catch (e) {
      console.error('Erro calendar:', e);
    }
  };

  const handleGuestChange = (type: 'rooms' | 'adults' | 'children', delta: number) => {
    setGuests(prev => {
      const newVal = Math.max(type === 'rooms' ? 1 : 0, prev[type] + delta);
      if (type === 'adults' && newVal > 6) return prev;
      if (type === 'children' && newVal > 2) return prev;
      if (newVal + (type === 'adults' ? prev.children : prev.adults) > 8) return prev;
      return { ...prev, [type]: newVal };
    });
  };

  useEffect(() => {
    fetchHotels();
    fetchCalendarData();
    handleSearch();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) setCalendarOpen(false);
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) setGuestPickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchParams.hotelName]);

  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1));
  const [selecting, setSelecting] = useState<'IN' | 'OUT'>('IN');

  const handleDateClick = (dStr: string) => {
    if (selecting === 'IN') {
      setSearchParams(prev => ({ ...prev, checkIn: dStr }));
      setSelecting('OUT');
    } else {
      if (new Date(dStr) >= new Date(searchParams.checkIn)) {
        setSearchParams(prev => ({ ...prev, checkOut: dStr }));
        setSelecting('IN');
      } else {
        setSearchParams(prev => ({ ...prev, checkIn: dStr, checkOut: dStr }));
        setSelecting('OUT');
      }
    }
  };

  const handleMonthNav = (dir: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] text-[#004253]">
      <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full z-40 py-6 bg-white w-64 border-r border-[#004253]/5">
        <div className="px-6 mb-10">
          <span className="text-xl font-black text-[#004253] tracking-tighter">Enjoy Hotéis</span>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Portal do Agente</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors" href="/dashboard">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center px-6 py-3 bg-[#004253]/5 text-[#004253] font-bold border-r-4 border-[#004253]" href="/search">
            <span className="material-symbols-outlined mr-3">event_available</span>
            <span className="text-sm font-medium">Reservas / Busca</span>
          </Link>
          <Link className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors" href="/admin">
            <span className="material-symbols-outlined mr-3">hotel_class</span>
            <span className="text-sm font-medium">Allotments</span>
          </Link>
        </nav>
        <div className="px-6 mt-auto">
          <button onClick={() => router.push('/login')} className="w-full flex items-center py-2 text-red-500 hover:opacity-80 transition-colors">
            <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
            <span className="text-xs font-black uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 xl:ml-64 w-full max-w-7xl mx-auto px-8 py-10 space-y-10">
        <section className="bg-white p-10 rounded-[40px] shadow-[0px_32px_96px_rgba(0,66,83,0.08)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 relative group">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#004253] ml-1">Hotel</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border-2 border-[#f1f5f9] rounded-2xl px-6 h-[64px] text-[13px] font-bold focus:ring-0 focus:border-[#F88F01]/30 outline-none appearance-none cursor-pointer"
                  value={searchParams.hotelName}
                  onChange={(e) => setSearchParams({...searchParams, hotelName: e.target.value})}
                >
                  <option value="">Todos os Hotéis</option>
                  {hotels.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#F88F01]">expand_more</span>
              </div>
            </div>

            <div className="space-y-2 relative" ref={calendarRef}>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#004253] ml-1">Período</label>
              </div>
              <div 
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="grid grid-cols-2 border-2 border-[#f1f5f9] rounded-2xl overflow-hidden cursor-pointer hover:border-[#F88F01]/30 bg-white h-[64px]"
              >
                <div className="flex items-center justify-center px-4 border-r border-[#f1f5f9] hover:bg-slate-50 transition-colors">
                  <span className="text-[13px] font-bold">{formatDate(searchParams.checkIn)}</span>
                </div>
                <div className="flex items-center justify-center px-4 hover:bg-slate-50 transition-colors">
                  <span className="text-[13px] font-bold">{formatDate(searchParams.checkOut)}</span>
                </div>
              </div>

              {calendarOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[840px] bg-white shadow-[0px_48px_128px_rgba(0,0,0,0.25)] border border-[#004253]/5 rounded-[48px] p-12 z-[100]">
                  <div className="flex justify-between items-center mb-10">
                    <button onClick={() => handleMonthNav(-1)} className="w-12 h-12 rounded-xl border-2 border-[#F3F6F8] flex items-center justify-center hover:bg-slate-50"><span className="material-symbols-outlined">chevron_left</span></button>
                    <span className="text-sm font-black text-[#004253] uppercase tracking-widest">Defina seu período</span>
                    <button onClick={() => handleMonthNav(1)} className="w-12 h-12 rounded-xl border-2 border-[#F3F6F8] flex items-center justify-center hover:bg-slate-50"><span className="material-symbols-outlined">chevron_right</span></button>
                  </div>
                  <SelectionCalendar 
                    viewDate={viewDate} 
                    dbCalendarData={dbCalendarData} 
                    searchParams={searchParams} 
                    handleDateClick={handleDateClick} 
                  />
                  <div className="mt-14 flex justify-end border-t border-[#F3F6F8] pt-10">
                     <button 
                        onClick={() => { setCalendarOpen(false); handleSearch(); }}
                        className="bg-[#004253] text-white px-12 py-5 rounded-[20px] font-black text-sm uppercase shadow-2xl hover:brightness-110 transition-all"
                      >
                       Confirmar
                      </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 relative" ref={guestRef}>
              <label className="text-[11px] font-black uppercase tracking-widest text-[#004253] ml-1">Hóspedes</label>
              <div 
                onClick={() => setGuestPickerOpen(!guestPickerOpen)}
                className="w-full bg-white border-2 border-[#f1f5f9] rounded-2xl px-6 h-[64px] text-[13px] font-bold flex justify-between items-center cursor-pointer hover:border-[#F88F01]/30"
              >
                <span>{guests.rooms} qt, {guests.adults + guests.children} hósp.</span>
                <span className="material-symbols-outlined text-slate-300">expand_more</span>
              </div>
              {guestPickerOpen && (
                <GuestPicker 
                  guests={guests} 
                  handleGuestChange={handleGuestChange} 
                  onClose={() => setGuestPickerOpen(false)} 
                />
              )}
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="lg:col-span-2 w-full bg-[#004253] text-white h-[64px] rounded-2xl font-black text-[13px] uppercase shadow-2xl hover:brightness-110 active:scale-95 transition-all"
          >
            {loading ? '...' : 'Pesquisar'}
          </button>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <section className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-2xl tracking-tighter">Resultados</h3>
              <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-100">
                <button onClick={() => setRateType('NET')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${rateType === 'NET' ? 'bg-[#004253] text-white' : 'text-slate-400'}`}>NET</button>
                <button onClick={() => setRateType('COM')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${rateType === 'COM' ? 'bg-[#004253] text-white' : 'text-slate-400'}`}>COM</button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                 <div className="p-20 text-center animate-pulse"><p className="font-black uppercase text-slate-200">Buscando as melhores ofertas...</p></div>
              ) : results.length > 0 ? (
                results.map((res: any, idx: number) => (
                  <HotelCard 
                    key={idx} 
                    res={res} 
                    rateType={rateType} 
                    selected={selectedResult?.roomTypeId === res.roomTypeId} 
                    onClick={() => setSelectedResult(res)} 
                  />
                ))
              ) : (
                <div className="p-20 bg-white rounded-3xl text-center border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nenhum resultado</p>
                </div>
              )}
            </div>
          </section>

          <aside className="xl:col-span-4 space-y-8 h-fit sticky top-28">
             {selectedResult && (
               <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#004253]/5">
                  <div className="h-48 bg-slate-200 relative group overflow-hidden">
                     <img className="w-full h-full object-cover transition-transform group-hover:scale-105" src={selectedResult.imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop"} alt="Hotel" loading="lazy" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#004253] to-transparent flex flex-col justify-end p-8">
                       <h4 className="text-xl font-black text-white leading-none">{selectedResult.hotelName}</h4>
                     </div>
                  </div>
                  <div className="p-8 space-y-8">
                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-slate-400 uppercase">Resumo</span>
                           <span className="font-black text-[#004253]">{searchParams.checkIn} - {searchParams.checkOut}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#004253]/[0.02] p-5 rounded-[24px] border border-[#004253]/5">
                           <span className="text-[11px] font-black uppercase">Total</span>
                           <span className="text-2xl font-black text-[#F88F01]">R$ {((rateType === 'NET' ? selectedResult.totalPriceNet : (selectedResult.baseFinalPrice || selectedResult.totalPriceFinal / 1.04)) * 1.04).toLocaleString('pt-BR')}</span>
                        </div>
                        <button 
                          onClick={() => {
                            const params = new URLSearchParams({
                              roomTypeId: selectedResult.roomTypeId,
                              checkIn: searchParams.checkIn,
                              checkOut: searchParams.checkOut,
                              totalPrice: selectedResult.totalPriceFinal.toString(),
                              hotelName: selectedResult.hotelName,
                              roomTypeName: selectedResult.roomTypeName,
                              imageUrl: selectedResult.imageUrl || ''
                            });
                            router.push(`/checkout?${params.toString()}`);
                          }}
                          className="w-full bg-[#004253] text-white py-5 rounded-2xl font-black text-sm uppercase shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-4"
                        >
                          Continuar <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                     </div>
                  </div>
               </div>
             )}
          </aside>
        </div>
      </main>
    </div>
  );
}
