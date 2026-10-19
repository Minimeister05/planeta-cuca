import { lerProgresso } from "./progresso";

// Todos os sons são sintetizados na hora com Web Audio — nenhum arquivo pra baixar.
let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || !lerProgresso().som) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type OpcoesTom = { inicio?: number; duracao?: number; tipo?: OscillatorType; volume?: number; para?: number };

function tom(freq: number, { inicio = 0, duracao = 0.15, tipo = "sine", volume = 0.2, para }: OpcoesTom = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + inicio;
  const osc = a.createOscillator();
  const ganho = a.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t);
  if (para) osc.frequency.exponentialRampToValueAtTime(para, t + duracao);
  ganho.gain.setValueAtTime(0.0001, t);
  ganho.gain.exponentialRampToValueAtTime(volume, t + 0.012);
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  osc.connect(ganho).connect(a.destination);
  osc.start(t);
  osc.stop(t + duracao + 0.05);
}

function ruido(duracao: number, volume: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const buffer = a.createBuffer(1, Math.floor(a.sampleRate * duracao), a.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length);
  const fonte = a.createBufferSource();
  fonte.buffer = buffer;
  const filtro = a.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.setValueAtTime(1800, t);
  filtro.frequency.exponentialRampToValueAtTime(120, t + duracao);
  const ganho = a.createGain();
  ganho.gain.setValueAtTime(volume, t);
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  fonte.connect(filtro).connect(ganho).connect(a.destination);
  fonte.start(t);
}

// Notas da escala de Dó maior (Dó4 até Dó5)
export const FREQUENCIAS = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

export const som = {
  clique: () => tom(660, { duracao: 0.07, tipo: "triangle", volume: 0.12 }),
  pop: () => tom(380, { para: 900, duracao: 0.12, volume: 0.18 }),
  gota: () => tom(1100, { para: 260, duracao: 0.16, volume: 0.2 }),
  passo: () => tom(240, { para: 320, duracao: 0.08, tipo: "square", volume: 0.05 }),
  laser: () => tom(1400, { para: 220, duracao: 0.16, tipo: "sawtooth", volume: 0.05 }),
  explosao: () => ruido(0.45, 0.35),
  acerto: () => [523.25, 659.25, 783.99].forEach((f, i) => tom(f, { inicio: i * 0.075, duracao: 0.2, tipo: "triangle", volume: 0.16 })),
  erro: () => {
    tom(196, { duracao: 0.16, tipo: "square", volume: 0.06, para: 150 });
    tom(147, { inicio: 0.12, duracao: 0.22, tipo: "square", volume: 0.06, para: 110 });
  },
  estrela: (i: number) => tom(880 * Math.pow(1.26, i), { duracao: 0.35, tipo: "triangle", volume: 0.15 }),
  vitoria: () =>
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) =>
      tom(f, { inicio: i * 0.11, duracao: i === 5 ? 0.6 : 0.16, tipo: "triangle", volume: 0.14 }),
    ),
  revelar: () => [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tom(f, { inicio: i * 0.06, duracao: 0.3, volume: 0.12 })),
  // Nota "de piano de brinquedo": triângulo + um harmônico suave
  nota: (indice: number, duracao = 0.6) => {
    const f = FREQUENCIAS[indice];
    tom(f, { duracao, tipo: "triangle", volume: 0.22 });
    tom(f * 2, { duracao: duracao * 0.6, volume: 0.05 });
  },
};
