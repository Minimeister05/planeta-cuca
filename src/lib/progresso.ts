import { useSyncExternalStore } from "react";
import { figurinhas, type Figurinha } from "./figurinhas";
import type { JogoId } from "./jogos";

// Tudo fica no localStorage do aparelho: sem login, sem coletar dado de criança.
const CHAVE = "planeta-cuca:v1";

// Quantas estrelas valem um pacotinho de figurinha
export const PRECO_PACOTE = 4;
// Pacotinho de presente pra quem acabou de chegar
const PACOTES_DE_BOAS_VINDAS = 1;

export type Progresso = {
  idade: number | null;
  estrelas: number;
  figurinhas: string[];
  novas: string[];
  recordes: Partial<Record<JogoId, number>>;
  niveis: Partial<Record<JogoId, number>>;
  som: boolean;
  voz: boolean;
};

const inicial: Progresso = {
  idade: null,
  estrelas: 0,
  figurinhas: [],
  novas: [],
  recordes: {},
  niveis: {},
  som: true,
  voz: true,
};

const ouvintes = new Set<() => void>();
let atual: Progresso | null = null;

const inteiro = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null;

// Confere o que veio do localStorage — pode ser de uma versão antiga ou ter sido mexido na mão
function validar(bruto: unknown): Progresso {
  if (!bruto || typeof bruto !== "object") return inicial;
  const b = bruto as Record<string, unknown>;
  const ids = new Set(figurinhas.map((f) => f.id));
  const listaIds = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => ids.has(x)))] : []);
  const mapa = (v: unknown, max: number) => {
    const saida: Partial<Record<JogoId, number>> = {};
    if (v && typeof v === "object") {
      for (const [k, n] of Object.entries(v)) {
        const ok = inteiro(n, 0, max);
        if (ok !== null) saida[k as JogoId] = ok;
      }
    }
    return saida;
  };
  return {
    idade: inteiro(b.idade, 4, 12),
    estrelas: inteiro(b.estrelas, 0, 1_000_000) ?? 0,
    figurinhas: listaIds(b.figurinhas),
    novas: listaIds(b.novas),
    recordes: mapa(b.recordes, 3),
    niveis: mapa(b.niveis, 9),
    som: b.som !== false,
    voz: b.voz !== false,
  };
}

export function lerProgresso(): Progresso {
  if (atual) return atual;
  try {
    const texto = localStorage.getItem(CHAVE);
    atual = texto ? validar(JSON.parse(texto)) : inicial;
  } catch {
    atual = inicial;
  }
  return atual;
}

function mudar(f: (p: Progresso) => Progresso) {
  atual = f(lerProgresso());
  try {
    localStorage.setItem(CHAVE, JSON.stringify(atual));
  } catch {
    // modo anônimo ou armazenamento cheio: o jogo segue, só não lembra depois
  }
  ouvintes.forEach((o) => o());
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  // outra aba mexeu no progresso → relê
  const aoMudarFora = (e: StorageEvent) => {
    if (e.key !== CHAVE) return;
    atual = null;
    ouvinte();
  };
  window.addEventListener("storage", aoMudarFora);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", aoMudarFora);
  };
}

// No servidor (e na hidratação) usa o progresso vazio; no navegador troca pelo salvo
export const useProgresso = () => useSyncExternalStore(inscrever, lerProgresso, () => inicial);

const semInscricao = () => () => {};
export const useNoNavegador = () => useSyncExternalStore(semInscricao, () => true, () => false);

// ---------------------------------------------------------------- dificuldade
// 4 anos → nível 1 ... 12 anos → nível 9. Dentro de cada jogo o nível ainda sobe e desce com os acertos.
export const nivelPelaIdade = (idade: number | null) => Math.min(9, Math.max(1, (idade ?? 7) - 3));

export const nivelDoJogo = (p: Progresso, jogo: JogoId) => p.niveis[jogo] ?? nivelPelaIdade(p.idade);

// ---------------------------------------------------------------- pacotinhos
export const pacotesGanhos = (p: Progresso) => Math.floor(p.estrelas / PRECO_PACOTE) + PACOTES_DE_BOAS_VINDAS;

export const pacotesParaAbrir = (p: Progresso) =>
  Math.max(0, Math.min(pacotesGanhos(p) - p.figurinhas.length, figurinhas.length - p.figurinhas.length));

// Quanto falta pro próximo pacotinho (0 a PRECO_PACOTE - 1 estrelas já juntadas)
export const estrelasNoPacote = (p: Progresso) => p.estrelas % PRECO_PACOTE;

const PESO: Record<Figurinha["raridade"], number> = { comum: 6, rara: 3, lendaria: 1 };

// Sorteia uma figurinha que a criança ainda não tem (as lendárias saem menos)
export function abrirPacote(): Figurinha | null {
  const p = lerProgresso();
  if (pacotesParaAbrir(p) === 0) return null;
  const faltam = figurinhas.filter((f) => !p.figurinhas.includes(f.id));
  const total = faltam.reduce((s, f) => s + PESO[f.raridade], 0);
  let sorteio = Math.random() * total;
  const escolhida = faltam.find((f) => (sorteio -= PESO[f.raridade]) < 0) ?? faltam[0];
  mudar((q) => ({ ...q, figurinhas: [...q.figurinhas, escolhida.id], novas: [...q.novas, escolhida.id] }));
  return escolhida;
}

// ---------------------------------------------------------------- ações
export const definirIdade = (idade: number) => mudar((p) => ({ ...p, idade, niveis: {} }));

export function concluirRodada(jogo: JogoId, estrelas: number, nivel: number) {
  mudar((p) => ({
    ...p,
    estrelas: p.estrelas + estrelas,
    recordes: { ...p.recordes, [jogo]: Math.max(p.recordes[jogo] ?? 0, estrelas) },
    niveis: { ...p.niveis, [jogo]: nivel },
  }));
}

export const marcarVista = (id: string) => mudar((p) => ({ ...p, novas: p.novas.filter((n) => n !== id) }));
export const alternarSom = () => mudar((p) => ({ ...p, som: !p.som }));
export const alternarVoz = () => mudar((p) => ({ ...p, voz: !p.voz }));
export const apagarTudo = () => mudar(() => inicial);
