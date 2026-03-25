'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cnpj: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          cnpj: formData.cnpj // Opcional no backend atual, mas passamos
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao realizar login');
      }

      const data = await response.json();
      
      // Salvar token (Simplificado para o teste)
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirecionar para Dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-x-hidden bg-background">
      {/* Seção Visual (Esquerda) */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 h-[35vh] md:h-screen overflow-hidden bg-primary shrink-0">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Enjoy Olimpia Park Resort" 
            className="w-full h-full object-cover opacity-90 transition-opacity duration-700" 
            src="/login-bg.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16 text-white">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-secondary rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">O Curador Digital</span>
            <h1 className="font-headline font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-tight mb-4 md:mb-6">
              Enjoy Hotéis <br/><span className="text-secondary-fixed-dim italic">Portal do Agente</span>
            </h1>
            <p className="font-body text-base md:text-lg lg:text-xl text-primary-fixed font-light max-w-md opacity-90">
              Acesse o inventário mais exclusivo de resorts de luxo e crie experiências inesquecíveis para seus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Formulário (Direita) */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 lg:p-20 bg-surface min-h-[65vh] md:min-h-screen">
        <div className="w-full max-w-md lg:max-w-lg space-y-8 md:space-y-12">
          {/* Logo/Marca */}
          <div className="flex flex-col space-y-2">
            <div className="text-primary font-headline font-black text-2xl tracking-tighter">Enjoy Hotéis</div>
            <h2 className="font-headline text-3xl font-bold text-on-surface">Bem-vindo de volta</h2>
            <p className="text-on-surface-variant font-medium">Insira suas credenciais para gerenciar seus allotments.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error-container text-error rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Campo CNPJ da Agência */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant" htmlFor="cnpj">CNPJ/ID da Agência</label>
              <div className="relative bg-surface-container-highest flex items-center px-4 py-3 rounded-t-lg transition-all border-b border-transparent focus-within:border-primary">
                <span className="material-symbols-outlined text-primary mr-3 text-xl">business</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full p-0 text-on-surface placeholder:text-outline font-medium" 
                  id="cnpj" 
                  name="cnpj" 
                  placeholder="00.000.000/0000-00" 
                  type="text" 
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Campo E-mail do Agente */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant" htmlFor="user">E-mail/Usuário</label>
              <div className="relative bg-surface-container-highest flex items-center px-4 py-3 rounded-t-lg transition-all border-b border-transparent focus-within:border-primary">
                <span className="material-symbols-outlined text-primary mr-3 text-xl">person</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full p-0 text-on-surface placeholder:text-outline font-medium" 
                  id="user" 
                  name="user" 
                  placeholder="agente@agencia.com.br" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant" htmlFor="password">Senha</label>
                <a className="text-xs font-semibold text-secondary hover:underline underline-offset-4 transition-all" href="#">Esqueceu a senha?</a>
              </div>
              <div className="relative bg-surface-container-highest flex items-center px-4 py-3 rounded-t-lg transition-all border-b border-transparent focus-within:border-primary">
                <span className="material-symbols-outlined text-primary mr-3 text-xl">lock</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full p-0 text-on-surface placeholder:text-outline font-medium" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Botão de Login */}
            <div className="pt-4">
              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold py-4 rounded-xl shadow-[0px_12px_32px_rgba(0,66,83,0.15)] hover:shadow-[0px_16px_40px_rgba(0,66_83,0.25)] hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100" 
                type="submit"
              >
                {loading ? 'Acessando...' : 'Acessar Portal'}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </form>

          {/* Indicador de Status */}
          <div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Acesso seguro com criptografia de 256 bits. A segurança dos seus dados é nossa prioridade.
            </p>
          </div>
        </div>

        {/* Rodapé do Login */}
        <div className="mt-auto pt-12 w-full max-w-md">
          <div className="h-[1px] w-full bg-outline-variant/30 mb-8"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <a className="text-xs font-semibold text-on-surface hover:text-secondary transition-colors" href="#">Novo Registro de Agência</a>
              <a className="text-xs font-semibold text-on-surface hover:text-secondary transition-colors" href="#">Suporte</a>
            </div>
            <p className="text-[10px] text-outline font-medium uppercase tracking-widest">© 2024 Enjoy Hotéis</p>
          </div>
        </div>
      </section>
    </main>
  );
}
