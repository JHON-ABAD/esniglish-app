import React, { useMemo } from 'react';
import { Zap, RefreshCw, Network, Info, Wand2, Languages } from 'lucide-react';

const TIEMPOS = ['Presente', 'Pasado', 'Futuro'];

// Mapas Mágicos
const POSESIVOS_MAP = {
  'Mi': { sing: 'Mid (Mi/Mío)', plur: 'Mid (Mis/Míos)' },
  'Di': { sing: 'Did (Tu/Tuyo)', plur: 'Did (Tus/Tuyos)' },
  'Yi': { sing: 'Yid (Su/Suyo)', plur: 'Yid (Sus/Suyos)' },
  'Gi': { sing: 'Gid (Nuestro)', plur: 'Gid (Nuestros)' },
  'Vi': { sing: 'Vid (Vuestro)', plur: 'Vid (Vuestros)' },
  'Li': { sing: 'Lid (Su/Suyo plural)', plur: 'Lid (Sus/Suyos plural)' }
};

const OBJETOS_MAP = {
  'Mi': 'me', 
  'Di': 'te', 
  'Yi': 'le',
  'Gi': 'nos', 
  'Vi': 'os', 
  'Li': 'les'
};

const pluralizeSpanish = (word) => {
  if (!word) return '';
  let w = word.trim().toLowerCase();
  const lastChar = w.slice(-1);
  if (['a', 'e', 'i', 'o', 'u'].includes(lastChar)) return w + 's';
  if (lastChar === 'z') return w.slice(0, -1) + 'ces';
  w = w.replace('ón', 'on').replace('án', 'an').replace('én', 'en').replace('ín', 'in').replace('ún', 'un');
  return w + 'es';
};

const getSpanishArticle = (word, isPlural) => {
  if (!word) return '';
  let w = word.trim().toLowerCase();
  let isFeminine = w.endsWith('a') || w.endsWith('ción') || w.endsWith('sión') || w.endsWith('dad') || w.endsWith('tad') || w.endsWith('tud') || w.endsWith('umbre');
  const masculineExceptions = ['problema', 'sistema', 'mapa', 'idioma', 'programa', 'día', 'dia', 'plan', 'planeta', 'clima', 'tema'];
  const feminineExceptions = ['mano', 'foto', 'moto', 'radio', 'flor', 'nieve', 'miel', 'sal', 'sangre', 'luz', 'noche', 'tarde', 'calle', 'clase', 'carne', 'leche', 'piel'];
  
  if (masculineExceptions.includes(w)) isFeminine = false;
  if (feminineExceptions.includes(w)) isFeminine = true;

  if (isPlural) return isFeminine ? 'las' : 'los';
  return isFeminine ? 'la' : 'el';
};

const getSpanishIndefiniteArticle = (word, isPlural) => {
  if (!word) return '';
  let w = word.trim().toLowerCase();
  let isFeminine = w.endsWith('a') || w.endsWith('ción') || w.endsWith('sión') || w.endsWith('dad') || w.endsWith('tad') || w.endsWith('tud') || w.endsWith('umbre');
  const masculineExceptions = ['problema', 'sistema', 'mapa', 'idioma', 'programa', 'día', 'dia', 'plan', 'planeta', 'clima', 'tema'];
  const feminineExceptions = ['mano', 'foto', 'moto', 'radio', 'flor', 'nieve', 'miel', 'sal', 'sangre', 'luz', 'noche', 'tarde', 'calle', 'clase', 'carne', 'leche', 'piel'];
  
  if (masculineExceptions.includes(w)) isFeminine = false;
  if (feminineExceptions.includes(w)) isFeminine = true;

  if (isPlural) return isFeminine ? 'unas' : 'unos';
  return isFeminine ? 'un' : 'un';
};

export default function Practice({
  verbWords, pronounWords, nounWords,
  pracMode, setPracMode,
  pracPronounId, setPracPronounId,
  pracVerbId, setPracVerbId,
  pracNounId, setPracNounId,
  pracTiempo, setPracTiempo,
  isPluralNoun, setIsPluralNoun,
  pracIsNegative, setPracIsNegative,
  pracObjSubjId, setPracObjSubjId,
  pracObjPronounId, setPracObjPronounId,
  advSubjId, setAdvSubjId,
  advNeg, setAdvNeg,
  advTime, setAdvTime,
  advVerbId, setAdvVerbId,
  advObjId, setAdvObjId,
  advNounId, setAdvNounId,
  advPlural, setAdvPlural,
  setActiveTab, openModal,
  // Recibimos todas las palabras para buscar los interrogativos
  words 
}) {

    // Extraemos las palabras de pregunta
    const questionWords = useMemo(() => {
        if (!words) return [];
        return words.filter(w => w.category === 'Pronombre Interrogativo' || (w.term.toLowerCase() === 'ki'));
    }, [words]);

    // Nuevo estado para la pregunta
    const [advQuestionId, setAdvQuestionId] = React.useState('none');

    const activePronounObj = pronounWords.find(p => p.id === pracPronounId);
    const activeVerbObj = verbWords.find(v => v.id === pracVerbId);
    const activeNounObj = nounWords.find(n => n.id === pracNounId);
    const activeObjSubjObj = pracObjSubjId !== 'none' ? pronounWords.find(p => p.id === pracObjSubjId) : null;
    const activeObjPronounObj = pronounWords.find(p => p.id === pracObjPronounId);

    let esniglishSentence = "";
    let spanishTranslation = "";
    let esniglishElements = [];

    // --- LÓGICA MODOS SIMPLES ---
    if (pracMode === 'verbos' && activePronounObj && activeVerbObj) {
      const negSpa = pracIsNegative ? 'no ' : '';
      if (pracTiempo === 'Presente') {
        esniglishElements = [
          <span key="1" className="text-blue-400">{activePronounObj.term}</span>,
          pracIsNegative && <span key="2" className="text-rose-400">No</span>,
          <span key="3" className="text-slate-300">Ru</span>,
          <span key="4" className="text-white">{activeVerbObj.term}</span>
        ];
        spanishTranslation = `${activePronounObj.translation} ${negSpa}${activeVerbObj.translation.toLowerCase()}`;
      } else if (pracTiempo === 'Pasado') {
        esniglishElements = [
          <span key="1" className="text-blue-400">{activePronounObj.term}</span>,
          pracIsNegative && <span key="2" className="text-rose-400">No</span>,
          <span key="3" className="text-slate-300">Su</span>,
          <span key="4" className="text-white">{activeVerbObj.term}</span>
        ];
        spanishTranslation = `${activePronounObj.translation} ${negSpa}${activeVerbObj.translation.toLowerCase()} (pasado)`;
      } else if (pracTiempo === 'Futuro') {
        esniglishElements = [
          <span key="1" className="text-blue-400">{activePronounObj.term}</span>,
          pracIsNegative && <span key="2" className="text-rose-400">No</span>,
          <span key="3" className="text-slate-300">Fu</span>,
          <span key="4" className="text-white">{activeVerbObj.term}</span>
        ];
        spanishTranslation = `${activePronounObj.translation} ${negSpa}${activeVerbObj.translation.toLowerCase()} (futuro)`;
      }
    } 
    else if (pracMode === 'posesivos' && activePronounObj && activeNounObj) {
      esniglishElements = [
        <span key="1" className="text-amber-400">{activePronounObj.term}d</span>,
        <span key="2" className="text-white flex items-center">
          {activeNounObj.term}
          {isPluralNoun && <span className="text-emerald-400">n</span>}
        </span>
      ];
      const posesivoObj = POSESIVOS_MAP[activePronounObj.term] || { sing: `[Pos. de ${activePronounObj.translation}]`, plur: `[Pos. plur. de ${activePronounObj.translation}]` };
      const posesivoText = isPluralNoun ? posesivoObj.plur : posesivoObj.sing;
      const spanishNoun = isPluralNoun ? pluralizeSpanish(activeNounObj.translation) : activeNounObj.translation.toLowerCase();
      spanishTranslation = `${posesivoText} ${spanishNoun}`;
    }
    else if (pracMode === 'objetos' && activeVerbObj && activeObjPronounObj) {
      const objSpan = OBJETOS_MAP[activeObjPronounObj.term] || 'le';
      if (!activeObjSubjObj) {
        esniglishElements = [
          <span key="1" className="text-white">{activeVerbObj.term}</span>,
          <span key="2" className="text-blue-400">{activeObjPronounObj.term}</span>
        ];
        spanishTranslation = `${activeVerbObj.translation.toLowerCase()}${objSpan}`;
      } else {
        esniglishElements = [
          <span key="1" className="text-slate-300">{activeObjSubjObj.term}</span>,
          <span key="2" className="text-white">{activeVerbObj.term}</span>,
          <span key="3" className="text-blue-400">{activeObjPronounObj.term}</span>
        ];
        spanishTranslation = `${activeObjSubjObj.translation} ${objSpan} [${activeVerbObj.translation.toLowerCase()}]`;
      }
    }
    // --- LÓGICA MODO ORACIONES COMPLEJAS ---
    else if (pracMode === 'oraciones') {
      const qW = questionWords?.find(q => q.id === advQuestionId);
      const subjW = pronounWords.find(p => p.id === advSubjId);
      const verbW = verbWords.find(v => v.id === advVerbId);
      const objW = pronounWords.find(p => p.id === advObjId);
      const nounW = nounWords.find(n => n.id === advNounId);

      // Builder Visual Esniglish
      if (qW) esniglishElements.push(<span key="q1" className="text-fuchsia-400">{qW.term}</span>);
      if (subjW) esniglishElements.push(<span key="s1" className="text-blue-400">{subjW.term}</span>);
      if (advNeg) esniglishElements.push(<span key="s2" className="text-rose-400">No</span>);
      if (advTime === 'Presente') esniglishElements.push(<span key="s3" className="text-slate-300">Ru</span>);
      if (advTime === 'Pasado') esniglishElements.push(<span key="s4" className="text-slate-300">Su</span>);
      if (advTime === 'Futuro') esniglishElements.push(<span key="s5" className="text-slate-300">Fu</span>);
      if (verbW) esniglishElements.push(<span key="s6" className="text-white">{verbW.term}</span>);
      
      if (advObjId === 'NU_ARTICLE') {
        esniglishElements.push(<span key="s7" className="text-cyan-400">Nu</span>);
      } else if (advObjId === 'BI_ARTICLE') {
        esniglishElements.push(<span key="s7" className="text-purple-400">Bi</span>);
      } else if (objW) {
        const displayTerm = nounW ? `${objW.term}d` : objW.term;
        esniglishElements.push(<span key="s7" className={nounW ? "text-amber-400" : "text-blue-400"}>{displayTerm}</span>);
      }

      if (nounW) esniglishElements.push(<span key="s8" className="text-emerald-400 flex items-center">{nounW.term}{advPlural ? <span className="text-emerald-300">n</span> : ''}</span>);
      if (qW) esniglishElements.push(<span key="q2" className="text-fuchsia-400">?</span>);

      if (esniglishElements.length === 0) {
        esniglishElements = [<span key="empty" className="text-slate-600 italic text-xl md:text-2xl font-medium">Selecciona elementos para armar tu oración</span>];
      } else {
        // Builder Traducción Español Estructural
        let spaParts = [];
        if (subjW) spaParts.push(subjW.translation);
        if (advNeg) spaParts.push("no");

        let posSpan = "";
        
        if (objW) {
            if (nounW) {
                const posObj = POSESIVOS_MAP[objW.term] || {sing: `[Pos. de ${objW.translation}]`, plur: `[Pos. plur. de ${objW.translation}]`};
                posSpan = advPlural ? posObj.plur : posObj.sing;
            } else {
                const objTrans = OBJETOS_MAP[objW.term] || 'le';
                spaParts.push(objTrans);
            }
        }

        if (verbW) {
            let vTrans = verbW.translation.toLowerCase();
            if (advTime === 'Pasado') vTrans += " (pasado)";
            if (advTime === 'Futuro') vTrans += " (futuro)";
            spaParts.push(`[${vTrans}]`);
        }

        if (advObjId === 'NU_ARTICLE') {
            if (nounW) {
                spaParts.push(getSpanishArticle(nounW.translation, advPlural));
            } else {
                spaParts.push("[el/la/los/las]");
            }
        } else if (advObjId === 'BI_ARTICLE') {
            if (nounW) {
                spaParts.push(getSpanishIndefiniteArticle(nounW.translation, advPlural));
            } else {
                spaParts.push("[un/una/unos/unas]");
            }
        } else if (objW && nounW) {
            spaParts.push(posSpan.toLowerCase());
        }

        if (nounW) {
            let nTrans = advPlural ? pluralizeSpanish(nounW.translation) : nounW.translation;
            spaParts.push(nTrans.toLowerCase());
        }
        
        // Formatear pregunta si existe
        if (qW) {
           let baseText = spaParts.join(" ");
           // Evitar que diga "¿Qué yo [comer]?", sino "¿Qué [comer] yo?" o solo "¿Qué yo [comer]?" (traducción estructural)
           spanishTranslation = `¿${qW.translation} ${baseText}?`.replace("  ", " ");
        } else {
           spanishTranslation = spaParts.join(" ");
        }
      }
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Estudio y Práctica</h2>
          <p className="text-slate-500 mt-2 text-sm">Configura la gramática y genera estructuras dinámicas.</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-sm border border-slate-200 flex-wrap justify-center gap-1">
            <button onClick={() => setPracMode('verbos')} className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-all ${pracMode === 'verbos' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
              Conjugación
            </button>
            <button onClick={() => setPracMode('posesivos')} className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'posesivos' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
              <Zap size={14} className={pracMode === 'posesivos' ? 'text-amber-500' : ''}/> Posesivos
            </button>
            <button onClick={() => setPracMode('objetos')} className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'objetos' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
              <RefreshCw size={14} className={pracMode === 'objetos' ? 'text-rose-500' : ''}/> Objetos
            </button>
            <button onClick={() => setPracMode('oraciones')} className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'oraciones' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <Network size={14} /> Oraciones Completas
            </button>
          </div>
        </div>

        {(verbWords.length === 0 || pronounWords.length === 0) ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
            <Info size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Información Insuficiente</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Registra <b>Pronombres Personales</b>, <b>Verbos</b> y <b>Sustantivos</b> en el diccionario para habilitar la práctica.
            </p>
            <button onClick={() => { setActiveTab('dictionary'); openModal(); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm">
              Ir al Diccionario
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Wand2 className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Constructor Dinámico</h3>
            </div>

            {/* INTERFAZ MODOS SIMPLES */}
            {pracMode !== 'oraciones' && (
              <div className={`grid grid-cols-1 gap-5 mb-8 ${pracMode === 'verbos' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
                {/* MODO VERBOS */}
                {pracMode === 'verbos' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Sujeto</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracPronounId} onChange={(e) => setPracPronounId(e.target.value)}>
                        {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({p.translation})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Polaridad</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracIsNegative ? 'negativo' : 'afirmativo'} onChange={(e) => setPracIsNegative(e.target.value === 'negativo')}>
                        <option value="afirmativo">Afirmativo</option>
                        <option value="negativo">Negativo (No)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Tiempo</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracTiempo} onChange={(e) => setPracTiempo(e.target.value)}>
                        {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">4. Verbo</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracVerbId} onChange={(e) => setPracVerbId(e.target.value)}>
                        {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* MODO POSESIVOS */}
                {pracMode === 'posesivos' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Pronombre</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracPronounId} onChange={(e) => setPracPronounId(e.target.value)}>
                        {pronounWords.map(p => {
                          const displayTranslation = POSESIVOS_MAP[p.term]?.sing || `Pos. de ${p.translation}`;
                          return <option key={p.id} value={p.id}>{p.term} ({displayTranslation})</option>;
                        })}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Sustantivo</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracNounId} onChange={(e) => setPracNounId(e.target.value)}>
                        {nounWords.map(n => <option key={n.id} value={n.id}>{n.term} ({n.translation})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Cantidad (N)</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={isPluralNoun ? 'plural' : 'singular'} onChange={(e) => setIsPluralNoun(e.target.value === 'plural')}>
                        <option value="singular">Singular</option>
                        <option value="plural">Plural (+N)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* MODO OBJETOS */}
                {pracMode === 'objetos' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Sujeto</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracObjSubjId} onChange={(e) => setPracObjSubjId(e.target.value)}>
                        <option value="none">-- Ninguno --</option>
                        {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({p.translation})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Verbo</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracVerbId} onChange={(e) => setPracVerbId(e.target.value)}>
                        {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Objeto Receptor</label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracObjPronounId} onChange={(e) => setPracObjPronounId(e.target.value)}>
                        {pronounWords.map(p => {
                          const displayTranslation = OBJETOS_MAP[p.term] || `le`;
                          return <option key={p.id} value={p.id}>{p.term} ({displayTranslation})</option>;
                        })}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* INTERFAZ MODO ORACIONES COMPLEJAS */}
            {pracMode === 'oraciones' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bloque Núcleo de Acción */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">Núcleo de Acción</h4>
                  
                  {/* NUEVA RANURA PARA PREGUNTA */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-fuchsia-600 uppercase">¿Es Pregunta? (Partícula Inicial)</label>
                    <select className="w-full p-2 rounded-lg bg-fuchsia-50 border border-fuchsia-200 outline-none font-bold text-fuchsia-700 text-xs" value={advQuestionId} onChange={(e) => setAdvQuestionId(e.target.value)}>
                      <option value="none">- Afirmación (No) -</option>
                      {questionWords?.map(q => <option key={q.id} value={q.id}>{q.term} ({q.translation})</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Sujeto</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-blue-700 text-xs" value={advSubjId} onChange={(e) => setAdvSubjId(e.target.value)}>
                        <option value="none">- Omitir -</option>
                        {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Polaridad</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-rose-600 text-xs" value={advNeg ? 'negativo' : 'afirmativo'} onChange={(e) => setAdvNeg(e.target.value === 'negativo')}>
                        <option value="afirmativo">Afirmativo</option>
                        <option value="negativo">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Tiempo</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-slate-600 text-xs" value={advTime} onChange={(e) => setAdvTime(e.target.value)}>
                        {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Verbo Principal</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-bold text-slate-800 text-xs" value={advVerbId} onChange={(e) => setAdvVerbId(e.target.value)}>
                        <option value="none">- Omitir -</option>
                        {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bloque Complemento */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">Complemento</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Modificador / Objeto</label>
                    <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-amber-600 text-xs" value={advObjId} onChange={(e) => setAdvObjId(e.target.value)}>
                      <option value="none">- Ninguno -</option>
                      <option value="NU_ARTICLE">Nu (El/La/Los/Las)</option>
                      <option value="BI_ARTICLE">Bi (Un/Una/Unos/Unas)</option>
                      {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term}</option>)}
                    </select>
                    <p className="text-[9px] text-slate-400 mt-1">Si eliges Artículo o Pronombre antes del sustantivo, lo modificará.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Sustantivo</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-bold text-emerald-600 text-xs" value={advNounId} onChange={(e) => setAdvNounId(e.target.value)}>
                        <option value="none">- Ninguno -</option>
                        {nounWords.map(n => <option key={n.id} value={n.id}>{n.term}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Cantidad</label>
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-slate-600 text-xs" value={advPlural ? 'plural' : 'singular'} onChange={(e) => setAdvPlural(e.target.value === 'plural')} disabled={advNounId === 'none'}>
                        <option value="singular">1</option>
                        <option value="plural">+N</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL DE RESULTADO PROFESIONAL */}
            <div className={`rounded-2xl p-8 md:p-10 text-center relative overflow-hidden border shadow-inner transition-colors duration-500 ${pracMode === 'oraciones' ? 'bg-slate-950 border-indigo-900/50' : 'bg-slate-900 border-slate-800'}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none 
                ${pracMode === 'posesivos' ? (isPluralNoun ? 'bg-amber-500' : 'bg-emerald-500') : 
                  pracMode === 'objetos' ? 'bg-rose-500' : 
                  pracMode === 'oraciones' ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
              
              <p className="text-slate-400 font-semibold tracking-wider text-[10px] uppercase mb-4 relative z-10">Output Generado</p>
              
              <div className="relative z-10">
                <div className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight flex items-center justify-center gap-3 flex-wrap">
                  {esniglishElements}
                </div>
                
                {spanishTranslation && (
                  <div className="inline-flex flex-col bg-slate-800/50 px-5 py-4 rounded-xl border border-slate-700/50 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                      <Languages className="text-slate-400" size={18} />
                      <span className="text-white font-medium text-base capitalize">{spanishTranslation}</span>
                    </div>
                    
                    {/* Nota Gramatical Automática */}
                    {((pracMode === 'objetos' && activeObjSubjObj) || (pracMode === 'oraciones' && advObjId !== 'none' && advObjId !== 'NU_ARTICLE' && advObjId !== 'BI_ARTICLE' && advVerbId !== 'none' && advNounId === 'none')) ? (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Info size={12} /> Traducción Estructural SVO
                        </span>
                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                          El Esniglish utiliza el orden lógico <b>(Sujeto + Verbo + Objeto)</b>. En español se adapta interpretando la acción directamente.
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
}