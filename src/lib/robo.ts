import { criarSorteio } from "./aleatorio";

// Robô Perdido: fases geradas na hora, sempre com solução garantida (busca em largura)
export type Dir = "cima" | "baixo" | "esquerda" | "direita";
export type Ponto = { x: number; y: number };
export type Bloco = { id: number; dir: Dir; vezes: number };

export const DIRS: Dir[] = ["cima", "esquerda", "direita", "baixo"];
const PASSO: Record<Dir, Ponto> = { cima: { x: 0, y: -1 }, baixo: { x: 0, y: 1 }, esquerda: { x: -1, y: 0 }, direita: { x: 1, y: 0 } };
export const MAX_VEZES = 5;

export type Fase = {
  tamanho: number;
  robo: Ponto;
  alvo: Ponto;
  pedras: string[];
  repetir: boolean; // libera o "×2, ×3..." (laços)
  limite: number | null; // máximo de blocos no programa
};

const CONFIG = [
  { tamanho: 4, pedras: 1, dist: [2, 3], repetir: false, folga: null },
  { tamanho: 4, pedras: 2, dist: [3, 4], repetir: false, folga: null },
  { tamanho: 5, pedras: 3, dist: [3, 5], repetir: false, folga: null },
  { tamanho: 5, pedras: 4, dist: [4, 6], repetir: false, folga: null },
  { tamanho: 5, pedras: 5, dist: [5, 7], repetir: true, folga: 2 },
  { tamanho: 6, pedras: 7, dist: [6, 8], repetir: true, folga: 1 },
  { tamanho: 6, pedras: 8, dist: [7, 10], repetir: true, folga: 1 },
  { tamanho: 6, pedras: 10, dist: [8, 11], repetir: true, folga: 0 },
  { tamanho: 7, pedras: 12, dist: [9, 13], repetir: true, folga: 0 },
] as const;

export const chave = (p: Ponto) => `${p.x},${p.y}`;
const mesmo = (a: Ponto, b: Ponto) => a.x === b.x && a.y === b.y;
const dentro = (p: Ponto, n: number) => p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
const andar = (p: Ponto, d: Dir) => ({ x: p.x + PASSO[d].x, y: p.y + PASSO[d].y });

// Menor número de passos do robô até a bateria (ou null se não tem caminho)
function menorCaminho(n: number, inicio: Ponto, fim: Ponto, pedras: Set<string>) {
  const dist = new Map([[chave(inicio), 0]]);
  const fila = [inicio];
  while (fila.length) {
    const atual = fila.shift()!;
    if (mesmo(atual, fim)) return dist.get(chave(atual))!;
    for (const d of DIRS) {
      const prox = andar(atual, d);
      if (!dentro(prox, n) || pedras.has(chave(prox)) || dist.has(chave(prox))) continue;
      dist.set(chave(prox), dist.get(chave(atual))! + 1);
      fila.push(prox);
    }
  }
  return null;
}

// Menor número de blocos usando repetição (cada bloco anda até MAX_VEZES casas na mesma direção)
function menosBlocos(n: number, inicio: Ponto, fim: Ponto, pedras: Set<string>) {
  // estado = casa + direção do bloco atual + quantas vezes já repetiu; custo = blocos usados
  const custo = new Map<string, number>();
  const fila: { p: Ponto; d: Dir | null; k: number; c: number }[] = [{ p: inicio, d: null, k: 0, c: 0 }];
  let melhor = Infinity;
  while (fila.length) {
    fila.sort((a, b) => a.c - b.c);
    const e = fila.shift()!;
    if (e.c >= melhor) continue;
    if (mesmo(e.p, fim)) {
      melhor = e.c;
      continue;
    }
    for (const d of DIRS) {
      const prox = andar(e.p, d);
      if (!dentro(prox, n) || pedras.has(chave(prox))) continue;
      const continua = d === e.d && e.k < MAX_VEZES;
      const novo = { p: prox, d, k: continua ? e.k + 1 : 1, c: e.c + (continua ? 0 : 1) };
      const id = `${chave(prox)}|${d}|${novo.k}`;
      if ((custo.get(id) ?? Infinity) <= novo.c) continue;
      custo.set(id, novo.c);
      fila.push(novo);
    }
  }
  return melhor;
}

export function gerarFase(nivel: number, semente: number): Fase {
  const r = criarSorteio(semente);
  const cfg = CONFIG[nivel - 1];
  const n = cfg.tamanho;
  const casa = () => ({ x: r.inteiro(0, n - 1), y: r.inteiro(0, n - 1) });

  for (let tentativa = 0; tentativa < 800; tentativa++) {
    const robo = casa();
    const alvo = casa();
    if (mesmo(robo, alvo)) continue;
    const pedras = new Set<string>();
    // relaxa as pedras se estiver difícil de achar uma fase boa
    const qtd = tentativa > 600 ? 0 : cfg.pedras;
    while (pedras.size < qtd) {
      const p = casa();
      if (!mesmo(p, robo) && !mesmo(p, alvo)) pedras.add(chave(p));
    }
    const d = menorCaminho(n, robo, alvo, pedras);
    if (d === null || d < cfg.dist[0] || (d > cfg.dist[1] && tentativa < 600)) continue;
    const limite = cfg.folga === null ? null : menosBlocos(n, robo, alvo, pedras) + cfg.folga;
    return { tamanho: n, robo, alvo, pedras: [...pedras], repetir: cfg.repetir, limite };
  }
  return { tamanho: n, robo: { x: 0, y: 0 }, alvo: { x: n - 1, y: n - 1 }, pedras: [], repetir: cfg.repetir, limite: null };
}

export type Resultado = "chegou" | "bateu" | "caiu" | "faltou";

// Roda o programa "de mentirinha" e devolve cada casa por onde o robô passa
export function simular(fase: Fase, programa: Bloco[]) {
  const pedras = new Set(fase.pedras);
  const caminho: { p: Ponto; bloco: number }[] = [{ p: fase.robo, bloco: -1 }];
  let p = fase.robo;
  for (let i = 0; i < programa.length; i++) {
    for (let v = 0; v < programa[i].vezes; v++) {
      const prox = andar(p, programa[i].dir);
      if (!dentro(prox, fase.tamanho)) return { caminho, resultado: "caiu" as Resultado, bloco: i };
      if (pedras.has(chave(prox))) return { caminho, resultado: "bateu" as Resultado, bloco: i };
      p = prox;
      caminho.push({ p, bloco: i });
      if (mesmo(p, fase.alvo)) return { caminho, resultado: "chegou" as Resultado, bloco: i };
    }
  }
  return { caminho, resultado: "faltou" as Resultado, bloco: programa.length - 1 };
}
