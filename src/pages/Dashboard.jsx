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
  { key: "sincronizando", label: "Sincronizando / Inativo" },
];

export default function Dashboard({ onSelectLoja }) {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const fetcher = useCallback(fetchStatus, []);
  const { data, loading, error, lastUpdated, countdown, refresh } =
    useAutoRefresh(fetcher, 30_000);

  const lojas = data?.lojas ?? [];

  const filtered = lojas.filter((l) => {
    // Filtro de status — "sincronizando" inclui "inativo"
    const matchFilter =
      filter === "todos" ||
      l.status === filter ||
      (filter === "sincronizando" && l.status === "inativo");

    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.grupo_loja?.toLowerCase().includes(q) ||
      l.nome_fantasia?.toLowerCase().includes(q) ||
      (l.lojas || []).some(loja =>
        (typeof loja === "string" ? loja : loja.nome || "").toLowerCase().includes(q)
      );

    return matchFilter && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      <StatsBar lojas={lojas} />

      {/* Barra de pesquisa */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar por grupo ou nome da loja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Filtros + Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                filter === opt.key
                  ? "bg-brand-600/30 border-brand-500/50 text-brand-300"
                  : "border-surface-border text-slate-500 hover:text-slate-400"
              }`}
            >
              {opt.label}
              {opt.key === "sincronizando" && (
                <span className="ml-1.5 opacity-60">
                  ({lojas.filter((l) => l.status === "sincronizando" || l.status === "inativo").length})
                </span>
              )}
              {opt.key !== "todos" && opt.key !== "sincronizando" && (
                <span className="ml-1.5 opacity-60">
                  ({lojas.filter((l) => l.status === opt.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <RefreshBar countdown={countdown} lastUpdated={lastUpdated} onRefresh={refresh} loading={loading && !!data} />
      </div>

      {/* Resultado da pesquisa */}
      {search && (
        <p className="text-xs text-slate-500">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "{search}"
        </p>
      )}

      {/* Cards */}
      {error && !data ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : loading && !data ? (
        <LoadingGrid count={6} />
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p className="text-4xl mb-3">🔍</p>
          <p>{search ? `Nenhuma loja encontrada para "${search}"` : "Nenhuma loja encontrada."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((loja) => (
            <StoreCard key={loja.grupo_loja} loja={loja} onDetails={onSelectLoja} />
          ))}
        </div>
      )}

      {error && data && (
        <div className="card border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
          ⚠️ Falha ao atualizar: {error}
        </div>
      )}
    </div>
  );
}