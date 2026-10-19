import { useEffect, useRef } from "react";
import type { JogoId } from "@/lib/jogos";
import { concluirRodada } from "@/lib/progresso";

// Guarda as estrelas e o nível quando a rodada termina — uma vez só por rodada
export function useSalvarRodada(jogo: JogoId, rodada: number | null, estrelas: number, nivel: number) {
  const salva = useRef<number | null>(null);
  useEffect(() => {
    if (rodada === null || salva.current === rodada) return;
    salva.current = rodada;
    concluirRodada(jogo, estrelas, nivel);
  }, [jogo, rodada, estrelas, nivel]);
}
