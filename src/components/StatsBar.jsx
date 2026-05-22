// src/components/StatsBar.jsx

function StatItem({ label, value, color = "text-white" }) {
  return (
    <div className="card px-5 py-4 flex flex-col gap-1">
      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-2xl font-display font-bold ${color}`}>{value ?? "—"}</p>
    </div>
  );
}

export default function StatsBar({ lojas = [], stats = {} }) {
  const total    = lojas.length;
  const ok       = lojas.filter((l) => l.status === "ok").length;
  const erros    = lojas.filter((l) => l.status === "erro").length;
  const sync     = lojas.filter((l) => l.status === "sincronizando").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatItem label="Total de Lojas" value={total} />
      <StatItem label="Online"          value={ok}    color="text-emerald-400" />
      <StatItem label="Com Erro"        value={erros} color="text-red-400" />
      <StatItem label="Sincronizando"   value={sync}  color="text-amber-400" />
    </div>
  );
}
