import React, { useState } from 'react';
// IMPORTANTE: Añadimos el ícono 'Filter'
import { Search, Plus, FolderOpen, Edit2, Trash2, Filter } from 'lucide-react';

export default function Dictionary({ 
  searchQuery, 
  setSearchQuery, 
  openModal, 
  categories, 
  groupedWords, 
  deleteWord,
  isAdmin 
}) {
  // NUEVO: Estado para el filtro de categorías
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Lógica de filtrado: Si es 'Todas' mostramos todas, si no, solo la elegida.
  const categoriesToShow = selectedCategory === 'Todas' ? categories : [selectedCategory];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Buscador, Filtro y Botón Nuevo */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
        
        {/* 1. Buscador Libre */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar término o traducción..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        {/* 2. NUEVO BOTÓN DE FILTRO */}
        <div className="relative w-full md:w-56">
          <select
            className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-sm cursor-pointer transition-colors shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* 3. ESCUDO: Solo si eres Admin ves el botón */}
        {isAdmin && (
          <button onClick={() => openModal()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all text-sm shadow-sm">
            <Plus size={16} /> Nueva Palabra
          </button>
        )}
      </div>

      {/* Lista de Categorías y Palabras */}
      <div className="space-y-10">
        {/* Cambiamos categories.map por categoriesToShow.map */}
        {categoriesToShow.map(category => {
          const wordsInCategory = groupedWords[category];
          // Si no hay palabras en esta categoría, o si la búsqueda las ocultó todas, no renderizamos el bloque
          if (!wordsInCategory || wordsInCategory.length === 0) return null;

          return (
            <div key={category} className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <FolderOpen className="text-slate-400" size={18} />
                <h3 className="text-lg font-bold text-slate-800">
                  {category}{category.endsWith('a') || category.endsWith('o') || category.endsWith('e') ? 's' : 'es'}
                </h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md ml-2">{wordsInCategory.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wordsInCategory.map((word) => (
                  <div key={word.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {word.category}
                      </span>
                      {/* ESCUDO: Solo si eres Admin ves los botones de editar y borrar */}
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(word)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"><Edit2 size={14}/></button>
                          <button onClick={() => deleteWord(word.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-0.5">{word.term}</h4>
                    <p className="text-slate-600 text-sm font-medium mb-3">{word.translation}</p>
                    {word.example && <p className="text-xs text-slate-500 border-l-2 border-slate-200 pl-2 py-0.5 italic bg-slate-50/50">"{word.example}"</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}