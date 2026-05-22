// src/hooks/useAutoRefresh.js
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook genérico para buscar dados com atualização automática.
 * @param {Function} fetcher - função assíncrona que retorna os dados
 * @param {number}   interval - intervalo em ms (padrão: 30 000)
 */
export function useAutoRefresh(fetcher, interval = 30_000) {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown,   setCountdown]   = useState(interval / 1000);

  const timerRef     = useRef(null);
  const countdownRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await fetcher();
      setData(result);
      setLastUpdated(new Date());
      setCountdown(interval / 1000);
    } catch (err) {
      setError(err.message || "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }, [fetcher, interval]);

  // Atualização automática
  useEffect(() => {
    load();
    timerRef.current = setInterval(load, interval);

    // Contador regressivo (atualiza a cada segundo)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? interval / 1000 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [load, interval]);

  const refresh = () => {
    setLoading(true);
    load();
  };

  return { data, loading, error, lastUpdated, countdown, refresh };
}
