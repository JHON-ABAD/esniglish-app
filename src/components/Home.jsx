import React from 'react';
import { Book, GraduationCap, Sparkles, Zap, ShieldCheck, MessageSquarePlus } from 'lucide-react';

export default function Home({ setActiveTab }) {
  return (
    <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* SECCIÓN HERO */}
      <section className="text-center pt-10 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100 shadow-sm">
          <Sparkles size={14} /> El futuro del lenguaje es lógico
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
          Bienvenidos al <span className="text-blue-600">Esniglish</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Un idioma construido desde la eficiencia, el respeto y la herencia cultural. 
          Diseñado para ser hablado con la velocidad del inglés y la claridad del japonés.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button 
            onClick={() => setActiveTab('dictionary')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center gap-2"
          >
            <Book size={20} /> Explorar Diccionario
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            Empezar a Practicar
          </button>
        </div>
      </section>

      {/* SECCIÓN ETIMOLOGÍA (ES-NI-GLISH) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="font-black text-xl">ES</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Raíz Española</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Heredamos el léxico y la familiaridad. Un idioma que se siente cercano, eliminando la barrera de memorizar miles de raíces nuevas.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="font-black text-xl">NI</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Alma Japonesa (Nihongo)</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            La fonotáctica silábica (Consonante-Vocal) y el respeto gramatical. Un ritmo claro, pausado y profundamente estructurado.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="font-black text-xl">GLISH</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Eficiencia Inglesa</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            La velocidad y la economía del lenguaje. Contracción de partículas para una comunicación rápida y moderna en el día a día.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE FILOSOFÍA Y PARTICIPACIÓN */}
      <section className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden mx-4">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
          <ShieldCheck size={200} />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Un idioma vivo, protegido por su comunidad</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            No permitimos que el idioma se degrade. Cada palabra en el diccionario oficial ha sido filtrada para mantener la lógica y la armonía. 
            Próximamente podrás sugerir tus propias creaciones en nuestro Buzón de Sugerencias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                <Zap size={20} />
              </div>
              <span className="text-sm font-bold text-slate-200">Lógica SVO Pura</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                <MessageSquarePlus size={20} />
              </div>
              <span className="text-sm font-bold text-slate-200">Colaboración Abierta</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}