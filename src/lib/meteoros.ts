import { criarSorteio, type Sorteio } from "./aleatorio";

// Gerador de contas da Chuva de Meteoros, do nível 1 (contar até 5) ao 9 (tabuada invertida e expressões)
export type Visual = { emoji: string; a: number; b?: number; sinal?: "+" | "−" };

export type Pergunta = {
  texto: string;
  fala: string;
  resposta: number;
  opcoes: number[];
  visual?: Visual;
};

const COISAS = [
  { emoji: "🍎", nome: "maçãs", quantas: "Quantas" },
  { emoji: "⭐", nome: "estrelas", quantas: "Quantas" },
  { emoji: "🐟", nome: "peixinhos", quantas: "Quantos" },
  { emoji: "🚀", nome: "foguetes", quantas: "Quantos" },
  { emoji: "🐞", nome: "joaninhas", quantas: "Quantas" },
  { emoji: "🍪", nome: "biscoitos", quantas: "Quantos" },
  { emoji: "🎈", nome: "balões", quantas: "Quantos" },
];

// Tempo de queda (segundos) por nível — devagarinho pros pequenos
export const QUEDA = [17, 16, 15, 13, 12, 11, 10, 9, 8.5];

const nomeSinal = { "+": "mais", "−": "menos", "×": "vezes", "÷": "dividido por" } as const;
type Sinal = keyof typeof nomeSinal;

const calcular = (a: number, s: Sinal, b: number) => (s === "+" ? a + b : s === "−" ? a - b : s === "×" ? a * b : a / b);

function conta(a: number, s: Sinal, b: number): Omit<Pergunta, "opcoes"> {
  return { texto: `${a} ${s} ${b}`, fala: `Quanto é ${a} ${nomeSinal[s]} ${b}?`, resposta: calcular(a, s, b) };
}

function somaOuSub(r: Sorteio, max: number): Omit<Pergunta, "opcoes"> {
  if (r.rnd() < 0.5) {
    const a = r.inteiro(1, max - 1);
    return conta(a, "+", r.inteiro(1, max - a));
  }
  const a = r.inteiro(2, max);
  return conta(a, "−", r.inteiro(1, a - 1));
}

const multiplicacao = (r: Sorteio, tabuadas: number[], ate = 10) => conta(r.escolher(tabuadas), "×", r.inteiro(1, ate));

function divisao(r: Sorteio, maxQuociente: number) {
  const b = r.inteiro(2, 9);
  const q = r.inteiro(2, maxQuociente);
  return conta(b * q, "÷", b);
}

function faltaNumero(r: Sorteio, s: "+" | "×"): Omit<Pergunta, "opcoes"> {
  if (s === "+") {
    const a = r.inteiro(3, 20);
    const b = r.inteiro(2, 15);
    return { texto: `? + ${b} = ${a + b}`, fala: `Qual número mais ${b} dá ${a + b}?`, resposta: a };
  }
  const a = r.inteiro(2, 10);
  const b = r.inteiro(2, 9);
  return { texto: `? × ${b} = ${a * b}`, fala: `Qual número vezes ${b} dá ${a * b}?`, resposta: a };
}

function base(nivel: number, r: Sorteio): Omit<Pergunta, "opcoes"> {
  const coisa = r.escolher(COISAS);
  switch (nivel) {
    case 1:
    case 2: {
      const a = nivel === 1 ? r.inteiro(1, 5) : r.inteiro(3, 10);
      return { texto: `${coisa.quantas} ${coisa.nome}?`, fala: `${coisa.quantas} ${coisa.nome} tem aqui?`, resposta: a, visual: { emoji: coisa.emoji, a } };
    }
    case 3: {
      const a = r.inteiro(1, 5);
      const b = r.inteiro(1, 4);
      return { ...conta(a, "+", b), visual: { emoji: coisa.emoji, a, b, sinal: "+" } };
    }
    case 4: {
      const c = somaOuSub(r, 10);
      const [a, s, b] = c.texto.split(" ");
      return { ...c, visual: { emoji: coisa.emoji, a: Number(a), b: Number(b), sinal: s === "+" ? "+" : "−" } };
    }
    case 5:
      return somaOuSub(r, 20);
    case 6:
      return r.rnd() < 0.5 ? somaOuSub(r, 50) : multiplicacao(r, [2, 5, 10]);
    case 7:
      return r.rnd() < 0.6 ? multiplicacao(r, [2, 3, 4, 5, 6, 7, 8, 9]) : somaOuSub(r, 100);
    case 8: {
      const x = r.rnd();
      return x < 0.4 ? multiplicacao(r, [3, 4, 6, 7, 8, 9]) : x < 0.75 ? divisao(r, 10) : faltaNumero(r, "+");
    }
    default: {
      const x = r.rnd();
      if (x < 0.3) return faltaNumero(r, "×");
      if (x < 0.55) return conta(r.inteiro(11, 19), "×", r.inteiro(2, 9));
      if (x < 0.8) return divisao(r, 15);
      const a = r.inteiro(2, 9);
      const b = r.inteiro(2, 9);
      const c = r.inteiro(1, 20);
      return { texto: `${a} × ${b} + ${c}`, fala: `Quanto é ${a} vezes ${b}, mais ${c}?`, resposta: a * b + c };
    }
  }
}

// Respostas erradas "parecidas" com a certa, pra ninguém acertar no chute
function distratores(r: Sorteio, resposta: number, nivel: number) {
  const perto = [resposta - 1, resposta + 1, resposta - 2, resposta + 2];
  const longe = resposta >= 10 ? [resposta - 10, resposta + 10] : [];
  const candidatos = [...new Set([...perto, ...longe])].filter((n) => n >= (nivel <= 2 ? 1 : 0) && n !== resposta);
  return r.embaralhar(candidatos).slice(0, 2);
}

export function gerarPergunta(nivel: number, semente: number): Pergunta {
  const r = criarSorteio(semente);
  const p = base(nivel, r);
  return { ...p, opcoes: r.embaralhar([p.resposta, ...distratores(r, p.resposta, nivel)]) };
}
