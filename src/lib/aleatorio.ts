// Sorteios dos jogos. Os jogos geram uma semente no clique (Math.random) e montam tudo a partir dela:
// assim os reducers continuam puros e a renderização nunca sorteia nada.

export function comSemente(semente: number) {
  let s = Math.floor(semente * 4294967296) >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Sorteio = ReturnType<typeof criarSorteio>;

export function criarSorteio(semente: number) {
  const rnd = comSemente(semente);
  const inteiro = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
  return {
    rnd,
    inteiro,
    escolher: <T>(lista: readonly T[]): T => lista[Math.floor(rnd() * lista.length)],
    embaralhar<T>(lista: readonly T[]): T[] {
      const copia = [...lista];
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      return copia;
    },
  };
}

export const novaSemente = () => Math.random();
