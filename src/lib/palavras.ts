import { criarSorteio, type Sorteio } from "./aleatorio";

// Palavras Mágicas: do "com que letra começa GATO?" até montar BORBOLETA com letras-pegadinha
type Palavra = readonly [palavra: string, emoji: string];

const CURTAS: Palavra[] = [
  ["GATO", "🐱"], ["PATO", "🦆"], ["BOLA", "⚽"], ["CASA", "🏠"], ["SOL", "☀️"], ["LUA", "🌙"], ["RATO", "🐭"],
  ["SAPO", "🐸"], ["VACA", "🐮"], ["UVA", "🍇"], ["OVO", "🥚"], ["DADO", "🎲"], ["PIPA", "🪁"], ["BOTA", "👢"],
  ["FOCA", "🦭"], ["MEL", "🍯"], ["FLOR", "🌸"], ["URSO", "🐻"], ["BOLO", "🎂"], ["FOGO", "🔥"], ["MALA", "🧳"],
  ["LOBO", "🐺"], ["MOTO", "🏍️"], ["FADA", "🧚"], ["TREM", "🚂"],
];

const MEDIAS: Palavra[] = [
  ["PEIXE", "🐟"], ["MACACO", "🐒"], ["BANANA", "🍌"], ["CAVALO", "🐴"], ["COELHO", "🐰"], ["TOMATE", "🍅"],
  ["PIZZA", "🍕"], ["DENTE", "🦷"], ["NUVEM", "☁️"], ["ZEBRA", "🦓"], ["TIGRE", "🐯"], ["PORCO", "🐷"],
  ["COBRA", "🐍"], ["PANDA", "🐼"], ["PIPOCA", "🍿"], ["BALEIA", "🐳"], ["CAMELO", "🐪"], ["GIRAFA", "🦒"],
  ["ABELHA", "🐝"], ["CORUJA", "🦉"], ["POLVO", "🐙"], ["LIVRO", "📚"], ["CHAVE", "🔑"], ["BARCO", "⛵"],
  ["CARRO", "🚗"], ["ESTRELA", "⭐"], ["FOGUETE", "🚀"], ["MORANGO", "🍓"], ["CENOURA", "🥕"], ["SORVETE", "🍦"],
];

const LONGAS: Palavra[] = [
  ["ELEFANTE", "🐘"], ["TARTARUGA", "🐢"], ["BORBOLETA", "🦋"], ["CHOCOLATE", "🍫"], ["ABACAXI", "🍍"],
  ["MELANCIA", "🍉"], ["PINGUIM", "🐧"], ["DINOSSAURO", "🦕"], ["BICICLETA", "🚲"], ["HELICÓPTERO", "🚁"],
  ["ASTRONAUTA", "🧑‍🚀"], ["CARANGUEJO", "🦀"], ["ESQUILO", "🐿️"], ["MORCEGO", "🦇"], ["VULCÃO", "🌋"],
  ["CORAÇÃO", "❤️"], ["MAÇÃ", "🍎"], ["LEÃO", "🦁"], ["ÔNIBUS", "🚌"], ["AVIÃO", "✈️"], ["CAMINHÃO", "🚚"],
  ["TUBARÃO", "🦈"], ["LÂMPADA", "💡"], ["PÁSSARO", "🐦"], ["JACARÉ", "🐊"], ["GUITARRA", "🎸"],
  ["TELEFONE", "☎️"], ["PRESENTE", "🎁"], ["CACHORRO", "🐶"], ["PASSARINHO", "🐤"],
];

const ALFABETO = "ABCDEFGHIJLMNOPRSTUVXZ".split("");

// Letras com acento/cedilha ganham a "irmã sem enfeite" como pegadinha
const PEGADINHA: Record<string, string> = { Ç: "S", Ã: "A", Õ: "O", Á: "A", É: "E", Ê: "E", Í: "I", Ó: "O", Ô: "O", Ú: "U", Â: "A" };

export type Peca = { id: number; letra: string };

export type Desafio =
  | { modo: "escolher"; palavra: string; emoji: string; oculta: number; opcoes: string[] }
  | { modo: "montar"; palavra: string; emoji: string; pecas: Peca[] };

function letrasErradas(r: Sorteio, certa: string, qtd: number) {
  const extras = new Set<string>();
  if (PEGADINHA[certa]) extras.add(PEGADINHA[certa]);
  for (const l of r.embaralhar(ALFABETO)) {
    if (extras.size >= qtd) break;
    if (l !== certa) extras.add(l);
  }
  return [...extras].slice(0, qtd);
}

function escolher(r: Sorteio, [palavra, emoji]: Palavra, oculta: number): Desafio {
  const certa = palavra[oculta];
  return { modo: "escolher", palavra, emoji, oculta, opcoes: r.embaralhar([certa, ...letrasErradas(r, certa, 2)]) };
}

function montar(r: Sorteio, [palavra, emoji]: Palavra, extras: number): Desafio {
  const letras = [...palavra];
  const pegadinhas = letras.map((l) => PEGADINHA[l]).filter(Boolean);
  const sobra = [...pegadinhas, ...r.embaralhar(ALFABETO).filter((l) => !letras.includes(l))].slice(0, extras);
  const pecas = r.embaralhar([...letras, ...sobra]).map((letra, id) => ({ id, letra }));
  return { modo: "montar", palavra, emoji, pecas };
}

export function gerarDesafio(nivel: number, semente: number, evitar: string[] = []): Desafio {
  const r = criarSorteio(semente);
  const pegar = (lista: Palavra[]) => r.escolher(lista.filter(([p]) => !evitar.includes(p)).length ? lista.filter(([p]) => !evitar.includes(p)) : lista);
  switch (nivel) {
    case 1:
      return escolher(r, pegar(CURTAS), 0);
    case 2:
      return escolher(r, pegar(r.rnd() < 0.7 ? CURTAS : MEDIAS), 0);
    case 3: {
      const p = pegar(CURTAS);
      return escolher(r, p, r.inteiro(0, p[0].length - 1));
    }
    case 4: {
      const p = pegar(MEDIAS);
      return escolher(r, p, r.inteiro(1, p[0].length - 1));
    }
    case 5:
      return montar(r, pegar(r.rnd() < 0.5 ? CURTAS : MEDIAS), 0);
    case 6:
      return montar(r, pegar(MEDIAS), 1);
    case 7:
      return montar(r, pegar(r.rnd() < 0.4 ? MEDIAS : LONGAS.filter(([p]) => p.length <= 8)), 2);
    case 8:
      return montar(r, pegar(LONGAS), 2);
    default:
      return montar(r, pegar(LONGAS.filter(([p]) => p.length >= 7)), 3);
  }
}
