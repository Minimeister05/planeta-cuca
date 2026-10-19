// Dificuldade adaptativa: 3 acertos seguidos sobe um nível, 2 erros seguidos desce um.
export type Ritmo = { nivel: number; acertos: number; erros: number };

export const ritmoInicial = (nivel: number): Ritmo => ({ nivel, acertos: 0, erros: 0 });

export function ajustarRitmo(r: Ritmo, acertou: boolean): Ritmo {
  if (acertou) {
    const acertos = r.acertos + 1;
    return acertos >= 3 && r.nivel < 9 ? { nivel: r.nivel + 1, acertos: 0, erros: 0 } : { ...r, acertos, erros: 0 };
  }
  const erros = r.erros + 1;
  return erros >= 2 && r.nivel > 1 ? { nivel: r.nivel - 1, acertos: 0, erros: 0 } : { ...r, erros, acertos: 0 };
}

// Estrelas da rodada a partir dos tropeços (erros, dicas, tentativas extras)
export const estrelasPorTropecos = (tropecos: number, bom: number, ok: number) => (tropecos <= bom ? 3 : tropecos <= ok ? 2 : 1);
