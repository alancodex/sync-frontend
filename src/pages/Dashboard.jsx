// src/pages/Dashboard.jsx
import { useState, useCallback } from "react";
import { fetchStatus } from "../services/api";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import StoreCard    from "../components/StoreCard";
import StatsBar     from "../components/StatsBar";
import RefreshBar   from "../components/RefreshBar";
import LoadingGrid  from "../components/LoadingGrid";
import ErrorMessage from "../components/ErrorMessage";

const FILTER_OPTIONS = [
  { key: "todos",         label: "Todas" },
  { key: "ok",            label: "Online" },
  { key: "erro",          label: "Com Erro" },
  { key: "sincronizando", label: "Sincronizando" },
];

export default function Dashboard({ onSelectLoja }) {
  const [filter, setFilter] = useState("todos");

  const fetcher = useCallback(fetchStatus, []);
  const { data, loading, error, lastUpdated, countdown, refresh } =
    useAutoRefresh(fetcher, 30_000);

  const lojas = data?.lojas ?? [];
  const filtered =
    filter === "todos" ? lojas : lojas.filter((l) => l.status === filter);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Stats */}
      <StatsBar lojas={lojas} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                filter === opt.key
                  ? "bg-brand-600/30 border-brand-500/50 text-brand-300"
                  : "border-surface-border text-slate-500 hover:border-surface-muted hover:text-slate-400"
              }`}
            >
              {opt.label}
              {opt.key !== "todos" && (
                <span className="ml-1.5 opacity-60">
                  ({lojas.filter((l) => l.status === opt.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Refresh bar */}
        <RefreshBar
          countdown={countdown}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          loading={loading && !!data}
        />
      </div>

      {/* Content */}
      {error && !data ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : loading && !data ? (
        <LoadingGrid count={6} />
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p className="text-4xl mb-3">🏪</p>
          <p>Nenhuma loja encontrada para o filtro selecionado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((loja) => (
            <StoreCard
              key={loja.grupo_loja}
              loja={loja}
              onDetails={onSelectLoja}
            />
          ))}
        </div>
      )}

      {/* Error banner when refreshing fails */}
      {error && data && (
        <div className="card border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
          ⚠️ Falha ao atualizar: {error}
        </div>
      )}
    </div>
  );
}
