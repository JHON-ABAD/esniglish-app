import React from 'react';
import { Languages, Info, Zap } from 'lucide-react';

export default function Grammar() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manual de Gramática</h2>
        <p className="text-slate-500 mt-2 text-sm">Las reglas inquebrantables del Esniglish.</p>
      </div>

      {/* Lección 1: Estructura Básica */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-4">Lección 1</div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">La Fórmula SVO y el Tiempo</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          El idioma se basa en matemáticas puras: <b>Sujeto + Tiempo + Verbo + Objeto</b>. La partícula de tiempo siempre se coloca <i>antes</i> del verbo para advertir qué tipo de acción viene.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Las 3 Partículas de Tiempo</p>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200"><span className="text-xs font-semibold text-slate-700">Presente</span><span className="text-sm font-bold text-blue-600">RU</span></div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200"><span className="text-xs font-semibold text-slate-700">Pasado</span><span className="text-sm font-bold text-blue-600">SU</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-700">Futuro</span><span className="text-sm font-bold text-blue-600">FU</span></div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-2">La Negación (+ No)</p>
            <div className="text-xs text-slate-700 leading-relaxed">
              El "NO" se coloca estrictamente entre el Sujeto y la Partícula de Tiempo.
            </div>
            <div className="bg-white p-2 rounded-lg border border-rose-100 text-center font-mono text-xs font-bold text-slate-800">
              MI <span className="text-rose-500">NO</span> RU TABE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lección 2: Pronombres */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-3">Lección 2</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Pronombres Personales</h2>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">Todo pronombre termina en la vocal <b>I</b>. No se pluralizan con 'N'. Tienen su propia raíz.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div><b className="text-blue-600">MI:</b> Yo</div><div><b className="text-blue-600">GI:</b> Nosotros</div>
            <div><b className="text-blue-600">DI:</b> Tú</div><div><b className="text-blue-600">VI:</b> Vosotros</div>
            <div><b className="text-blue-600">YI:</b> Él/Ella</div><div><b className="text-blue-600">LI:</b> Ellos/Ellas</div>
          </div>
        </div>

        {/* Lección 3: Posesivos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-3">Lección 3</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Propiedad Posesiva (D)</h2>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">Para indicar propiedad, simplemente agrega la letra <b>D</b> al final del pronombre personal.</p>
          </div>
          <div className="space-y-2">
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs border border-amber-100 font-mono text-center">
              MI + D = <b>MID</b> (Mío/Míos)
            </div>
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs border border-amber-100 font-mono text-center">
              GI + D = <b>GID</b> (Nuestro/Nuestros)
            </div>
          </div>
        </div>
        
        {/* Lección 4: Plurales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <div className="inline-flex bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-3">Lección 4</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">La Sagrada Regla del Plural</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              En Esniglish, la letra <b>N</b> sirve única y exclusivamente para pluralizar SUSTANTIVOS (objetos, animales, conceptos). <br/><br/>
              <b>JAMÁS</b> se usa la N para pluralizar pronombres, adjetivos ni partículas. Esa es la deuda técnica de los idiomas antiguos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-rose-500 font-bold text-xs uppercase tracking-widest block mb-2">Incorrecto ❌</span>
              <span className="text-slate-600 line-through">MIN MANSE</span>
            </div>
            <div className="flex-1 bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">Correcto ✅</span>
              <span className="text-emerald-800 font-bold text-lg">GI MANSEN</span>
              <p className="text-[10px] text-emerald-600/80 mt-1">(Nosotros [tenemos] manzanas)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lección 5: Los Artículos y Estados */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-cyan-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-5"><Languages size={150}/></div>
        <div className="inline-flex bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-4 relative z-10">Lección 5</div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Artículos y Estados (El Gerundio)</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10">
          No existe el género gramatical ni complicaciones innecesarias. Se usan partículas estáticas.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl text-center">
            <span className="text-cyan-800 font-black text-xl mb-1 block">NI</span>
            <span className="text-cyan-600 text-[10px] font-bold uppercase tracking-widest block mb-2">Artículo Definido</span>
            <p className="text-xs text-cyan-700/80">Equivale al "The". (El, La, Los, Las).</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center">
            <span className="text-purple-800 font-black text-xl mb-1 block">BA</span>
            <span className="text-purple-600 text-[10px] font-bold uppercase tracking-widest block mb-2">Verbo Principal</span>
            <p className="text-xs text-purple-700/80">Ser / Estar (Estado o identidad estática).</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-center sm:col-span-2 lg:col-span-1">
            <span className="text-amber-800 font-black text-xl mb-1 block">GA</span>
            <span className="text-amber-600 text-[10px] font-bold uppercase tracking-widest block mb-2">Estado Continuo</span>
            <p className="text-xs text-amber-700/80">El Gerundio (-ando, -iendo). Va después del tiempo.</p>
            <div className="mt-2 text-[10px] font-bold bg-white p-1 rounded border border-amber-200">MI RU GA TABE (Yo estoy comiendo)</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN ESPECIAL: ECONOMÍA DEL LENGUAJE */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-yellow-400"><Zap size={100}/></div>
        <div className="inline-flex bg-yellow-500 text-yellow-950 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase mb-4 relative z-10 flex items-center gap-1">
          <Zap size={12}/> Filosofía Avanzada
        </div>
        <h2 className="text-2xl font-black mb-2 relative z-10 text-yellow-400">Economía del Lenguaje</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10 max-w-2xl">
          El Esniglish tiene un "Alma Dual". La <b>Escritura es Sagrada</b> y debe respetar las reglas matemáticas (sonando similar a la formalidad Japonesa). Pero al <b>Hablar Rápido</b>, se permite la contracción de fonemas, dándole la eficiencia y el ritmo del Inglés.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Tiempos Verbales</h4>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center"><span className="text-slate-300">MI RU ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">MIR</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-300">MI SU ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">MIS</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-300">MI FU ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">MIF</span></div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-2"><span className="text-slate-300 text-xs">MI NO RU BA ➔</span> <span className="text-rose-400 font-bold bg-rose-400/10 px-2 py-0.5 rounded">MI NORBA</span></div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Preposiciones</h4>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center"><span className="text-slate-300">UN NI ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">UNI</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300">ON NI ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">ONI</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300 text-xs">UN NEKI ➔</span> <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">UNEKI</span></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 italic">* Las contracciones terminan en consonante, evitando ambigüedades con los Posesivos que terminan en "D" (ej. MID).</p>
          </div>
        </div>
      </div>

    </div>
  );
}