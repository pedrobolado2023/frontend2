'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_URL } from '../config';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const roomTypeId = searchParams.get('roomTypeId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const totalPrice = Number(searchParams.get('totalPrice')) || 0;
  const hotelName = searchParams.get('hotelName') || 'Enjoy Hotéis';
  const roomTypeName = searchParams.get('roomTypeName') || 'Quarto Selecionado';
  const imageUrl = searchParams.get('imageUrl') || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestAge: '',
    specialRequests: ''
  });

  const handleConfirm = async () => {
    if (!formData.guestName) {
      alert('Por favor, preencha o nome do hóspede.');
      return;
    }

    if (!roomTypeId) {
      alert('Informações do quarto não encontradas. Por favor, refaça a busca.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/booking/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomTypeId,
          checkIn,
          checkOut,
          guestDetails: formData,
          totalPrice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao emitir reserva');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      alert(`Falha ao processar reserva: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <h1 className="text-3xl font-headline font-black text-primary mb-2">Reserva Confirmada!</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          O voucher foi gerado com sucesso e enviado para o e-mail da agência. Você será redirecionado para o dashboard em instantes.
        </p>
        <Link href="/dashboard" className="text-secondary font-bold hover:underline">Voltar agora</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50 bg-surface shadow-[0px_12px_32px_rgba(0,66,83,0.06)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-extrabold text-primary tracking-tighter font-headline">Enjoy Hotéis</span>
          <div className="hidden md:flex gap-6 items-center">
            <Link className="text-on-surface-variant font-medium font-headline text-sm tracking-tight hover:text-secondary transition-colors" href="/dashboard">Dashboard</Link>
            <Link className="text-primary border-b-2 border-primary pb-1 font-headline text-sm font-bold tracking-tight" href="#">Finalizar Reserva</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-primary">notifications</button>
          <button className="material-symbols-outlined text-primary">help_outline</button>
          <button className="material-symbols-outlined text-primary">account_circle</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!roomTypeId ? (
          <div className="bg-error-container text-error p-8 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Dados da reserva ausentes</h2>
            <p className="mb-6">Por favor, volte para a página de busca e selecione um quarto disponível.</p>
            <Link href="/search" className="bg-error text-white px-6 py-2 rounded-lg font-bold">Voltar para Busca</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-headline font-extrabold text-primary mb-6 tracking-tight">Informações do Hóspede</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.75rem] font-semibold text-on-surface-variant tracking-wider uppercase">Nome Completo (Responsável)</label>
                    <input 
                      className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary px-4 py-3 rounded-t-lg transition-all text-on-surface outline-none" 
                      placeholder="Ex: Ricardo Almeida" 
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.75rem] font-semibold text-on-surface-variant tracking-wider uppercase">Idade</label>
                    <input 
                      className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary px-4 py-3 rounded-t-lg transition-all text-on-surface outline-none" 
                      placeholder="34" 
                      type="number"
                      value={formData.guestAge}
                      onChange={(e) => setFormData({...formData, guestAge: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[0.75rem] font-semibold text-on-surface-variant tracking-wider uppercase">Pedidos Especiais</label>
                    <textarea 
                      className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary px-4 py-3 rounded-t-lg transition-all text-on-surface outline-none" 
                      placeholder="Andar alto, preferência de check-in antecipado, restrições alimentares..." 
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Detalhamento Financeiro</h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Tarifa B2B Agente</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Tarifa NET (Pagamento ao Hotel)</span>
                    <span className="text-primary font-headline font-bold">R$ {(totalPrice * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface-variant font-medium">Comissão da Agência</span>
                      <span className="text-[10px] bg-secondary-container/20 text-secondary px-1.5 py-0.5 rounded font-bold">10%</span>
                    </div>
                    <span className="text-secondary font-headline font-bold">+ R$ {(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-6">
                    <span className="text-xl font-headline font-extrabold text-primary">Preço Total de Venda</span>
                    <div className="text-right">
                      <span className="text-3xl font-headline font-extrabold text-secondary">R$ {totalPrice.toFixed(2)}</span>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Valor a ser pago pelo cliente</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-primary/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  <div>
                    <p className="font-bold text-primary">Confirmação Instantânea</p>
                    <p className="text-xs text-on-surface-variant">Voucher gerado imediatamente após a confirmação</p>
                  </div>
                </div>
                <button 
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-headline font-extrabold tracking-tight shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Confirmar e Emitir Voucher'}
                </button>
              </div>
            </div>

            {/* Right Column: Voucher Preview */}
            <aside className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
                <div className="h-48 w-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
                <div className="p-6">
                  <h3 className="text-lg font-headline font-extrabold text-primary leading-tight">{hotelName}</h3>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Entrada</p>
                      <p className="text-sm font-bold text-primary">{checkIn}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Saída</p>
                      <p className="text-sm font-bold text-primary">{checkOut}</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">bed</span>
                      <p className="text-sm font-medium">{roomTypeName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">restaurant</span>
                      <p className="text-sm font-medium">Café da Manhã Incluso</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
