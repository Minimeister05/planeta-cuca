// Eco Musical: as 8 notas da escala de Dó, cada uma com sua cor (igual xilofone de brinquedo)
export const NOTAS = [
  { nome: "Dó", cor: "bg-red-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-red-500),black_30%)]" },
  { nome: "Ré", cor: "bg-orange-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-orange-500),black_30%)]" },
  { nome: "Mi", cor: "bg-yellow-400", sombra: "[--sombra:color-mix(in_oklch,var(--color-yellow-400),black_30%)]" },
  { nome: "Fá", cor: "bg-lime-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-lime-500),black_30%)]" },
  { nome: "Sol", cor: "bg-teal-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-teal-500),black_30%)]" },
  { nome: "Lá", cor: "bg-sky-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-sky-500),black_30%)]" },
  { nome: "Si", cor: "bg-violet-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-violet-500),black_30%)]" },
  { nome: "Dó", cor: "bg-pink-500", sombra: "[--sombra:color-mix(in_oklch,var(--color-pink-500),black_30%)]" },
] as const;

// teclas: quais notas aparecem · inicio: tamanho da 1ª melodia · meta: ecos pra terminar · ms: tempo entre notas
const CONFIG = [
  { teclas: [0, 2, 4, 7], inicio: 2, meta: 5, ms: 720 },
  { teclas: [0, 2, 4, 7], inicio: 2, meta: 6, ms: 660 },
  { teclas: [0, 1, 2, 4, 5], inicio: 3, meta: 6, ms: 620 },
  { teclas: [0, 1, 2, 4, 5], inicio: 3, meta: 7, ms: 580 },
  { teclas: [0, 1, 2, 3, 4, 5], inicio: 3, meta: 7, ms: 540 },
  { teclas: [0, 1, 2, 3, 4, 5], inicio: 4, meta: 7, ms: 500 },
  { teclas: [0, 1, 2, 3, 4, 5, 6, 7], inicio: 4, meta: 7, ms: 470 },
  { teclas: [0, 1, 2, 3, 4, 5, 6, 7], inicio: 4, meta: 8, ms: 440 },
  { teclas: [0, 1, 2, 3, 4, 5, 6, 7], inicio: 5, meta: 8, ms: 400 },
];

export const configMusica = (nivel: number) => CONFIG[nivel - 1];

// Músicas de domínio público pro modo livre "siga a luz" (índices de NOTAS)
export const MUSICAS = [
  {
    nome: "Brilha, brilha, estrelinha",
    emoji: "⭐",
    notas: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0, 4, 4, 3, 3, 2, 2, 1, 4, 4, 3, 3, 2, 2, 1, 0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0],
  },
  {
    nome: "Ode à Alegria",
    emoji: "🎻",
    notas: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1, 2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 1, 0, 0],
  },
  {
    nome: "A ovelhinha da Maria",
    emoji: "🐑",
    notas: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4, 2, 1, 0, 1, 2, 2, 2, 2, 1, 1, 2, 1, 0],
  },
];
