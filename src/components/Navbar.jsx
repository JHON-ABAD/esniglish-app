import React, { useRef } from 'react';
import { Book, BookOpen, Languages, Cloud, AlertCircle, GraduationCap, ShieldCheck, Sparkles, Lightbulb } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, syncStatus, setShowAdminPanel, isAdmin }) {
  const timerRef = useRef(null);

  const handlePressStart = () => {
    timerRef.current = setTimeout(() => {
      setShowAdminPanel(prev => !prev);
    }, 5000);
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo y Estado */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
            <Languages size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">ESNIGLISH</h1>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">
              {syncStatus === 'synced' ? <Cloud size={10} className="text-emerald-500" /> : <AlertCircle size={10} />}
              {syncStatus === 'synced' ? 'Sincronizado' : 'Conectando...'}
            </div>
          </div>
        </div>
        
        {/* Pestañas de Navegación */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full md:w-auto overflow-x-auto flex-nowrap scrollbar-hide select-none">
          
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'home' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles size={14} /> Inicio
          </button>

          <button onClick={() => setActiveTab('grammar')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'grammar' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <BookOpen size={14} /> Gramática
          </button>

          <button onClick={() => setActiveTab('practice')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'practice' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <GraduationCap size={14} /> Práctica
          </button>

          {/* BOTÓN CON EL TRUCO SECRETO */}
          <button 
            onClick={() => setActiveTab('dictionary')} 
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'dictionary' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Book size={14} /> Diccionario
          </button>

          <button onClick={() => setActiveTab('suggestions')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'suggestions' ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200/50' : 'text-slate-500 hover:text-amber-600'}`}>
            <Lightbulb size={14} /> Sugerencias
          </button>

        </div>

        {/* Indicador Admin */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm animate-in zoom-in duration-300">
              <ShieldCheck size={14} className="text-emerald-500" />
              Admin
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}