import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Zap, RefreshCw, Network, Info, Wand2, Languages, HelpCircle, Palette, Maximize2, Minimize2, X, Lock } from 'lucide-react';

const TIEMPOS = ['Presente', 'Pasado', 'Futuro'];

// Función para extraer significados separados por "/" (Ej: mi / mis / mío)
const parseTranslation = (translationString) => {
  if (!translationString) return [];
  return translationString.split(/[\/-]/).map(s => s.trim());
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

// Traductor Inteligente de Gerundio (ando/iendo)
const toGerundio = (word) => {
    if (!word) return '';
    let w = word.trim().toLowerCase();
    if (w.endsWith('se')) w = w.slice(0, -2); // ej: bañarse -> bañar
    if (w.endsWith('ar')) return w.slice(0, -2) + 'ando';
    if (w.endsWith('er') || w.endsWith('ir')) {
        if (w === 'ir') return 'yendo';
        if (w.endsWith('aer') || w.endsWith('eer') || w.endsWith('oir') || w.endsWith('uir')) {
            if (w === 'construir') return 'construyendo';
            return w.slice(0, -2) + 'yendo'; 
        }
        return w.slice(0, -2) + 'iendo';
    }
    return w + 'ando'; // fallback de seguridad
};

export default function Practice({
  verbWords, pronounWords, nounWords,
  pracMode, setPracMode,
  pracPronounId, setPracPronounId,
  pracVerbId, setPracVerbId,
  pracNounId, setPracNounId,
  pracTiempo, setPracTiempo,
  pracGerundio, setPracGerundio,
  isPluralNoun, setIsPluralNoun,
  pracIsNegative, setPracIsNegative,
  pracObjSubjId, setPracObjSubjId,
  advSubjId, setAdvSubjId,
  advNeg, setAdvNeg,
  advTime, setAdvTime,
  advGerundio, setAdvGerundio,
  advVerbId, setAdvVerbId,
  advObjId, setAdvObjId,
  advNounId, setAdvNounId,
  advPlural, setAdvPlural,
  setActiveTab, openModal,
  words 
}) {

    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error al activar pantalla completa: ${err.message}`);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    const sys = useMemo(() => {
      if (!words) return {};
      const findByTag = (tag, fallbackName) => {
        const found = words.find(w => w.systemTag === tag);
        return found ? found.term : `[Falta ${fallbackName}]`;
      };

      return {
        present: findByTag('system_presente', 'Presente'),
        past: findByTag('system_pasado', 'Pasado'),
        future: findByTag('system_futuro', 'Futuro'),
        plural: findByTag('system_plural', 'Plural'),
        negative: findByTag('system_negativo', 'Negación'),
        defArticle: findByTag('system_art_def', 'Art. Definido'),
        indefArticle: findByTag('system_art_indef', 'Art. Indefinido'),
        gerundio: findByTag('system_gerundio', 'Gerundio (Ga)'),
        baseQuestion: findByTag('system_interrogativo_base', 'KI (Pregunta Base)')
      };
    }, [words]);

    const questionWords = useMemo(() => words.filter(w => w.category === 'Pronombre Interrogativo' || w.systemTag === 'system_interrogativo_base'), [words]);
    const possessiveWords = useMemo(() => words.filter(w => w.category === 'Posesivo'), [words]);
    const objectPronounWords = useMemo(() => words.filter(w => w.category === 'Pronombre de Objeto'), [words]);
    const interrogativeWords = useMemo(() => words.filter(w => w.category === 'Pronombre Interrogativo' || w.systemTag === 'system_interrogativo_base'), [words]);
    const adjectiveWords = useMemo(() => words.filter(w => w.category === 'Adjetivo'), [words]);
    const prepositionWords = useMemo(() => words.filter(w => w.category === 'Preposición'), [words]);
    
    // NUEVO: Demostrativos añadidos
    const demonstrativeWords = useMemo(() => words.filter(w => w.category === 'Demostrativo'), [words]);

    const [advQuestionId, setAdvQuestionId] = useState('none');
    const [advAdjId, setAdvAdjId] = useState('none'); 
    const [advPrepId, setAdvPrepId] = useState('none'); 
    const [localPosId, setLocalPosId] = useState('none');
    const [localObjId, setLocalObjId] = useState('none');
    const [localIntId, setLocalIntId] = useState('none');

    const handleTabChange = (newMode) => {
      setPracMode(newMode);
      setPracPronounId('none');
      setPracVerbId('none');
      setPracNounId('none');
      setPracTiempo('none');
      setPracGerundio(false); 
      setIsPluralNoun(false);
      setPracIsNegative(false);
      setPracObjSubjId('none');
      
      setAdvSubjId('none');
      setAdvNeg(false);
      setAdvTime('none');
      setAdvGerundio(false);
      setAdvVerbId('none');
      setAdvObjId('none');
      setAdvNounId('none');
      setAdvPlural(false);

      setAdvQuestionId('none');
      setAdvAdjId('none');
      setAdvPrepId('none'); 
      setLocalPosId('none');
      setLocalObjId('none');
      setLocalIntId('none');
    };

    const activePronounObj = pracPronounId !== 'none' ? pronounWords.find(p => p.id === pracPronounId) : null;
    const activeVerbObj = pracVerbId !== 'none' ? verbWords.find(v => v.id === pracVerbId) : null;
    const activeNounObj = pracNounId !== 'none' ? nounWords.find(n => n.id === pracNounId) : null;
    
    const activePossessiveObj = localPosId !== 'none' ? possessiveWords.find(p => p.id === localPosId) : null; 
    const activeObjSubjObj = pracObjSubjId !== 'none' ? pronounWords.find(p => p.id === pracObjSubjId) : null;
    const activeObjPronounObj = localObjId !== 'none' ? objectPronounWords.find(p => p.id === localObjId) : null;
    const activeIntObj = localIntId !== 'none' ? interrogativeWords.find(p => p.id === localIntId) : null;
    const activeAdjObj = advAdjId !== 'none' ? adjectiveWords.find(p => p.id === advAdjId) : null;

    const isPracGaVerb = activeVerbObj && activeVerbObj.term.toUpperCase() === 'GA';
    const activePracGerundio = pracGerundio && !isPracGaVerb;

    const advVerbW = advVerbId !== 'none' ? verbWords.find(v => v.id === advVerbId) : null;
    const advPrepW = advPrepId !== 'none' ? prepositionWords.find(p => p.id === advPrepId) : null; 
    const isAdvGaVerb = advVerbW && advVerbW.term.toUpperCase() === 'GA';
    const activeAdvGerundio = advGerundio && !isAdvGaVerb;

    let esniglishElements = [];
    let spanishTranslation = "";

    const getTimeMarker = (timeStr) => {
      if (timeStr === 'none') return null;
      if (timeStr === 'Pasado') return sys.past;
      if (timeStr === 'Futuro') return sys.future;
      return sys.present;
    };

    const buildVerbTranslation = (verbObj, tiempo, isGerundio) => {
        let spaParts = [];
        let timeSuffix = '';
        if (tiempo === 'Pasado') timeSuffix = ' (pasado)';
        if (tiempo === 'Futuro') timeSuffix = ' (futuro)';

        if (verbObj) {
            let verbInfinitive = parseTranslation(verbObj.translation)[0].toLowerCase();
            if (isGerundio) {
                spaParts.push(`[estar${timeSuffix}] ${toGerundio(verbInfinitive)}`);
            } else {
                spaParts.push(`[${verbInfinitive}${timeSuffix}]`);
            }
        } else if (isGerundio) {
            spaParts.push(`[estar${timeSuffix}]`);
        }
        
        return spaParts[0] || '';
    };

    // --- LÓGICA MODOS SIMPLES ---
    if (pracMode === 'verbos' && (activePronounObj || activeVerbObj || pracTiempo !== 'none' || pracIsNegative || activePracGerundio)) {
      if (activePronounObj) esniglishElements.push(<span key="1" className="text-blue-400">{activePronounObj.term}</span>);
      if (pracIsNegative) esniglishElements.push(<span key="2" className="text-rose-400">{sys.negative}</span>);
      if (pracTiempo !== 'none') esniglishElements.push(<span key="3" className="text-slate-300">{getTimeMarker(pracTiempo)}</span>);
      if (activePracGerundio) esniglishElements.push(<span key="ger" className="text-orange-400">{sys.gerundio}</span>);
      if (activeVerbObj) esniglishElements.push(<span key="4" className="text-white">{activeVerbObj.term}</span>);
      
      let spaParts = [];
      if (activePronounObj) spaParts.push(parseTranslation(activePronounObj.translation)[0]);
      if (pracIsNegative) spaParts.push("no");
      
      let verbText = buildVerbTranslation(activeVerbObj, pracTiempo, activePracGerundio);
      if (verbText) spaParts.push(verbText);
      
      spanishTranslation = spaParts.join(" ");
    } 
    else if (pracMode === 'posesivos' && (activePossessiveObj || activeNounObj)) {
      if (activePossessiveObj) esniglishElements.push(<span key="1" className="text-amber-400">{activePossessiveObj.term}</span>);
      if (activeNounObj) {
        esniglishElements.push(<span key="2" className="text-white flex items-center ml-2">
          {activeNounObj.term}{isPluralNoun && <span className="text-emerald-400">{sys.plural}</span>}
        </span>);
      }
      
      if (activePossessiveObj) {
        const posParts = parseTranslation(activePossessiveObj.translation); 
        if (activeNounObj) {
          const spanishNoun = isPluralNoun ? pluralizeSpanish(activeNounObj.translation) : activeNounObj.translation.toLowerCase();
          let posWord = posParts[0]; 
          if (isPluralNoun && posParts.length > 1) posWord = posParts[1]; 
          spanishTranslation = `${posWord} ${spanishNoun}`;
        } else {
          let posWordStandalone = posParts.length > 2 ? posParts[2] : posParts[0] || ''; 
          if (isPluralNoun && posParts.length > 4) posWordStandalone = posParts[4]; 
          spanishTranslation = `[Es] ${posWordStandalone}`;
        }
      } else if (activeNounObj) {
         spanishTranslation = isPluralNoun ? pluralizeSpanish(activeNounObj.translation) : activeNounObj.translation.toLowerCase();
      }
    }
    else if (pracMode === 'objetos' && (activeVerbObj || activeObjPronounObj || activeObjSubjObj || pracTiempo !== 'none' || activePracGerundio)) {
      if (activeObjSubjObj) esniglishElements.push(<span key="1" className="text-blue-400">{activeObjSubjObj.term}</span>);
      if (pracTiempo !== 'none') esniglishElements.push(<span key="2" className="text-slate-300">{getTimeMarker(pracTiempo)}</span>);
      if (activePracGerundio) esniglishElements.push(<span key="ger" className="text-orange-400">{sys.gerundio}</span>);
      if (activeVerbObj) esniglishElements.push(<span key="3" className="text-white">{activeVerbObj.term}</span>);
      if (activeObjPronounObj) esniglishElements.push(<span key="4" className="text-rose-400">{activeObjPronounObj.term}</span>);
      
      let spaParts = [];
      if (activeObjSubjObj) spaParts.push(parseTranslation(activeObjSubjObj.translation)[0]);
      if (activeObjPronounObj) spaParts.push(parseTranslation(activeObjPronounObj.translation)[0].toLowerCase());
      
      let verbText = buildVerbTranslation(activeVerbObj, pracTiempo, activePracGerundio);
      if (verbText) spaParts.push(verbText);
      
      spanishTranslation = spaParts.join(" ");
    }
    else if (pracMode === 'preguntas' && (activeIntObj || activePronounObj || activeVerbObj || pracTiempo !== 'none' || activePracGerundio)) {
      if (activeIntObj) esniglishElements.push(<span key="1" className="text-fuchsia-400">{activeIntObj.term}</span>);
      if (activePronounObj) esniglishElements.push(<span key="2" className="text-blue-400">{activePronounObj.term}</span>);
      if (pracTiempo !== 'none') esniglishElements.push(<span key="3" className="text-slate-300">{getTimeMarker(pracTiempo)}</span>);
      if (activePracGerundio) esniglishElements.push(<span key="ger" className="text-orange-400">{sys.gerundio}</span>);
      if (activeVerbObj) esniglishElements.push(<span key="4" className="text-white">{activeVerbObj.term}</span>);
      if (activeIntObj || activePronounObj || activeVerbObj) esniglishElements.push(<span key="5" className="text-fuchsia-400">?</span>);
      
      let spaParts = [];
      let mainQ = '';
      if (activeIntObj && activeIntObj.systemTag !== 'system_interrogativo_base') {
         mainQ = parseTranslation(activeIntObj.translation)[0] || activeIntObj.term;
      }

      if (mainQ) spaParts.push(`¿${mainQ}`);
      else if (activePronounObj || activeVerbObj || activeIntObj) spaParts.push("¿");
      
      if (activePronounObj) spaParts.push(parseTranslation(activePronounObj.translation)[0].toLowerCase());
      
      let verbText = buildVerbTranslation(activeVerbObj, pracTiempo, activePracGerundio);
      if (verbText) spaParts.push(verbText);
      
      spanishTranslation = spaParts.join(" ").replace("¿ ", "¿") + (spaParts.length > 0 ? "?" : "");
    }
    else if (pracMode === 'adjetivos' && (activeAdjObj || activeNounObj || advObjId !== 'none')) {
      const modifierType = advObjId; 
      const posW = possessiveWords.find(p => p.id === advObjId);
      const demW = demonstrativeWords.find(d => d.id === advObjId); // Búsqueda demostrativo

      if (modifierType === 'NU_ARTICLE') esniglishElements.push(<span key="a1" className="text-cyan-400">{sys.defArticle}</span>);
      else if (modifierType === 'BI_ARTICLE') esniglishElements.push(<span key="a1" className="text-purple-400">{sys.indefArticle}</span>);
      else if (posW) esniglishElements.push(<span key="a1" className="text-amber-400">{posW.term}</span>);
      else if (demW) esniglishElements.push(<span key="a1" className="text-violet-400">{demW.term}</span>);

      if (activeAdjObj) esniglishElements.push(<span key="a2" className="text-yellow-300">{activeAdjObj.term}</span>);
      if (activeNounObj) esniglishElements.push(<span key="a3" className="text-emerald-400 flex items-center ml-2">{activeNounObj.term}{isPluralNoun ? <span className="text-emerald-300">{sys.plural}</span> : ''}</span>);

      let spaParts = [];
      if (modifierType === 'NU_ARTICLE') spaParts.push(activeNounObj ? getSpanishArticle(activeNounObj.translation, isPluralNoun) : "[el/la/los/las]");
      else if (modifierType === 'BI_ARTICLE') spaParts.push(activeNounObj ? getSpanishIndefiniteArticle(activeNounObj.translation, isPluralNoun) : "[un/una/unos/unas]");
      else if (posW) {
          const pParts = parseTranslation(posW.translation);
          const pWord = isPluralNoun && pParts.length > 1 ? pParts[1] : pParts[0];
          spaParts.push(pWord.toLowerCase());
      }
      else if (demW) {
          const dParts = parseTranslation(demW.translation);
          const dWord = isPluralNoun && dParts.length > 1 ? dParts[1] : dParts[0];
          spaParts.push(dWord.toLowerCase());
      }

      if (activeNounObj) spaParts.push(isPluralNoun ? pluralizeSpanish(activeNounObj.translation) : activeNounObj.translation.toLowerCase());
      if (activeAdjObj) {
          const adjSpa = isPluralNoun ? pluralizeSpanish(parseTranslation(activeAdjObj.translation)[0]) : parseTranslation(activeAdjObj.translation)[0];
          spaParts.push(adjSpa.toLowerCase());
      }
      spanishTranslation = spaParts.join(" ");
    }
    // --- LÓGICA MODO ORACIONES COMPLEJAS ---
    else if (pracMode === 'oraciones' && (advQuestionId !== 'none' || advSubjId !== 'none' || advNeg || advTime !== 'none' || activeAdvGerundio || advVerbId !== 'none' || advPrepId !== 'none' || advObjId !== 'none' || advAdjId !== 'none' || advNounId !== 'none')) {
      const qW = questionWords?.find(q => q.id === advQuestionId);
      const subjW = pronounWords.find(p => p.id === advSubjId);
      const nounW = nounWords.find(n => n.id === advNounId);
      const adjW = adjectiveWords.find(a => a.id === advAdjId);
      const posW = possessiveWords.find(p => p.id === advObjId);
      const objW = objectPronounWords.find(p => p.id === advObjId);
      const demW = demonstrativeWords.find(d => d.id === advObjId); // Búsqueda demostrativo

      // ENSAMBLE ESNIGLISH
      if (qW) esniglishElements.push(<span key="q1" className="text-fuchsia-400">{qW.term}</span>);
      if (subjW) esniglishElements.push(<span key="s1" className="text-blue-400">{subjW.term}</span>);
      if (advNeg) esniglishElements.push(<span key="s2" className="text-rose-400">{sys.negative}</span>);
      if (advTime !== 'none') esniglishElements.push(<span key="timeMarker" className="text-slate-300">{getTimeMarker(advTime)}</span>);
      if (activeAdvGerundio) esniglishElements.push(<span key="gerMarker" className="text-orange-400">{sys.gerundio}</span>);
      if (advVerbW) esniglishElements.push(<span key="s6" className="text-white">{advVerbW.term}</span>);
      
      if (advPrepW) esniglishElements.push(<span key="prep" className="text-teal-400">{advPrepW.term}</span>); // PREPOSICIÓN

      if (advObjId === 'NU_ARTICLE') esniglishElements.push(<span key="s7" className="text-cyan-400">{sys.defArticle}</span>); 
      else if (advObjId === 'BI_ARTICLE') esniglishElements.push(<span key="s7" className="text-purple-400">{sys.indefArticle}</span>);
      else if (posW) esniglishElements.push(<span key="s7" className="text-amber-400">{posW.term}</span>);
      else if (demW) esniglishElements.push(<span key="s7" className="text-violet-400">{demW.term}</span>);
      else if (objW) esniglishElements.push(<span key="s7" className="text-blue-400">{objW.term}</span>);

      if (adjW) esniglishElements.push(<span key="adj" className="text-yellow-300">{adjW.term}</span>);
      if (nounW) esniglishElements.push(<span key="s8" className="text-emerald-400 flex items-center ml-1">{nounW.term}{advPlural ? <span className="text-emerald-300">{sys.plural}</span> : ''}</span>);
      if (qW || advQuestionId !== 'none') esniglishElements.push(<span key="q2" className="text-fuchsia-400">?</span>);

      // ENSAMBLE ESPAÑOL
      let spaParts = [];
      if (subjW) spaParts.push(parseTranslation(subjW.translation)[0]);
      if (advNeg) spaParts.push("no");
      
      if (objW && !nounW) spaParts.push(parseTranslation(objW.translation)[0].toLowerCase());

      let verbText = buildVerbTranslation(advVerbW, advTime, activeAdvGerundio);
      if (verbText) spaParts.push(verbText);

      if (advPrepW) spaParts.push(parseTranslation(advPrepW.translation)[0].toLowerCase()); // PREPOSICIÓN

      if (advObjId === 'NU_ARTICLE') spaParts.push(nounW ? getSpanishArticle(nounW.translation, advPlural) : "[el/la/los/las]");
      else if (advObjId === 'BI_ARTICLE') spaParts.push(nounW ? getSpanishIndefiniteArticle(nounW.translation, advPlural) : "[un/una/unos/unas]");
      else if (posW && nounW) {
          const pParts = parseTranslation(posW.translation);
          const pWord = advPlural && pParts.length > 1 ? pParts[1] : pParts[0];
          spaParts.push(pWord.toLowerCase());
      }
      else if (demW && nounW) {
          const dParts = parseTranslation(demW.translation);
          const dWord = advPlural && dParts.length > 1 ? dParts[1] : dParts[0];
          spaParts.push(dWord.toLowerCase());
      }

      if (nounW) spaParts.push(advPlural ? pluralizeSpanish(nounW.translation) : nounW.translation.toLowerCase());
      if (adjW) {
          const adjSpa = advPlural && nounW ? pluralizeSpanish(parseTranslation(adjW.translation)[0]) : parseTranslation(adjW.translation)[0];
          spaParts.push(adjSpa.toLowerCase());
      }
      
      if (qW || advQuestionId !== 'none') {
         let baseText = spaParts.join(" ");
         let mainQ = '';
         if (qW && qW.systemTag !== 'system_interrogativo_base') {
             mainQ = parseTranslation(qW.translation)[0] || qW.term;
         }
         const prefix = mainQ ? `¿${mainQ} ` : '¿';
         spanishTranslation = `${prefix}${baseText}?`.replace("  ", " ");
      } else {
         spanishTranslation = spaParts.join(" ");
      }
    }

    if (esniglishElements.length === 0) {
        esniglishElements = [<span key="empty" className="text-slate-600 italic text-xl md:text-2xl font-medium">Selecciona elementos para armar tu estructura</span>];
    }

    const containerClasses = isFullscreen 
      ? "w-full h-screen bg-slate-900 overflow-y-auto flex items-center justify-center p-4 md:p-8" 
      : "max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500";

    const contentClasses = isFullscreen
      ? "w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative"
      : "";

    return (
      <div ref={containerRef} className={containerClasses}>
        <div className={contentClasses}>
          
          {isFullscreen && (
            <button 
              onClick={toggleFullscreen} 
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors z-50"
              title="Salir de pantalla completa (Esc)"
            >
              <X size={24} />
            </button>
          )}

          {!isFullscreen && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Estudio y Práctica</h2>
              <p className="text-slate-500 mt-2 text-sm">Configura la gramática y genera estructuras dinámicas paso a paso.</p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className={`bg-slate-100 p-1 rounded-lg inline-flex shadow-sm border border-slate-200 flex-wrap justify-center gap-1 ${isFullscreen ? 'scale-110' : ''}`}>
              <button onClick={() => handleTabChange('verbos')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all ${pracMode === 'verbos' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
                Conjugación
              </button>
              <button onClick={() => handleTabChange('objetos')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'objetos' ? 'bg-white text-rose-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
                <RefreshCw size={14} className={pracMode === 'objetos' ? 'text-rose-500' : ''}/> Objetos
              </button>
              <button onClick={() => handleTabChange('posesivos')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'posesivos' ? 'bg-white text-amber-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
                <Zap size={14} className={pracMode === 'posesivos' ? 'text-amber-500' : ''}/> Posesivos
              </button>
              <button onClick={() => handleTabChange('adjetivos')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'adjetivos' ? 'bg-white text-yellow-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
                <Palette size={14} className={pracMode === 'adjetivos' ? 'text-yellow-500' : ''}/> Adjetivos
              </button>
              <button onClick={() => handleTabChange('preguntas')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'preguntas' ? 'bg-white text-fuchsia-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
                <HelpCircle size={14} className={pracMode === 'preguntas' ? 'text-fuchsia-500' : ''}/> Preguntas
              </button>
              <button onClick={() => handleTabChange('oraciones')} className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center gap-1.5 ${pracMode === 'oraciones' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                <Network size={14} /> Oraciones
              </button>
            </div>
          </div>

          {(verbWords.length === 0 || pronounWords.length === 0) ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
              <Info size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Información Insuficiente</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Registra las partículas de tiempo, verbos y pronombres en el diccionario para habilitar la práctica.
              </p>
              <button onClick={() => { setActiveTab('dictionary'); openModal(); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm">
                Ir al Diccionario
              </button>
            </div>
          ) : (
            <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 ${isFullscreen ? 'border-0 shadow-none' : ''}`}>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="text-blue-600" size={20} />
                  <h3 className="text-lg font-bold text-slate-800">Constructor Dinámico</h3>
                </div>
                {!isFullscreen && (
                  <button 
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                  >
                    <Maximize2 size={14} /> Modo Enfoque
                  </button>
                )}
              </div>

              {/* INTERFAZ MODOS SIMPLES */}
              {pracMode !== 'oraciones' && (
                <div className={`grid grid-cols-1 gap-5 mb-8 ${pracMode === 'verbos' || pracMode === 'preguntas' || pracMode === 'objetos' ? 'sm:grid-cols-2 lg:grid-cols-5' : pracMode === 'adjetivos' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
                  
                  {/* MODO VERBOS */}
                  {pracMode === 'verbos' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Sujeto</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracPronounId} onChange={(e) => setPracPronounId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Polaridad</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracIsNegative ? 'negativo' : 'afirmativo'} onChange={(e) => setPracIsNegative(e.target.value === 'negativo')}>
                          <option value="afirmativo">Afirmativo</option>
                          <option value="negativo">Negativo ({sys.negative})</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Tiempo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracTiempo} onChange={(e) => setPracTiempo(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider flex justify-between">
                          <span>4. Aspecto</span>
                          {isPracGaVerb && <span className="text-rose-500 text-[8px] italic flex items-center gap-0.5"><Lock size={8}/> Bloqueado</span>}
                        </label>
                        <select 
                          className={`w-full p-2.5 rounded-lg border outline-none font-medium text-sm transition-all ${isPracGaVerb ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-50 border-orange-200 focus:ring-2 focus:ring-orange-500 text-orange-800'}`} 
                          value={activePracGerundio ? 'continua' : 'simple'} 
                          onChange={(e) => setPracGerundio(e.target.value === 'continua')}
                          disabled={isPracGaVerb}
                        >
                          <option value="simple">Simple</option>
                          <option value="continua">Continua ({sys.gerundio})</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">5. Verbo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracVerbId} onChange={(e) => setPracVerbId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {/* MODO PREGUNTAS */}
                  {pracMode === 'preguntas' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-fuchsia-600 uppercase tracking-wider">1. Interrogativo</label>
                        <select className="w-full p-2.5 rounded-lg bg-fuchsia-50 border border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-500 outline-none font-medium text-fuchsia-800 transition-all text-sm" value={localIntId} onChange={(e) => setLocalIntId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {interrogativeWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0] || '?'})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Sujeto</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracPronounId} onChange={(e) => setPracPronounId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Tiempo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracTiempo} onChange={(e) => setPracTiempo(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider flex justify-between">
                          <span>4. Aspecto</span>
                          {isPracGaVerb && <span className="text-rose-500 text-[8px] italic flex items-center gap-0.5"><Lock size={8}/> Bloqueado</span>}
                        </label>
                        <select 
                          className={`w-full p-2.5 rounded-lg border outline-none font-medium text-sm transition-all ${isPracGaVerb ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-50 border-orange-200 focus:ring-2 focus:ring-orange-500 text-orange-800'}`} 
                          value={activePracGerundio ? 'continua' : 'simple'} 
                          onChange={(e) => setPracGerundio(e.target.value === 'continua')}
                          disabled={isPracGaVerb}
                        >
                          <option value="simple">Simple</option>
                          <option value="continua">Continua ({sys.gerundio})</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">5. Verbo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracVerbId} onChange={(e) => setPracVerbId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {/* MODO ADJETIVOS */}
                  {pracMode === 'adjetivos' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Artículo / Posesivo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none font-medium text-slate-800 transition-all text-sm" value={advObjId} onChange={(e) => setAdvObjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          <option value="NU_ARTICLE">{sys.defArticle} (El/La/Los/Las)</option>
                          <option value="BI_ARTICLE">{sys.indefArticle} (Un/Una/Unos/Unas)</option>
                          <optgroup label="Demostrativos">
                             {demonstrativeWords.map(d => <option key={d.id} value={d.id}>{d.term}</option>)}
                          </optgroup>
                          <optgroup label="Posesivos">
                             {possessiveWords.map(p => <option key={p.id} value={p.id}>{p.term}</option>)}
                          </optgroup>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-yellow-600 uppercase tracking-wider">2. Adjetivo</label>
                        <select className="w-full p-2.5 rounded-lg bg-yellow-50 border border-yellow-200 focus:ring-2 focus:ring-yellow-500 outline-none font-medium text-yellow-800 transition-all text-sm" value={advAdjId} onChange={(e) => setAdvAdjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {adjectiveWords.map(a => <option key={a.id} value={a.id}>{a.term} ({parseTranslation(a.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Sustantivo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracNounId} onChange={(e) => setPracNounId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {nounWords.map(n => <option key={n.id} value={n.id}>{n.term} ({n.translation})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">4. Cantidad</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 transition-all text-sm" value={isPluralNoun ? 'plural' : 'singular'} onChange={(e) => setIsPluralNoun(e.target.value === 'plural')}>
                          <option value="singular">Singular</option>
                          <option value="plural">Plural (+ {sys.plural})</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* MODO POSESIVOS */}
                  {pracMode === 'posesivos' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Posesivo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none font-medium text-slate-800 transition-all text-sm" value={localPosId} onChange={(e) => setLocalPosId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {possessiveWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Sustantivo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracNounId} onChange={(e) => setPracNounId(e.target.value)}>
                          <option value="none">- Omitir (Solo Posesivo) -</option>
                          {nounWords.map(n => <option key={n.id} value={n.id}>{n.term} ({n.translation})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">3. Cantidad (N)</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-800 transition-all text-sm" value={isPluralNoun ? 'plural' : 'singular'} onChange={(e) => setIsPluralNoun(e.target.value === 'plural')}>
                          <option value="singular">Singular</option>
                          <option value="plural">Plural (+ {sys.plural})</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* MODO OBJETOS */}
                  {pracMode === 'objetos' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">1. Sujeto</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracObjSubjId} onChange={(e) => setPracObjSubjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {pronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2. Tiempo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracTiempo} onChange={(e) => setPracTiempo(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {TIEMPOS.map(t => <option key={t} value={t}>{t} ({getTimeMarker(t)})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider flex justify-between">
                          <span>3. Aspecto</span>
                          {isPracGaVerb && <span className="text-rose-500 text-[8px] italic flex items-center gap-0.5"><Lock size={8}/> Bloqueado</span>}
                        </label>
                        <select 
                          className={`w-full p-2.5 rounded-lg border outline-none font-medium text-sm transition-all ${isPracGaVerb ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-50 border-orange-200 focus:ring-2 focus:ring-orange-500 text-orange-800'}`} 
                          value={activePracGerundio ? 'continua' : 'simple'} 
                          onChange={(e) => setPracGerundio(e.target.value === 'continua')}
                          disabled={isPracGaVerb}
                        >
                          <option value="simple">Simple</option>
                          <option value="continua">Continua ({sys.gerundio})</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">4. Verbo</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 transition-all text-sm" value={pracVerbId} onChange={(e) => setPracVerbId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">5. Objeto</label>
                        <select className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-slate-800 transition-all text-sm" value={localObjId} onChange={(e) => setLocalObjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {objectPronounWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* INTERFAZ MODO ORACIONES COMPLEJAS */}
              {pracMode === 'oraciones' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">Núcleo de Acción</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-fuchsia-600 uppercase">¿Es Pregunta? (Partícula Inicial)</label>
                      <select className="w-full p-2 rounded-lg bg-fuchsia-50 border border-fuchsia-200 outline-none font-bold text-fuchsia-700 text-xs" value={advQuestionId} onChange={(e) => setAdvQuestionId(e.target.value)}>
                        <option value="none">- Afirmación (No) -</option>
                        {questionWords?.map(q => <option key={q.id} value={q.id}>{q.term} ({parseTranslation(q.translation)[0] || '?'})</option>)}
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
                          <option value="negativo">No ({sys.negative})</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Tiempo</label>
                        <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-slate-600 text-xs" value={advTime} onChange={(e) => setAdvTime(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-orange-600 uppercase flex justify-between">
                          <span>Aspecto</span>
                          {isAdvGaVerb && <Lock size={12} className="text-rose-500" title="Estar no admite gerundio"/>}
                        </label>
                        <select 
                          className={`w-full p-2 rounded-lg border outline-none font-medium text-xs ${isAdvGaVerb ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-50 border-orange-200 text-orange-800'}`} 
                          value={activeAdvGerundio ? 'continua' : 'simple'} 
                          onChange={(e) => setAdvGerundio(e.target.value === 'continua')}
                          disabled={isAdvGaVerb}
                        >
                          <option value="simple">Simple</option>
                          <option value="continua">Continua</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Verbo</label>
                        <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-bold text-slate-800 text-xs" value={advVerbId} onChange={(e) => setAdvVerbId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {verbWords.map(v => <option key={v.id} value={v.id}>{v.term}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">Complemento</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-teal-600 uppercase">Preposición</label>
                        <select className="w-full p-2 rounded-lg bg-teal-50 border border-teal-200 outline-none font-medium text-teal-800 text-xs" value={advPrepId} onChange={(e) => setAdvPrepId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {prepositionWords.map(p => <option key={p.id} value={p.id}>{p.term} ({parseTranslation(p.translation)[0]})</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Modificador / Objeto</label>
                        <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-amber-600 text-xs" value={advObjId} onChange={(e) => setAdvObjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          <option value="NU_ARTICLE">{sys.defArticle} (El/La/Los/Las)</option>
                          <option value="BI_ARTICLE">{sys.indefArticle} (Un/Una/Unos/Unas)</option>
                          <optgroup label="Demostrativos">
                             {demonstrativeWords.map(d => <option key={d.id} value={d.id}>{d.term}</option>)}
                          </optgroup>
                          <optgroup label="Posesivos (Requiere Sustantivo)">
                             {possessiveWords.map(p => <option key={p.id} value={p.id}>{p.term}</option>)}
                          </optgroup>
                          <optgroup label="Objetos (Si NO hay Sustantivo)">
                             {objectPronounWords.map(p => <option key={p.id} value={p.id}>{p.term}</option>)}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 col-span-3 sm:col-span-1">
                        <label className="text-[10px] font-semibold text-yellow-600 uppercase">Adjetivo</label>
                        <select className="w-full p-2 rounded-lg bg-yellow-50 border border-yellow-200 outline-none font-medium text-yellow-800 text-xs" value={advAdjId} onChange={(e) => setAdvAdjId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {adjectiveWords.map(a => <option key={a.id} value={a.id}>{a.term}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Sustantivo</label>
                        <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-bold text-emerald-600 text-xs" value={advNounId} onChange={(e) => setAdvNounId(e.target.value)}>
                          <option value="none">- Omitir -</option>
                          {nounWords.map(n => <option key={n.id} value={n.id}>{n.term}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">Cantidad</label>
                        <select className="w-full p-2 rounded-lg bg-white border border-slate-200 outline-none font-medium text-slate-600 text-xs" value={advPlural ? 'plural' : 'singular'} onChange={(e) => setAdvPlural(e.target.value === 'plural')} disabled={advNounId === 'none'}>
                          <option value="singular">1</option>
                          <option value="plural">+ {sys.plural}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL DE RESULTADO PROFESIONAL */}
              <div className={`rounded-2xl p-8 md:p-10 text-center relative overflow-hidden border shadow-inner transition-colors duration-500 ${pracMode === 'oraciones' ? 'bg-slate-950 border-indigo-900/50' : 'bg-slate-900 border-slate-800'} ${isFullscreen ? 'min-h-[250px] flex flex-col justify-center' : ''}`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none 
                  ${pracMode === 'posesivos' ? (isPluralNoun ? 'bg-amber-500' : 'bg-emerald-500') : 
                    pracMode === 'objetos' ? 'bg-rose-500' : 
                    pracMode === 'adjetivos' ? 'bg-yellow-500' :
                    pracMode === 'preguntas' ? 'bg-fuchsia-500' :
                    pracMode === 'oraciones' ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
                
                <p className="text-slate-400 font-semibold tracking-wider text-[10px] uppercase mb-4 relative z-10">Output Generado</p>
                
                <div className="relative z-10">
                  <div className={`font-extrabold mb-6 tracking-tight flex items-center justify-center gap-3 flex-wrap ${isFullscreen ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'}`}>
                    {esniglishElements}
                  </div>
                  
                  {spanishTranslation && (
                    <div className="inline-flex flex-col bg-slate-800/50 px-5 py-4 rounded-xl border border-slate-700/50 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-3">
                        <Languages className="text-slate-400" size={18} />
                        <span className={`text-white font-medium capitalize ${isFullscreen ? 'text-xl' : 'text-base'}`}>{spanishTranslation}</span>
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
      </div>
    );
}