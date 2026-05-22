// src/components/StatusBadge.jsx

const STATUS_CONFIG = {
  ok: {
    label: "Online",
    dotClass: "bg-emerald-400",
    badgeClass: "badge-ok",
    pingClass: "bg-emerald-400",
  },
  erro: {
    label: "Erro",
    dotClass: "bg-red-400",
    badgeClass: "badge-erro",
    pingClass: "bg-red-400",
  },
  sincronizando: {
    label: "Sincronizando",
    dotClass: "bg-amber-400",
    badgeClass: "badge-sincronizando",
    pingClass: "bg-amber-400",
  },
  desconhecido: {
    label: "Desconhecido",
    dotClass: "bg-slate-400",
    badgeClass: "badge-desconhecido",
    pingClass: "bg-slate-400",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.desconhecido;

  return (
    <span className={cfg.badgeClass}>
      <span className="relative flex h-2 w-2">
        {status === "sincronizando" && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${cfg.pingClass} opacity-75 ping-slow`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dotClass}`} />
      </span>
      {cfg.label}
    </span>
  );
}
