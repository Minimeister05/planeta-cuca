import { useCallback, useEffect, useRef } from "react";

// setTimeout que se cancela sozinho quando a tela fecha (sem atualizar estado de tela que já sumiu)
export function useDepois() {
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const ativos = timers.current;
    return () => {
      ativos.forEach((id) => window.clearTimeout(id));
      ativos.clear();
    };
  }, []);

  const depois = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const cancelar = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
  }, []);

  return { depois, cancelar };
}
