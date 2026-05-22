// src/components/RefreshBar.jsx

export default function RefreshBar({ countdown, lastUpdated, onRefresh, loading }) {
  const pct = Math.max(0, Math.min(100, (countdown / 30) * 100));

  return (
    <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-3 flex-1">
        {/* Progress bar */}
        <div className="flex-1 h-0.5 bg-surface-muted rounded-full overflow-hidden max-w-32">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span>
          {loading ? "Atualizando..." : `Próxima atualização em ${countdown}s`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="hidden sm:block">
            Atualizado{" "}
            {lastUpdated.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border hover:border-brand-600/50 hover:text-brand-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className={loading ? "animate-spin" : ""}>⟳</span>
          Atualizar
        </button>
      </div>
    </div>
  );
}
