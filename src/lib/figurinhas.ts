// Álbum de figurinhas: cada uma traz uma curiosidade de verdade (conferida) pra criança descobrir.
export type Raridade = "comum" | "rara" | "lendaria";

export const categorias = {
  animais: { nome: "Animais", fundo: "from-emerald-300 to-teal-500" },
  dinos: { nome: "Dinossauros", fundo: "from-amber-300 to-orange-500" },
  espaco: { nome: "Espaço", fundo: "from-indigo-400 to-violet-600" },
  corpo: { nome: "Corpo humano", fundo: "from-rose-300 to-pink-500" },
  natureza: { nome: "Natureza", fundo: "from-sky-300 to-blue-500" },
} as const;

export type Categoria = keyof typeof categorias;

export type Figurinha = {
  id: string;
  emoji: string;
  nome: string;
  fato: string;
  categoria: Categoria;
  raridade: Raridade;
};

export const figurinhas: Figurinha[] = [
  // animais
  { id: "polvo", emoji: "🐙", nome: "Polvo", categoria: "animais", raridade: "rara", fato: "O polvo tem três corações e sangue azul!" },
  { id: "girafa", emoji: "🦒", nome: "Girafa", categoria: "animais", raridade: "comum", fato: "A língua da girafa é roxa e pode medir quase meio metro." },
  { id: "elefante", emoji: "🐘", nome: "Elefante", categoria: "animais", raridade: "comum", fato: "O elefante consegue sentir vibrações do chão pelas patas, como se escutasse com os pés." },
  { id: "tubarao", emoji: "🦈", nome: "Tubarão", categoria: "animais", raridade: "rara", fato: "Os tubarões existem há mais tempo que as árvores!" },
  { id: "abelha", emoji: "🐝", nome: "Abelha", categoria: "animais", raridade: "comum", fato: "As abelhas fazem uma dancinha pra mostrar às amigas onde estão as flores." },
  { id: "coruja", emoji: "🦉", nome: "Coruja", categoria: "animais", raridade: "comum", fato: "A coruja consegue girar a cabeça três quartos de volta: dá pra olhar pras próprias costas!" },
  { id: "pinguim", emoji: "🐧", nome: "Pinguim", categoria: "animais", raridade: "comum", fato: "Pinguins não voam no céu, mas parecem voar debaixo d'água de tão rápido que nadam." },
  { id: "preguica", emoji: "🦥", nome: "Bicho-preguiça", categoria: "animais", raridade: "rara", fato: "O bicho-preguiça só desce da árvore mais ou menos uma vez por semana... pra fazer cocô!" },
  { id: "golfinho", emoji: "🐬", nome: "Golfinho", categoria: "animais", raridade: "comum", fato: "O golfinho dorme com metade do cérebro de cada vez, pra continuar nadando e respirando." },
  { id: "borboleta", emoji: "🦋", nome: "Borboleta", categoria: "animais", raridade: "comum", fato: "A borboleta sente o gosto das coisas com os pés." },
  { id: "papagaio", emoji: "🦜", nome: "Papagaio", categoria: "animais", raridade: "comum", fato: "O papagaio consegue imitar palavras e sons que escuta." },
  { id: "onca", emoji: "🐆", nome: "Onça-pintada", categoria: "animais", raridade: "rara", fato: "A onça-pintada é o maior felino das Américas e adora nadar." },
  { id: "tartaruga", emoji: "🐢", nome: "Tartaruga", categoria: "animais", raridade: "comum", fato: "Algumas tartarugas gigantes vivem mais de 150 anos." },
  { id: "formiga", emoji: "🐜", nome: "Formiga", categoria: "animais", raridade: "comum", fato: "A formiga carrega coisas muitas vezes mais pesadas que ela mesma." },
  { id: "baleia", emoji: "🐳", nome: "Baleia-azul", categoria: "animais", raridade: "lendaria", fato: "A baleia-azul é o maior animal que já existiu — maior que qualquer dinossauro!" },

  // dinossauros
  { id: "trex", emoji: "🦖", nome: "Tiranossauro", categoria: "dinos", raridade: "rara", fato: "O T-rex viveu mais perto da nossa época do que da época do estegossauro." },
  { id: "sauropode", emoji: "🦕", nome: "Pescoçudo", categoria: "dinos", raridade: "rara", fato: "Os maiores dinossauros pescoçudos passavam de 30 metros: o comprimento de três ônibus!" },
  { id: "galinha", emoji: "🐔", nome: "Galinha", categoria: "dinos", raridade: "lendaria", fato: "As aves são dinossauros! A galinha é parente do T-rex." },
  { id: "fossil", emoji: "🦴", nome: "Fóssil", categoria: "dinos", raridade: "comum", fato: "A gente só sabe como eram os dinossauros porque os ossos deles viraram pedra: os fósseis." },
  { id: "ovo", emoji: "🥚", nome: "Ovo de dino", categoria: "dinos", raridade: "comum", fato: "Os dinossauros nasciam de ovos, igual aos passarinhos." },

  // espaço
  { id: "sol", emoji: "☀️", nome: "Sol", categoria: "espaco", raridade: "rara", fato: "O Sol é uma estrela tão grande que caberia mais de um milhão de Terras dentro dele." },
  { id: "lua", emoji: "🌙", nome: "Lua", categoria: "espaco", raridade: "comum", fato: "As pegadas dos astronautas na Lua podem durar milhões de anos, porque lá não tem vento." },
  { id: "saturno", emoji: "🪐", nome: "Saturno", categoria: "espaco", raridade: "rara", fato: "Saturno é tão leve pro tamanho dele que boiaria numa banheira gigante." },
  { id: "marte", emoji: "🔴", nome: "Marte", categoria: "espaco", raridade: "comum", fato: "Marte tem o maior vulcão do Sistema Solar, o Monte Olimpo." },
  { id: "estrela", emoji: "⭐", nome: "Estrelas", categoria: "espaco", raridade: "comum", fato: "A luz das estrelas que você vê hoje saiu delas há muitos anos — às vezes milhares!" },
  { id: "terra", emoji: "🌍", nome: "Terra", categoria: "espaco", raridade: "comum", fato: "Cerca de 70% da Terra é coberta de água." },
  { id: "cometa", emoji: "☄️", nome: "Cometa", categoria: "espaco", raridade: "rara", fato: "Cometas são bolas de gelo e poeira, e a cauda deles aponta sempre pro lado contrário do Sol." },
  { id: "astronauta", emoji: "👩‍🚀", nome: "Astronauta", categoria: "espaco", raridade: "lendaria", fato: "No espaço, os astronautas ficam uns centímetros mais altos!" },

  // corpo humano
  { id: "osso", emoji: "👂", nome: "Ouvido", categoria: "corpo", raridade: "rara", fato: "O menor osso do corpo fica dentro do ouvido e se chama estribo." },
  { id: "cerebro", emoji: "🧠", nome: "Cérebro", categoria: "corpo", raridade: "rara", fato: "O cérebro usa cerca de 20% de toda a energia do seu corpo." },
  { id: "coracao", emoji: "❤️", nome: "Coração", categoria: "corpo", raridade: "comum", fato: "Seu coração bate cerca de 100 mil vezes por dia." },
  { id: "olho", emoji: "👀", nome: "Olhos", categoria: "corpo", raridade: "comum", fato: "Você pisca umas 15 vezes por minuto, sem nem perceber." },
  { id: "dente", emoji: "🦷", nome: "Dentes", categoria: "corpo", raridade: "comum", fato: "O esmalte dos dentes é a parte mais dura do corpo humano." },

  // natureza
  { id: "arcoiris", emoji: "🌈", nome: "Arco-íris", categoria: "natureza", raridade: "comum", fato: "O arco-íris aparece quando a luz do Sol atravessa gotinhas de chuva e se separa em cores." },
  { id: "raio", emoji: "⚡", nome: "Raio", categoria: "natureza", raridade: "rara", fato: "Um raio é mais quente que a superfície do Sol!" },
  { id: "vulcao", emoji: "🌋", nome: "Vulcão", categoria: "natureza", raridade: "comum", fato: "A lava de um vulcão pode passar de 1.000 graus." },
  { id: "neve", emoji: "❄️", nome: "Floco de neve", categoria: "natureza", raridade: "comum", fato: "Todo floco de neve tem seis pontas." },
  { id: "banana", emoji: "🍌", nome: "Banana", categoria: "natureza", raridade: "lendaria", fato: "A banana é um tiquinho radioativa — tão pouquinho que não faz mal nenhum!" },
  { id: "mel", emoji: "🍯", nome: "Mel", categoria: "natureza", raridade: "rara", fato: "O mel guardado direitinho pode durar milhares de anos sem estragar." },
  { id: "arvore", emoji: "🌳", nome: "Árvore", categoria: "natureza", raridade: "comum", fato: "As árvores soltam o oxigênio que a gente respira." },
];

export const nomeRaridade: Record<Raridade, string> = { comum: "Comum", rara: "Rara!", lendaria: "LENDÁRIA!!" };
