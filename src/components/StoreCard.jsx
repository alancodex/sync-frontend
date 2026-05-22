// src/components/StoreCard.jsx
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

function formatDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function StoreCard({ loja, onDetails }) {
  const glow   = STATUS_GLOW[loja.status]   || STATUS_GLOW.desconhecido;
  const icon   = STATUS_ICON[loja.status]   || "?";
  const iconCl = STATUS_ICON_COLOR[loja.status] || STATUS_ICON_COLOR.desconhecido;

  return (
    <div
      className={`card p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl ${glow} cursor-default animate-slide-up group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${iconCl} ${loja.status === "sincronizando" ? "animate-spin-slow" : ""}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-white truncate leading-tight">
              {loja.nome_fantasia || loja.empresa || `Loja ${loja.grupo_loja}`}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              Grupo #{loja.grupo_loja}
            </p>
          </div>
        </div>
        <StatusBadge status={loja.status} />
      </div>

      {/* Empresa */}
      {loja.empresa && loja.empresa !== loja.nome_fantasia && (
        <p className="text-xs text-slate-400 -mt-1 truncate border-l-2 border-surface-muted pl-2">
          {loja.empresa}
        </p>
      )}

      {/* Última mensagem */}
      <div className="bg-surface rounded-xl p-3 border border-surface-border">
        <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 font-medium">
          Último evento
        </p>
        <p className="text-sm text-slate-300 font-mono leading-snug line-clamp-2">
          {loja.mensagem || "—"}
        </p>
      </div>

      {/* Erro (se houver) */}
      {loja.erro && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <p className="text-[11px] text-red-400 uppercase tracking-wider mb-1 font-medium">
            Erro detectado
          </p>
          <p className="text-xs text-red-300 font-mono line-clamp-2">{loja.erro}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">
            Última atualização
          </p>
          <p className="text-xs text-slate-400 font-mono">
            {formatDate(loja.ultima_atualizacao)}
          </p>
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
