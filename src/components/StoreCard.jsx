import StatusBadge from "./StatusBadge";

const STATUS_GLOW = {
  ok:            "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
  erro:          "hover:border-red-500/40 hover:shadow-red-500/10",
  sincronizando: "hover:border-amber-500/40 hover:shadow-amber-500/10",
  desconhecido:  "hover:border-slate-500/40 hover:shadow-slate-500/10",
};

const STATUS_ICON = {
  ok:            "✓",
  erro:          "✕",
  sincronizando: "↻",
  desconhecido:  "?",
};

const STATUS_ICON_COLOR = {
  ok:            "text-emerald-400 bg-emerald-400/10",
  erro:          "text-red-400 bg-red-400/10",
  sincronizando: "text-amber-400 bg-amber-400/10",
  desconhecido:  "text-slate-400 bg-slate-400/10",
};

const LOJA_DOT = {
  ok:            "bg-emerald-400",
  erro:          "bg-red-400",
  sincronizando: "bg-amber-400",
  desconhecido:  "bg-slate-600",
};

const LOJA_TEXT = {
  ok:            "text-slate-300",
  erro:          "text-red-300",
  sincronizando: "text-amber-300",
  desconhecido:  "text-slate-500",
};

function formatDate(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function StoreCard({ loja, onDetails }) {
  const glow   = STATUS_GLOW[loja.status]   || STATUS_GLOW.desconhecido;
  const icon   = STATUS_ICON[loja.status]   || "?";
  const iconCl = STATUS_ICON_COLOR[loja.status] || STATUS_ICON_COLOR.desconhecido;

  // Suporta tanto array de objetos {nome, status} quanto array de strings (retrocompatibilidade)
  const lojas = (loja.lojas || []).map((l) =>
    typeof l === "string" ? { nome: l, status: "desconhecido" } : l
  );

  const totalErros = lojas.filter((l) => l.status === "erro").length;
  const totalSync  = lojas.filter((l) => l.status === "sincronizando").length;

  return (
    <div className={`card p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl ${glow} animate-slide-up`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${iconCl}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-white truncate leading-tight">
              {loja.grupo_loja}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-slate-500">
                {lojas.length} {lojas.length === 1 ? "loja" : "lojas"}
              </p>
              {totalErros > 0 && (
                <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-1.5 py-0.5">
                  {totalErros} erro{totalErros > 1 ? "s" : ""}
                </span>
              )}
              {totalSync > 0 && (
                <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-1.5 py-0.5">
                  {totalSync} sincronizando
                </span>
              )}
            </div>
          </div>
        </div>
        <StatusBadge status={loja.status} />
      </div>

      {/* Lista de lojas com status individual */}
      <div className="bg-surface rounded-xl border border-surface-border p-3 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-medium">
          Lojas do grupo
        </p>
        {lojas.map((l, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Dot com animação se sincronizando */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                {l.status === "sincronizando" && (
                  <span className={`absolute inline-flex h-full w-full rounded-full ${LOJA_DOT[l.status]} opacity-75 ping-slow`} />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${LOJA_DOT[l.status] || "bg-slate-600"}`} />
              </span>
              <span className={`text-xs truncate ${LOJA_TEXT[l.status] || "text-slate-500"}`}>
                {l.nome}
              </span>
            </div>
            {/* Label de status só para erro */}
            {l.status === "erro" && (
              <span className="text-[10px] text-red-400 flex-shrink-0">erro</span>
            )}
          </div>
        ))}
      </div>

      {/* Último evento */}
      <div className="bg-surface rounded-xl p-3 border border-surface-border">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-medium">
          Último evento
        </p>
        <p className="text-sm text-slate-300 font-mono leading-snug">{loja.mensagem || "—"}</p>
      </div>

      {/* Erro */}
      {loja.erro && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1 font-medium">
            Erro detectado
          </p>
          <p className="text-xs text-red-300 font-mono">{loja.erro}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Última atualização</p>
          <p className="text-xs text-slate-400 font-mono">{formatDate(loja.ultima_atualizacao)}</p>
        </div>
        <button
          onClick={() => onDetails(loja)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600/20 text-brand-400 border border-brand-600/30 hover:bg-brand-600/40 hover:text-brand-300 transition-all duration-200"
        >
          Detalhes →
        </button>
      </div>
    </div>
  );
}