import React, { useState, useEffect, useMemo } from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Dictionary from './components/Dictionary';
import Grammar from './components/Grammar';
import Practice from './components/Practice';
import Suggestions from './components/Suggestions';

import { X, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "espanglish-bfa04.firebaseapp.com",
  projectId: "espanglish-bfa04",
  storageBucket: "espanglish-bfa04.firebasestorage.app",
  messagingSenderId: "894267905356",
  appId: "1:894267905356:web:c05e64c9773249ef27ebe9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "espanglish-web-local";

export default function App() {
  const [user, setUser] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [words, setWords] = useState([]);
  const [grammarRules, setGrammarRules] = useState([]);
  const [suggestionsList, setSuggestionsList] = useState([]); 
  
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [syncStatus, setSyncStatus] = useState('syncing');
  
  const categories = [
    'Pronombre Personal', 
    'Pronombre de Objeto', 
    'Pronombre Interrogativo',
    'Relativo', 
    'Verbo', 
    'Sustantivo', 
    'Adjetivo', 
    'Adverbio', 
    'Preposición', 
    'Posesivo', 
    'Demostrativo', 
    'Artículo', 
    'Partícula'
  ];

  // ETIQUETAS LIMPIAS Y CON GERUNDIO Y KI AÑADIDOS
  const systemTagsList = [
    { value: '', label: '-- Ninguno (Palabra normal) --' },
    { value: 'system_interrogativo_base', label: 'Marcador: Pregunta Sí/No (Base)' },
    { value: 'system_presente', label: 'Marcador: Presente' },
    { value: 'system_pasado', label: 'Marcador: Pasado' },
    { value: 'system_futuro', label: 'Marcador: Futuro' },
    { value: 'system_gerundio', label: 'Marcador: Gerundio (Estar/Ando/Iendo)' },
    { value: 'system_condicional', label: 'Marcador: Condicional (-ría)' },
    { value: 'system_imperfecto', label: 'Marcador: Imperfecto (-aba)' },
    { value: 'system_plural', label: 'Marcador: Plural' },
    { value: 'system_negativo', label: 'Marcador: Negación' },
    { value: 'system_art_def', label: 'Artículo: Definido' },
    { value: 'system_art_indef', label: 'Artículo: Indefinido' }
  ];

  const [formData, setFormData] = useState({ term: '', translation: '', category: 'Sustantivo', example: '', systemTag: '' });

  // ESTADOS INICIALES LIMPIOS 
  const [pracMode, setPracMode] = useState('oraciones');
  const [pracPronounId, setPracPronounId] = useState('none');
  const [pracVerbId, setPracVerbId] = useState('none');
  const [pracNounId, setPracNounId] = useState('none');
  const [pracTiempo, setPracTiempo] = useState('none');
  const [pracGerundio, setPracGerundio] = useState(false); // NUEVO ESTADO PARA GERUNDIO
  const [isPluralNoun, setIsPluralNoun] = useState(false);
  const [pracIsNegative, setPracIsNegative] = useState(false);
  const [pracObjSubjId, setPracObjSubjId] = useState('none'); 
  const [pracObjPronounId, setPracObjPronounId] = useState('none');

  const [advSubjId, setAdvSubjId] = useState('none');
  const [advNeg, setAdvNeg] = useState(false);
  const [advTime, setAdvTime] = useState('none');
  const [advGerundio, setAdvGerundio] = useState(false); // NUEVO ESTADO PARA GERUNDIO EN ORACIONES
  const [advVerbId, setAdvVerbId] = useState('none');
  const [advObjId, setAdvObjId] = useState('none');
  const [advNounId, setAdvNounId] = useState('none');
  const [advPlural, setAdvPlural] = useState(false);

  const ADMIN_UID = "Y4p71TJsnZOGvfJaAyqPklpScav2";
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setSyncStatus(currentUser ? 'synced' : 'connected');
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowAdminPanel(false); 
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const logout = () => {
    signOut(auth);
    setShowAdminPanel(false);
  };

  useEffect(() => {
    const dictRef = collection(db, 'projects', appId, 'dictionary');
    const unsubDict = onSnapshot(dictRef, (snapshot) => {
      setWords(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setSyncStatus('synced');
    }, () => setSyncStatus('error'));

    const gramRef = collection(db, 'projects', appId, 'grammar');
    const unsubGram = onSnapshot(gramRef, (snapshot) => {
      setGrammarRules(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubDict(); unsubGram(); };
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setSuggestionsList([]);
      return;
    }
    const sugRef = collection(db, 'projects', appId, 'suggestions');
    const unsubSug = onSnapshot(sugRef, (snapshot) => {
      setSuggestionsList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubSug();
  }, [isAdmin]);

  const verbWords = useMemo(() => words.filter(w => w.category === 'Verbo'), [words]);
  const pronounWords = useMemo(() => words.filter(w => w.category === 'Pronombre Personal'), [words]);
  const nounWords = useMemo(() => words.filter(w => w.category === 'Sustantivo'), [words]);

  const handleSaveWord = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert("Solo el administrador puede hacer esto.");
    setSyncStatus('syncing');
    try {
      if (editingWord) {
        await updateDoc(doc(db, 'projects', appId, 'dictionary', editingWord.id), formData);
      } else {
        await addDoc(collection(db, 'projects', appId, 'dictionary'), { ...formData, createdAt: new Date().toISOString() });
      }
      closeModal();
    } catch (err) { setSyncStatus('error'); }
  };

  const deleteWord = async (id) => {
    if (!isAdmin) return alert("Solo el administrador puede hacer esto.");
    if (confirm('¿Seguro que quieres eliminar este término?')) {
      try { await deleteDoc(doc(db, 'projects', appId, 'dictionary', id)); } 
      catch (err) { setSyncStatus('error'); }
    }
  };

  const handleSubmitSuggestion = async (suggestionData) => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      await addDoc(collection(db, 'projects', appId, 'suggestions'), { 
        ...suggestionData, 
        userEmail: user.email, 
        uid: user.uid, 
        createdAt: new Date().toISOString() 
      });
      setSyncStatus('synced');
    } catch (err) { 
      console.error(err);
      setSyncStatus('error'); 
    }
  };

  const approveSuggestion = async (sug) => {
    if (!isAdmin) return;
    setSyncStatus('syncing');
    try {
      await addDoc(collection(db, 'projects', appId, 'dictionary'), {
        term: sug.term,
        translation: sug.translation,
        category: sug.category,
        example: `Etimología: ${sug.reason}`,
        createdAt: new Date().toISOString()
      });
      await deleteDoc(doc(db, 'projects', appId, 'suggestions', sug.id));
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const rejectSuggestion = async (id) => {
    if (!isAdmin) return;
    if (confirm('¿Incinerar esta sugerencia para siempre?')) {
      setSyncStatus('syncing');
      try {
        await deleteDoc(doc(db, 'projects', appId, 'suggestions', id));
        setSyncStatus('synced');
      } catch (err) { setSyncStatus('error'); }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ words, grammarRules }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `esniglish_backup.json`);
    link.click();
  };

  const openModal = (word = null) => {
    if (word) {
      setEditingWord(word);
      setFormData({ term: word.term, translation: word.translation || '', category: word.category, example: word.example || '', systemTag: word.systemTag || '' });
    } else {
      setEditingWord(null);
      setFormData({ term: '', translation: '', category: 'Sustantivo', example: '', systemTag: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWord(null);
  };

  const filteredWords = useMemo(() => {
    return words.filter(w => 
      w.term?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.translation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.term.localeCompare(b.term));
  }, [words, searchQuery]);

  const groupedWords = useMemo(() => {
    const groups = {};
    categories.forEach(cat => { groups[cat] = []; });
    filteredWords.forEach(word => {
      if (groups[word.category]) groups[word.category].push(word);
      else {
        if (!groups['Otro']) groups['Otro'] = [];
        groups['Otro'].push(word);
      }
    });
    return groups;
  }, [filteredWords, categories]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        syncStatus={syncStatus} 
        setShowAdminPanel={setShowAdminPanel} 
        isAdmin={isAdmin}
      />

      {showAdminPanel && (
        <div className="max-w-6xl mx-auto px-6 pt-4 space-y-4 animate-in slide-in-from-top-4 mb-4">
          <div className="bg-slate-800 text-white p-3 rounded-xl flex items-center justify-between shadow-md border border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-300">Acceso Restringido:</span>
              {!user ? (
                <button onClick={login} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
                  Identificarse (Google)
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-sm font-bold">Autorizado</span>
                  <code className="bg-slate-950 text-amber-400 px-2 py-1 rounded text-xs select-all border border-slate-700 hidden md:block">{user.uid}</code>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
               {user && isAdmin && (
                  <button onClick={exportData} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors border border-emerald-500/30">
                    <Download size={14} /> Respaldar BD
                  </button>
               )}
               {user && (
                  <button onClick={logout} className="text-rose-400 hover:text-rose-300 text-xs font-bold px-3 py-1 bg-rose-400/10 rounded-lg transition-colors border border-rose-400/20">
                    Desconectar
                  </button>
               )}
               <button onClick={() => setShowAdminPanel(false)} className="p-1 text-slate-400 hover:text-white rounded-md transition-colors">
                  <X size={16}/>
               </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 md:p-8">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}

        {activeTab === 'practice' && (
          <Practice 
            verbWords={verbWords} pronounWords={pronounWords} nounWords={nounWords}
            pracMode={pracMode} setPracMode={setPracMode}
            pracPronounId={pracPronounId} setPracPronounId={setPracPronounId}
            pracVerbId={pracVerbId} setPracVerbId={setPracVerbId}
            pracNounId={pracNounId} setPracNounId={setPracNounId}
            pracTiempo={pracTiempo} setPracTiempo={setPracTiempo}
            pracGerundio={pracGerundio} setPracGerundio={setPracGerundio}
            isPluralNoun={isPluralNoun} setIsPluralNoun={setIsPluralNoun}
            pracIsNegative={pracIsNegative} setPracIsNegative={setPracIsNegative}
            pracObjSubjId={pracObjSubjId} setPracObjSubjId={setPracObjSubjId}
            advSubjId={advSubjId} setAdvSubjId={setAdvSubjId}
            advNeg={advNeg} setAdvNeg={setAdvNeg}
            advTime={advTime} setAdvTime={setAdvTime}
            advGerundio={advGerundio} setAdvGerundio={setAdvGerundio}
            advVerbId={advVerbId} setAdvVerbId={setAdvVerbId}
            advObjId={advObjId} setAdvObjId={setAdvObjId}
            advNounId={advNounId} setAdvNounId={setAdvNounId}
            advPlural={advPlural} setAdvPlural={setAdvPlural}
            setActiveTab={setActiveTab} openModal={openModal}
            words={words}
          />
        )}

        {activeTab === 'dictionary' && (
          <Dictionary 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModal={openModal}
            categories={categories}
            groupedWords={groupedWords}
            deleteWord={deleteWord}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'grammar' && <Grammar />}

        {activeTab === 'suggestions' && (
          <Suggestions 
            user={user} 
            login={login} 
            submitSuggestion={handleSubmitSuggestion} 
            categories={categories} 
            isAdmin={isAdmin}
            suggestionsList={suggestionsList}
            approveSuggestion={approveSuggestion}
            rejectSuggestion={rejectSuggestion}
          />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-lg text-slate-900">{editingWord ? 'Editar Término' : 'Nuevo Término'}</h2>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveWord} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Término en Esniglish</label>
                <input required className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all" value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}/>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Significado en Español (Opcional para partículas)</label>
                <input className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all" value={formData.translation} onChange={e => setFormData({...formData, translation: e.target.value})}/>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Categoría</label>
                <select className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Rol de Sistema (Solo Admin)
                </label>
                <p className="text-[10px] text-slate-500 mb-2 leading-tight">Usa esto solo si la palabra es una partícula estructural o artículo para que el generador la encuentre automáticamente.</p>
                <select className="w-full p-2 rounded-md border border-indigo-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none font-medium text-indigo-900 text-sm transition-all" value={formData.systemTag} onChange={e => setFormData({...formData, systemTag: e.target.value})}>
                  {systemTagsList.map(tag => <option key={tag.value} value={tag.value}>{tag.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Contexto / Ejemplo (Opcional)</label>
                <textarea className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all resize-none" rows="2" value={formData.example} onChange={e => setFormData({...formData, example: e.target.value})}></textarea>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-all active:scale-95 text-sm">
                  {editingWord ? 'Actualizar' : 'Guardar Término'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}