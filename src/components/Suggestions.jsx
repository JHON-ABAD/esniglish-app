import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, Send, LogIn, CheckCircle2, Inbox } from 'lucide-react';

export default function Suggestions({ user, login, submitSuggestion, categories, isAdmin, suggestionsList, approveSuggestion, rejectSuggestion }) {
  const [formData, setFormData] = useState({ term: '', translation: '', category: 'Sustantivo', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  // --- VISTA DE ADMINISTRADOR (BANDEJA DE INQUISIDOR) ---
  if (isAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Inbox className="text-blue-600" size={28} />
              Bandeja de Inquisidor
            </h3>
            <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm">
              {suggestionsList?.length || 0} Pendientes
            </span>
          </div>

          {!suggestionsList || suggestionsList.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-bold text-lg mb-1">No hay sugerencias nuevas.</p>
              <p className="text-slate-400 text-sm">El pueblo está en silencio. Todo está en orden.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {suggestionsList.map(sug => (
                <div key={sug.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-black text-2xl text-blue-600">{sug.term}</span>
                      <span className="text-slate-400 font-bold text-xl">=</span>
                      <span className="font-bold text-slate-700 text-xl">{sug.translation}</span>
                      <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-3 py-1 rounded-md font-bold ml-2 tracking-wider">{sug.category}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium"><b>Remitente:</b> {sug.userEmail}</p>
                    <div className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 mt-2 shadow-sm">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                        <Lightbulb size={12}/> Justificación (Etimología)
                      </span>
                      <p className="italic">"{sug.reason}"</p>
                    </div>
                  </div>
                  <div className="flex w-full md:w-auto md:flex-col gap-3 mt-4 md:mt-0">
                    <button onClick={() => approveSuggestion(sug)} className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                      Aprobar
                    </button>
                    <button onClick={() => rejectSuggestion(sug.id)} className="flex-1 md:flex-none px-6 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm">
                      Incinerar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA DE MORTALES (FORMULARIO) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.reason.length < 15) {
      alert("La justificación debe tener al menos 15 caracteres.");
      return;
    }
    submitSuggestion(formData);
    setSubmitted(true);
    setFormData({ term: '', translation: '', category: 'Sustantivo', reason: '' });
    
    // Quitar el mensaje de éxito después de 4 segundos
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center">
        <div className="inline-flex bg-amber-100 text-amber-700 p-3 rounded-2xl mb-4 shadow-sm">
          <Lightbulb size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buzón de Sugerencias</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
          Ayuda a expandir el Esniglish. Propón nuevas palabras con lógica y sentido.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-500"/> Reglas de la Comunidad
        </h3>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li><b>Cero Tolerancia:</b> Cualquier sugerencia que fomente el racismo, insultos u odio será eliminada permanentemente.</li>
          <li><b>Lógica Estructural:</b> La palabra debe respetar las reglas de fonética y escritura del Esniglish.</li>
          <li><b>Justificación:</b> Debes explicar el "por qué" de la palabra (su etimología o razón de ser). No aceptamos palabras sin contexto.</li>
        </ul>
      </div>

      {!user ? (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <LogIn size={40} className="mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-bold text-slate-800">Identidad Requerida</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Para evitar el spam y mantener la calidad del idioma, requerimos que inicies sesión con tu cuenta de Google para enviar sugerencias.
          </p>
          <button onClick={login} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto">
            Iniciar Sesión con Google
          </button>
        </div>
      ) : submitted ? (
        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center space-y-4 animate-in zoom-in">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-2" />
          <h3 className="text-xl font-bold text-emerald-800">¡Sugerencia Enviada!</h3>
          <p className="text-emerald-600 text-sm">
            Gracias por contribuir al Esniglish. El administrador revisará tu palabra pronto.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Palabra propuesta</label>
              <input required placeholder="Ej: Deka" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all" value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Traducción</label>
              <input required placeholder="Ej: Grande" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all" value={formData.translation} onChange={e => setFormData({...formData, translation: e.target.value})}/>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</label>
            <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Justificación (Etimología)</span>
              <span className={`${formData.reason.length < 15 ? 'text-rose-400' : 'text-emerald-500'}`}>{formData.reason.length}/15 min</span>
            </label>
            <textarea required placeholder="Explica por qué esta palabra tiene sentido en el Esniglish..." rows="3" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all resize-none" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
          </div>

          <button type="submit" disabled={formData.reason.length < 15} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Send size={18} /> Enviar al Administrador
          </button>
        </form>
      )}
    </div>
  );
}