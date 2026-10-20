import { criarSorteio } from "./aleatorio";

// Laboratório de Cores: mistura de tintas no modelo RYB (o das tintas de verdade: vermelho + azul = roxo)
export type Tinta = "vermelho" | "amarelo" | "azul" | "branco" | "preto";
export type Receita = Partial<Record<Tinta, number>>;
export type Alvo = { nome: string; receita: Receita };

export const TINTAS: Record<Tinta, { nome: string; cor: string }> = {
  vermelho: { nome: "Vermelho", cor: "#e11d2e" },
  amarelo: { nome: "Amarelo", cor: "#facc15" },
  azul: { nome: "Azul", cor: "#2563eb" },
  branco: { nome: "Branco", cor: "#ffffff" },
  preto: { nome: "Preto", cor: "#1f1b2e" },
};

export const ORDEM: Tinta[] = ["vermelho", "amarelo", "azul", "branco", "preto"];
export const MAX_GOTAS = 12;

const NIVEIS: { tintas: Tinta[]; alvos: Alvo[] }[] = [
  {
    tintas: ["vermelho", "amarelo", "azul"],
    alvos: [
      { nome: "Laranja", receita: { vermelho: 1, amarelo: 1 } },
      { nome: "Verde", receita: { amarelo: 1, azul: 1 } },
      { nome: "Roxo", receita: { vermelho: 1, azul: 1 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco"],
    alvos: [
      { nome: "Rosa", receita: { vermelho: 1, branco: 1 } },
      { nome: "Azul-claro", receita: { azul: 1, branco: 1 } },
      { nome: "Laranja", receita: { vermelho: 1, amarelo: 1 } },
      { nome: "Verde", receita: { amarelo: 1, azul: 1 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco"],
    alvos: [
      { nome: "Marrom", receita: { vermelho: 1, amarelo: 1, azul: 1 } },
      { nome: "Creme", receita: { amarelo: 1, branco: 1 } },
      { nome: "Lilás", receita: { vermelho: 1, azul: 1, branco: 1 } },
      { nome: "Rosa", receita: { vermelho: 1, branco: 1 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco"],
    alvos: [
      { nome: "Laranja-avermelhado", receita: { vermelho: 2, amarelo: 1 } },
      { nome: "Amarelo-ouro", receita: { vermelho: 1, amarelo: 2 } },
      { nome: "Verde-limão", receita: { amarelo: 2, azul: 1 } },
      { nome: "Verde-água", receita: { amarelo: 1, azul: 2 } },
      { nome: "Framboesa", receita: { vermelho: 2, azul: 1 } },
      { nome: "Violeta", receita: { vermelho: 1, azul: 2 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco", "preto"],
    alvos: [
      { nome: "Cinza", receita: { branco: 1, preto: 1 } },
      { nome: "Azul-marinho", receita: { azul: 2, preto: 1 } },
      { nome: "Coral", receita: { vermelho: 2, branco: 1 } },
      { nome: "Verde-limão", receita: { amarelo: 2, azul: 1 } },
      { nome: "Violeta", receita: { vermelho: 1, azul: 2 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco", "preto"],
    alvos: [
      { nome: "Vinho", receita: { vermelho: 1, preto: 1 } },
      { nome: "Verde-musgo", receita: { amarelo: 1, azul: 1, preto: 1 } },
      { nome: "Pêssego", receita: { vermelho: 1, amarelo: 1, branco: 1 } },
      { nome: "Azul-bebê", receita: { azul: 1, branco: 2 } },
      { nome: "Framboesa", receita: { vermelho: 2, azul: 1 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco", "preto"],
    alvos: [
      { nome: "Verde-menta", receita: { amarelo: 1, azul: 1, branco: 2 } },
      { nome: "Lavanda", receita: { vermelho: 1, azul: 1, branco: 2 } },
      { nome: "Chocolate", receita: { vermelho: 1, amarelo: 1, azul: 1, preto: 1 } },
      { nome: "Pêssego", receita: { vermelho: 1, amarelo: 1, branco: 1 } },
      { nome: "Azul-marinho", receita: { azul: 2, preto: 1 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco", "preto"],
    alvos: [
      { nome: "Salmão", receita: { vermelho: 2, amarelo: 1, branco: 1 } },
      { nome: "Café com leite", receita: { vermelho: 1, amarelo: 1, azul: 1, branco: 1 } },
      { nome: "Ferrugem", receita: { vermelho: 2, amarelo: 1, preto: 1 } },
      { nome: "Verde-menta", receita: { amarelo: 1, azul: 1, branco: 2 } },
      { nome: "Lavanda", receita: { vermelho: 1, azul: 1, branco: 2 } },
    ],
  },
  {
    tintas: ["vermelho", "amarelo", "azul", "branco", "preto"],
    alvos: [
      { nome: "Verde-oliva", receita: { amarelo: 2, azul: 1, preto: 1 } },
      { nome: "Salmão", receita: { vermelho: 2, amarelo: 1, branco: 1 } },
      { nome: "Ferrugem", receita: { vermelho: 2, amarelo: 1, preto: 1 } },
      { nome: "Café com leite", receita: { vermelho: 1, amarelo: 1, azul: 1, branco: 1 } },
      { nome: "Azul-acinzentado", receita: { azul: 1, branco: 1, preto: 1 } },
    ],
  },
];

export const tintasDoNivel = (nivel: number) => NIVEIS[nivel - 1].tintas;

export function gerarAlvo(nivel: number, semente: number, evitar?: string): Alvo {
  const r = criarSorteio(semente);
  const opcoes = NIVEIS[nivel - 1].alvos.filter((a) => a.nome !== evitar);
  return r.escolher(opcoes);
}

// ---------------------------------------------------------------- cor da mistura
type RGB = [number, number, number];

// Cantos do cubo RYB → RGB (Gossett & Chen): o "jeito tinta" de misturar cor
const CUBO: Record<string, RGB> = {
  "000": [1, 1, 1],
  "100": [1, 0, 0],
  "010": [1, 1, 0],
  "001": [0.163, 0.373, 0.6],
  "110": [1, 0.5, 0],
  "101": [0.5, 0, 0.5],
  "011": [0, 0.66, 0.2],
  "111": [0.2, 0.094, 0],
};

function rybParaRgb(r: number, y: number, b: number): RGB {
  const saida: RGB = [0, 0, 0];
  for (const [canto, cor] of Object.entries(CUBO)) {
    const peso = (canto[0] === "1" ? r : 1 - r) * (canto[1] === "1" ? y : 1 - y) * (canto[2] === "1" ? b : 1 - b);
    for (let i = 0; i < 3; i++) saida[i] += cor[i] * peso;
  }
  return saida;
}

const total = (m: Receita) => ORDEM.reduce((s, t) => s + (m[t] ?? 0), 0);

export function corDaMistura(m: Receita): RGB | null {
  const n = total(m);
  if (n === 0) return null;
  const v = m.vermelho ?? 0;
  const a = m.amarelo ?? 0;
  const z = m.azul ?? 0;
  const maior = Math.max(v, a, z);
  const pigmento = maior > 0 ? rybParaRgb(v / maior, a / maior, z / maior) : ([0, 0, 0] as RGB);
  const fracao = (v + a + z) / n;
  const branco = (m.branco ?? 0) / n;
  return pigmento.map((c) => c * fracao + branco) as RGB;
}

export const rgbCss = (c: RGB | null) =>
  c ? `rgb(${c.map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255)).join(" ")})` : "transparent";

export const corDoAlvo = (a: Alvo) => corDaMistura(a.receita);

// Mesma proporção = mesma cor (2 vermelho + 2 amarelo também é laranja)
export function mesmaProporcao(m: Receita, alvo: Receita) {
  const nm = total(m);
  const na = total(alvo);
  if (!nm) return false;
  return ORDEM.every((t) => (m[t] ?? 0) * na === (alvo[t] ?? 0) * nm);
}

// 0 (nada a ver) a 1 (igualzinho)
export function parecido(m: Receita, alvo: Alvo) {
  const a = corDaMistura(m);
  const b = corDoAlvo(alvo);
  if (!a || !b) return 0;
  const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  return Math.max(0, 1 - d / 0.75);
}

export const gotas = total;
