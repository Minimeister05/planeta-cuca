// Catálogo dos planetas-jogo. A ordem aqui é a ordem da trilha na galáxia.
export const jogos = [
  {
    id: "meteoros",
    nome: "Chuva de Meteoros",
    materia: "Matemática",
    emoji: "☄️",
    chamada: "Acerte a conta e exploda os meteoros!",
    instrucao: "Toque no meteoro com a resposta certa antes que ele caia!",
    ensina: "Contagem, soma, subtração, tabuada e divisão — a dificuldade sobe sozinha conforme a criança acerta.",
    planeta: "from-orange-300 via-rose-400 to-rose-600",
    anel: false,
  },
  {
    id: "robo",
    nome: "Robô Perdido",
    materia: "Programação",
    emoji: "🤖",
    chamada: "Monte o caminho e leve o robô até a bateria.",
    instrucao: "Monte o caminho com as setas e aperte o play pra levar o robô até a bateria!",
    ensina: "Pensamento computacional: sequência de comandos, planejamento, depuração e repetição (laços).",
    planeta: "from-sky-300 via-cyan-500 to-blue-700",
    anel: true,
  },
  {
    id: "palavras",
    nome: "Palavras Mágicas",
    materia: "Leitura",
    emoji: "🔤",
    chamada: "Descubra as letras e forme as palavras.",
    instrucao: "Escute a palavra e toque nas letras certas!",
    ensina: "Letra inicial, consciência fonológica e ortografia — com palavras que vão de GATO a BORBOLETA.",
    planeta: "from-lime-300 via-emerald-500 to-teal-700",
    anel: false,
  },
  {
    id: "cores",
    nome: "Laboratório de Cores",
    materia: "Ciências",
    emoji: "🧪",
    chamada: "Misture as tintas e descubra cores novas.",
    instrucao: "Pingue as tintas no pote até ficar igualzinho à cor pedida!",
    ensina: "Cores primárias e secundárias, proporção e experimentação — como num laboratório de verdade.",
    planeta: "from-pink-300 via-fuchsia-500 to-purple-700",
    anel: true,
  },
  {
    id: "musica",
    nome: "Eco Musical",
    materia: "Música e memória",
    emoji: "🎵",
    chamada: "Escute a melodia e toque igualzinho.",
    instrucao: "Escute a melodia e depois toque as mesmas notas, na mesma ordem!",
    ensina: "Memória, atenção e as notas musicais (dó, ré, mi...), além de um modo livre pra tocar à vontade.",
    planeta: "from-yellow-200 via-amber-400 to-orange-600",
    anel: false,
  },
] as const;

export type Jogo = (typeof jogos)[number];
export type JogoId = Jogo["id"];

export const acharJogo = (id: JogoId) => jogos.find((j) => j.id === id)!;
