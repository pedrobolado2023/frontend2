'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config';

export default function AdminPage() {
  const router = useRouter();
  const [allotments, setAllotments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllotments();
  }, []);

  const fetchAllotments = async () => {
    try {
      const response = await fetch(`${API_URL}/booking/allotments`);
      const data = await response.json();
      setAllotments(data);
    } catch (error) {
      console.error('Erro ao buscar allotments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllotment = async (id: string, value: number) => {
    try {
      await fetch(`${API_URL}/booking/allotments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableQuantity: value })
      });
      // Atualizar localmente
      setAllotments(prev => prev.map(a => a.id === id ? { ...a, available_quantity: value } : a));
    } catch (error) {
      console.error('Erro ao atualizar allotment:', error);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportTariffs = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/booking/import-tariffs`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      alert(result.message || 'Importação concluída!');
      fetchAllotments();
    } catch (error) {
      console.error('Erro ao importar tarifas:', error);
      alert('Erro na importação.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* SideNavBar */}
      <aside className="bg-surface flex flex-col fixed left-0 top-0 h-full z-40 py-6 w-64 border-r border-outline-variant/10 font-['Inter'] text-sm font-medium">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
             <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-primary tracking-tighter">Enjoy Hotéis</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Administrador</p>
          </div>
        </div>
        <nav className="flex-grow space-y-1">
          <Link className="mx-4 flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-all rounded-lg" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
          <Link className="mx-4 flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-all rounded-lg" href="/search">
            <span className="material-symbols-outlined">event_available</span> Reservas
          </Link>
          <Link className="mx-4 flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary font-bold border-r-4 border-primary" href="/admin">
            <span className="material-symbols-outlined">hotel_class</span> Allotments
          </Link>
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button onClick={handleLogout} className="mx-4 flex w-full items-center gap-3 px-4 py-3 text-error hover:opacity-80 text-xs font-black uppercase">
            <span className="material-symbols-outlined">logout</span> Sair do Portal
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-grow p-10 max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-secondary font-black tracking-widest text-[10px] uppercase block mb-2">Terminal de Gerenciamento</span>
            <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Allotment e Tarifas</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Tariff Import */}
          <section className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5">
              <h3 className="text-lg font-headline font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">upload_file</span> Importação de Tarifas
              </h3>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportTariffs(file);
                }}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer text-center group"
              >
                <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">cloud_upload</span>
                <p className="text-sm font-semibold text-on-surface">{loading ? 'Processando...' : 'Processar Tarifário (Excel)'}</p>
                <p className="text-[11px] text-slate-400 mt-1">Clique para selecionar o arquivo do computador</p>
              </div>
            </div>
          </section>

          {/* Manual Adjustments */}
          <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
            <div className="p-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/10">
              <div>
                <h3 className="text-lg font-headline font-bold text-primary">Ajustes de Allotment</h3>
                <p className="text-xs text-slate-500 font-medium">Gerencie a disponibilidade de quartos em tempo real</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-slate-400">Carregando inventário...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotel / Tipo</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Disponível</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {allotments.map((a: any) => (
                      <tr key={a.id} className="hover:bg-surface-container-low/10 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-primary">{a.portal_room_types?.portal_hotels?.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{a.portal_room_types?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-secondary">{a.date}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input 
                            className="w-16 text-right bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary text-sm font-black text-primary p-2" 
                            type="number" 
                            value={a.available_quantity}
                            onChange={(e) => handleUpdateAllotment(a.id, parseInt(e.target.value))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
