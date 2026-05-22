// src/pages/LojaDetail.jsx
import { useState, useEffect } from "react";
import { fetchLoja } from "../services/api";
import StatusBadge  from "../components/StatusBadge";
import DetailTable  from "../components/DetailTable";
import ErrorMessage from "../components/ErrorMessage";

function InfoPill({ label, value }) {
  return (
    <div className="bg-surface rounded-xl border border-surface-border px-4 py-3">
      <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-mono text-slate-300">{value || "—"}</p>
    </div>
  );
}

export default function LojaDetail({ loja: lojaResumida, onBack }) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLoja(lojaResumida.grupo_loja)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [lojaResumida.grupo_loja]);

  const loja = detail || lojaResumida;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="flex-shrink-0 mt-0.5 px-3 py-1.5 text-xs rounded-lg border border-surface-border text-slate-500 hover:text-slate-300 hover:border-surface-muted transition-all"
        >
          ← Voltar
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display font-bold text-xl text-white">
              {loja.nome_fantasia || loja.empresa || `Loja ${loja.grupo_loja}`}
            </h2>
            <StatusBadge status={loja.status} />
          </div>
          {loja.empresa && loja.empresa !== loja.nome_fantasia && (
            <p className="text-sm text-slate-500 mt-0.5">{loja.empresa}</p>
          )}
        </div>
      </div>

      {/* Info pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoPill label="Grupo / Loja" value={`#${loja.grupo_loja}`} />
        <InfoPill label="Versão"       value={loja.versao} />
        <InfoPill label="Total de Registros" value={detail?.total_registros} />
        <InfoPill label="Última Atualização" value={loja.ultima_atualizacao} />
      </div>

      {/* Erro atual */}
      {loja.erro && (
        <div className="card border-red-500/30 p-4">
          <p className="text-[11px] text-red-400 uppercase tracking-wider mb-2 font-medium">
            Erro atual
          </p>
          <p className="text-sm font-mono text-red-300">{loja.erro}</p>
        </div>
      )}

      {/* Histórico */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-white mb-4">
          Histórico de Sincronização
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm mt-3">Carregando registros...</p>
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <DetailTable registros={detail?.registros ?? []} />
        )}
      </div>
    </div>
  );
}
