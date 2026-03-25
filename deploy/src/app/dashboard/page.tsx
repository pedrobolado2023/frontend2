'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config';

export default function DashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchReservations(parsedUser.email);
    } else {
      router.push('/login');
    }
  }, []);

  const fetchReservations = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/booking/reservations?email=${email}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // KPIs calculados
  const totalReservations = reservations.length;
  const totalCommission = reservations.reduce((acc, res) => acc + (res.total_price * 0.1), 0);
  const activeAllotments = 28; // Simulado ou vindo de outro endpoint

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 py-6 bg-surface dark:bg-on-surface w-64 border-r border-outline-variant/10">
        <div className="px-6 mb-10">
          <span className="text-lg font-black text-primary tracking-tighter">Enjoy Hotéis</span>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-bold text-sm text-primary">{user?.name || 'Agente'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{user?.role || 'AGENT'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center px-6 py-3 bg-primary/5 text-primary font-bold border-r-4 border-primary" href="/dashboard">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors" href="/search">
            <span className="material-symbols-outlined mr-3">event_available</span>
            <span className="text-sm font-medium">Reservas / Busca</span>
          </Link>
          <Link className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors" href="/admin">
            <span className="material-symbols-outlined mr-3">hotel_class</span>
            <span className="text-sm font-medium">Allotments</span>
          </Link>
          <Link className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors" href="/admin">
            <span className="material-symbols-outlined mr-3">payments</span>
            <span className="text-sm font-medium">Tarifas</span>
          </Link>
        </nav>
        <div className="px-6 mt-auto space-y-1">
          <Link href="/search" className="w-full bg-primary text-white py-3 rounded-lg mb-6 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">search</span>
            <span className="text-sm font-semibold">Nova Reserva</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center py-2 text-error hover:opacity-80 transition-colors">
            <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
            <span className="text-xs font-medium uppercase font-black">Sair do Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-grow min-h-screen">
        <header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50 bg-surface shadow-[0px_12px_32px_rgba(0,66,83,0.04)]">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Painel de Controle</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-secondary"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-2 text-slate-500 hover:text-secondary"><span className="material-symbols-outlined">account_circle</span></button>
          </div>
        </header>

        <div className="px-8 py-10 space-y-12 max-w-7xl mx-auto">
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Olá, {user?.name?.split(' ')[0] || 'Agente'}</h1>
                <p className="text-on-surface-variant mt-2 text-lg">Aqui está o resumo da performance da sua agência hoje.</p>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total de Reservas</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-black text-primary leading-none">{totalReservations}</h3>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Ativo</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Comissão Total</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black text-secondary leading-none">R$ {totalCommission.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Allotments</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-black text-primary leading-none">{activeAllotments}</h3>
                </div>
              </div>

              <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 text-white">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Suporte Enjoy</p>
                <Link href="#" className="flex items-center gap-2 font-bold text-sm hover:translate-x-2 transition-transform">
                  Falar com Consultor <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Reservations */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/5">
            <div className="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-low/20">
              <h2 className="text-xl font-bold text-primary font-headline">Reservas Recentes</h2>
              <Link href="/search" className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline flex items-center gap-2">
                Nova Reserva <span className="material-symbols-outlined text-xs">add</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-slate-400 font-medium">Carregando dados da agência...</div>
              ) : reservations.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hóspede</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotel / Acomodação</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Período</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Venda</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {reservations.map((res: any) => (
                      <tr key={res.id} className="hover:bg-surface-container-low/10 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-primary text-sm">{res.guest_details?.guestName || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">#{res.id.split('-')[0]}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-sm text-primary">{res.portal_room_types?.portal_hotels?.name || 'Hotel Enjoy'}</p>
                          <p className="text-xs text-slate-500 font-medium">{res.portal_room_types?.name}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs font-bold text-primary">{res.check_in} ➔ {res.check_out}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-secondary">R$ {res.total_price.toFixed(2)}</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Comissão: R$ {(res.total_price * 0.1).toFixed(2)}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {res.status === 'confirmed' ? 'Confirmada' : res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
                  <p className="text-on-surface-variant font-medium">Nenhuma reserva encontrada para sua agência.</p>
                  <Link href="/search" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Fazer Primeira Reserva</Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
