// src/App.jsx
import { useState } from "react";
import Dashboard  from "./pages/Dashboard";
import LojaDetail from "./pages/LojaDetail";
import "./index.css";

export default function App() {
  const [selectedLoja, setSelectedLoja] = useState(null);

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => setSelectedLoja(null)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              C
            </div>
            <span className="font-display font-bold text-white text-sm">
              Monitor CDS
            </span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <button
              onClick={() => setSelectedLoja(null)}
              className={`hover:text-slate-300 transition-colors ${!selectedLoja ? "text-slate-300" : ""}`}
            >
              Dashboard
            </button>
            {selectedLoja && (
              <>
                <span>/</span>
                <span className="text-slate-300 truncate max-w-48">
                  {selectedLoja.nome_fantasia || `Loja ${selectedLoja.grupo_loja}`}
                </span>
              </>
            )}
          </div>

          {/* Status dot */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ping-slow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="hidden sm:block">Ao vivo</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          {selectedLoja ? null : (
            <>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
                Monitor de Lojas
              </h1>
              <p className="text-slate-500 text-sm">
                Status de sincronização em tempo real · atualiza a cada 30 segundos
              </p>
            </>
          )}
        </div>

        {selectedLoja ? (
          <LojaDetail
            loja={selectedLoja}
            onBack={() => setSelectedLoja(null)}
          />
        ) : (
          <Dashboard onSelectLoja={setSelectedLoja} />
        )}
      </main>
    </div>
  );
}