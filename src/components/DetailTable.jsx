import { useState, useMemo } from "react";

const PAGE_SIZE = 10;

function formatDate(dt) {
  if (!dt) return <span className="text-slate-600">—</span>;
  return (
    <span className="font-mono text-xs text-slate-400">
      {new Date(dt).toLocaleString("pt-BR")}
    </span>
  );
}

function MsgCell({ text, isError }) {
  if (!text) return <span className="text-slate-600">—</span>;
  return (
    <span className={`font-mono text-xs ${isError ? "text-red-400" : "text-slate-300"}`}>
      {text}
    </span>
  );
}

export default function DetailTable({ registros = [] }) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return registros;
    const q = search.toLowerCase();
    return registros.filter((r) =>
      [r.nomeFantasia, r.descricao, r.dataErro, r.tipo, r.versaoFL]
        .join(" ").toLowerCase().includes(q)
    );
  }, [registros, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Filtrar registros..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-surface border border-surface-border rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-500">
          {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface">
              {["Loja", "Início", "Fim", "Data Erro", "Tipo", "Versão"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-600 text-sm">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              paged.map((r, i) => (
                <tr key={i} className="border-b border-surface-border/50 hover:bg-surface-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-medium text-brand-400 bg-brand-400/10 border border-brand-400/20 rounded-full px-2 py-0.5">
                      {r.nomeFantasia || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.dataInicio)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.dataFim)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.dataErro)}</td>
                  <td className="px-4 py-3 max-w-xs"><MsgCell text={r.tipo} /></td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-500">{r.versaoFL || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-surface-border hover:border-brand-600/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ← Anterior
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-surface-border hover:border-brand-600/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}