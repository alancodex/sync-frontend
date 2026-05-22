// src/components/ErrorMessage.jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card border-red-500/30 p-8 text-center animate-fade-in">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="font-display font-semibold text-red-400 mb-1">
        Falha na conexão
      </p>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-all"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
