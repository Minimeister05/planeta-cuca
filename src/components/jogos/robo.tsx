"use client";

import { useReducer } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete, Play, Trash2 } from "lucide-react";
import { BotaoJogo } from "@/components/botao-jogo";
import { Abertura } from "@/components/jogo/abertura";
import { CascaJogo } from "@/components/jogo/casca";
import { TelaFinal } from "@/components/jogo/tela-final";
import { useDepois } from "@/hooks/use-depois";
import { useSalvarRodada } from "@/hooks/use-salvar-rodada";
import { novaSemente } from "@/lib/aleatorio";
import { ajustarRitmo, estrelasPorTropecos, ritmoInicial, type Ritmo } from "@/lib/nivel";
import { lerProgresso, nivelDoJogo } from "@/lib/progresso";
import { chave, DIRS, gerarFase, MAX_VEZES, simular, type Bloco, type Dir, type Fase, type Resultado } from "@/lib/robo";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar } from "@/lib/voz";

const TOTAL = 5;

const SETAS: Record<Dir, { Icone: typeof ArrowUp; nome: string; cor: string }> = {
  cima: { Icone: ArrowUp, nome: "Pra cima", cor: "bg-sky-500 [--sombra:color-mix(in_oklch,var(--color-sky-500),black_32%)]" },
  esquerda: { Icone: ArrowLeft, nome: "Pra esquerda", cor: "bg-pink-500 [--sombra:color-mix(in_oklch,var(--color-pink-500),black_32%)]" },
  direita: { Icone: ArrowRight, nome: "Pra direita", cor: "bg-emerald-500 [--sombra:color-mix(in_oklch,var(--color-emerald-500),black_32%)]" },
  baixo: { Icone: ArrowDown, nome: "Pra baixo", cor: "bg-amber-500 [--sombra:color-mix(in_oklch,var(--color-amber-500),black_32%)]" },
};

const FALAS: Record<Resultado, string> = {
  chegou: "Uhul! O robô chegou na bateria!",
  bateu: "Ops! O robô bateu na pedra. Tenta de novo!",
  caiu: "Ops! Ali não tem chão. Tenta de novo!",
  faltou: "Quase! O robô parou antes da bateria.",
};

type Execucao = { caminho: ReturnType<typeof simular>["caminho"]; resultado: Resultado; passo: number; fim: boolean };

type Estado = {
  fase: "abertura" | "jogando" | "fim";
  rodada: number;
  indice: number;
  mapa: Fase | null;
  programa: Bloco[];
  proximoId: number;
  exec: Execucao | null;
  tentativas: number;
  tropecos: number;
  ritmo: Ritmo;
};

type Acao =
  | { tipo: "comecar"; nivel: number; semente: number }
  | { tipo: "adicionar"; dir: Dir }
  | { tipo: "tocarBloco"; indice: number }
  | { tipo: "desfazer" }
  | { tipo: "limpar" }
  | { tipo: "rodar"; exec: Execucao }
  | { tipo: "passo"; passo: number }
  | { tipo: "resultado" }
  | { tipo: "reiniciar" }
  | { tipo: "proxima"; semente: number };

const inicial: Estado = {
  fase: "abertura",
  rodada: 0,
  indice: 0,
  mapa: null,
  programa: [],
  proximoId: 1,
  exec: null,
  tentativas: 0,
  tropecos: 0,
  ritmo: ritmoInicial(1),
};

function reducer(e: Estado, a: Acao): Estado {
  const ocupado = e.exec !== null;
  switch (a.tipo) {
    case "comecar":
      return { ...inicial, fase: "jogando", rodada: e.rodada + 1, ritmo: ritmoInicial(a.nivel), mapa: gerarFase(a.nivel, a.semente) };
    case "adicionar": {
      if (ocupado || !e.mapa || (e.mapa.limite !== null && e.programa.length >= e.mapa.limite)) return e;
      const ultimo = e.programa.at(-1);
      // com repetição liberada, a mesma seta seguida vira "×2" no mesmo bloco
      if (e.mapa.repetir && ultimo?.dir === a.dir && ultimo.vezes < MAX_VEZES) {
        return { ...e, programa: [...e.programa.slice(0, -1), { ...ultimo, vezes: ultimo.vezes + 1 }] };
      }
      return { ...e, programa: [...e.programa, { id: e.proximoId, dir: a.dir, vezes: 1 }], proximoId: e.proximoId + 1 };
    }
    case "tocarBloco": {
      if (ocupado || !e.mapa) return e;
      if (!e.mapa.repetir) return { ...e, programa: e.programa.filter((_, i) => i !== a.indice) };
      return {
        ...e,
        programa: e.programa.map((b, i) => (i === a.indice ? { ...b, vezes: b.vezes >= MAX_VEZES ? 1 : b.vezes + 1 } : b)),
      };
    }
    case "desfazer": {
      if (ocupado) return e;
      const ultimo = e.programa.at(-1);
      if (!ultimo) return e;
      if (ultimo.vezes > 1) return { ...e, programa: [...e.programa.slice(0, -1), { ...ultimo, vezes: ultimo.vezes - 1 }] };
      return { ...e, programa: e.programa.slice(0, -1) };
    }
    case "limpar":
      return ocupado ? e : { ...e, programa: [] };
    case "rodar":
      return ocupado ? e : { ...e, exec: a.exec, tentativas: e.tentativas + 1 };
    case "passo":
      return e.exec ? { ...e, exec: { ...e.exec, passo: a.passo } } : e;
    case "resultado": {
      if (!e.exec) return e;
      const chegou = e.exec.resultado === "chegou";
      return {
        ...e,
        exec: { ...e.exec, fim: true },
        tropecos: chegou ? e.tropecos : e.tropecos + 1,
        ritmo: ajustarRitmo(e.ritmo, chegou && e.tentativas === 1),
      };
    }
    case "reiniciar":
      return { ...e, exec: null };
    case "proxima": {
      const indice = e.indice + 1;
      if (indice >= TOTAL) return { ...e, fase: "fim", indice };
      return { ...e, indice, mapa: gerarFase(e.ritmo.nivel, a.semente), programa: [], exec: null, tentativas: 0 };
    }
  }
}

export function Robo() {
  const [e, despachar] = useReducer(reducer, inicial);
  const { depois } = useDepois();
  const estrelas = estrelasPorTropecos(e.tropecos, 1, 4);
  useSalvarRodada("robo", e.fase === "fim" ? e.rodada : null, estrelas, e.ritmo.nivel);

  const comecar = () => despachar({ tipo: "comecar", nivel: nivelDoJogo(lerProgresso(), "robo"), semente: novaSemente() });

  function rodar() {
    if (!e.mapa || e.exec || e.programa.length === 0) return;
    const { caminho, resultado } = simular(e.mapa, e.programa);
    const ms = 380;
    despachar({ tipo: "rodar", exec: { caminho, resultado, passo: 0, fim: false } });
    som.pop();
    for (let k = 1; k < caminho.length; k++) {
      depois(k * ms, () => {
        despachar({ tipo: "passo", passo: k });
        som.passo();
      });
    }
    depois(caminho.length * ms + 80, () => {
      despachar({ tipo: "resultado" });
      falar(FALAS[resultado]);
      if (resultado === "chegou") {
        som.acerto();
        depois(1300, () => despachar({ tipo: "proxima", semente: novaSemente() }));
      } else {
        som.erro();
        depois(1500, () => despachar({ tipo: "reiniciar" }));
      }
    });
  }

  const m = e.mapa;
  const exec = e.exec;
  const posRobo = exec ? exec.caminho[exec.passo].p : m?.robo;
  const blocoAtivo = exec && !exec.fim ? exec.caminho[exec.passo].bloco : -1;
  const rastro = new Set(exec ? exec.caminho.slice(1, exec.passo + 1).map((c) => chave(c.p)) : []);
  const cheio = !!m && m.limite !== null && e.programa.length >= m.limite;

  return (
    <CascaJogo
      jogo="robo"
      nivel={e.fase === "abertura" ? undefined : e.ritmo.nivel}
      passo={e.fase === "abertura" ? undefined : e.indice}
      total={e.fase === "abertura" ? undefined : TOTAL}
      aoOuvir={m ? () => falar("Monte o caminho com as setas e aperte o play pra levar o robô até a bateria!", { sempre: true }) : undefined}
    >
      {e.fase === "abertura" || !m || !posRobo ? (
        <Abertura jogo="robo" aoComecar={comecar} />
      ) : (
        <div className="flex flex-1 flex-col items-center gap-3">
          {/* tabuleiro */}
          <div
            key={e.indice}
            className="relative grid aspect-square w-full max-w-[22rem] animate-saltar gap-1 rounded-3xl border bg-card/70 p-2 shadow-lg backdrop-blur"
            style={{ gridTemplateColumns: `repeat(${m.tamanho}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${m.tamanho}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: m.tamanho * m.tamanho }, (_, i) => {
              const x = i % m.tamanho;
              const y = Math.floor(i / m.tamanho);
              const k = chave({ x, y });
              const pedra = m.pedras.includes(k);
              const alvo = m.alvo.x === x && m.alvo.y === y;
              return (
                <div
                  key={k}
                  className={cn(
                    "relative grid place-items-center rounded-xl text-[min(7vw,1.9rem)]",
                    (x + y) % 2 ? "bg-primary/10" : "bg-primary/5",
                    rastro.has(k) && "bg-sky-400/35",
                  )}
                >
                  {pedra && <span aria-label="pedra">🪨</span>}
                  {alvo && (
                    <span aria-label="bateria" className="animate-pulsar drop-shadow-[0_0_10px_rgb(250_204_21/0.9)]">
                      🔋
                    </span>
                  )}
                </div>
              );
            })}
            {/* o robô anda por cima da grade */}
            <div
              className="pointer-events-none absolute grid place-items-center p-2 transition-[left,top] duration-300 ease-out"
              style={{
                left: `calc(0.5rem + ${posRobo.x} * ((100% - 1rem + 0.25rem) / ${m.tamanho}))`,
                top: `calc(0.5rem + ${posRobo.y} * ((100% - 1rem + 0.25rem) / ${m.tamanho}))`,
                width: `calc((100% - 1rem + 0.25rem) / ${m.tamanho} - 0.25rem)`,
                height: `calc((100% - 1rem + 0.25rem) / ${m.tamanho} - 0.25rem)`,
              }}
            >
              <span
                className={cn(
                  "text-[min(8vw,2.2rem)] drop-shadow-md",
                  exec?.fim && exec.resultado !== "chegou" && "animate-tremer",
                  exec?.fim && exec.resultado === "chegou" && "animate-flutuar",
                )}
              >
                {exec?.fim && exec.resultado !== "chegou" ? "😵" : "🤖"}
              </span>
            </div>
            {exec?.fim && (
              <p className="absolute inset-x-0 -bottom-3 mx-auto w-fit animate-saltar rounded-full bg-card px-4 py-1.5 text-center font-semibold shadow-lg">
                {exec.resultado === "chegou" ? "Uhul! Chegou! 🎉" : exec.resultado === "faltou" ? "Quase! Faltou um pouco" : "Ops! Tenta de novo"}
              </p>
            )}
          </div>

          {/* programa montado */}
          <div className="w-full max-w-[22rem] rounded-3xl border bg-card/80 p-3 shadow backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Seu programa</span>
              {m.limite !== null && (
                <span className={cn(cheio && "font-semibold text-primary")}>
                  Blocos: {e.programa.length}/{m.limite}
                </span>
              )}
            </div>
            <div className="flex min-h-14 flex-wrap gap-1.5">
              {e.programa.length === 0 && (
                <p className="self-center text-sm text-muted-foreground">Toque nas setas pra montar o caminho 👇</p>
              )}
              {e.programa.map((b, i) => {
                const { Icone, nome, cor } = SETAS[b.dir];
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      som.clique();
                      despachar({ tipo: "tocarBloco", indice: i });
                    }}
                    aria-label={`${nome}${b.vezes > 1 ? `, ${b.vezes} vezes` : ""}. ${m.repetir ? "Toque pra repetir mais" : "Toque pra tirar"}`}
                    className={cn(
                      "relative grid size-12 animate-saltar place-items-center rounded-xl text-white shadow-[0_3px_0_0_var(--sombra)] transition",
                      cor,
                      blocoAtivo === i && "scale-110 ring-4 ring-ouro",
                    )}
                  >
                    <Icone className="size-6" strokeWidth={3} />
                    {b.vezes > 1 && (
                      <span className="absolute -top-2 -right-2 rounded-full bg-ouro px-1.5 text-sm font-bold text-amber-950 shadow">×{b.vezes}</span>
                    )}
                  </button>
                );
              })}
            </div>
            {m.repetir && (
              <p className="mt-2 text-xs text-muted-foreground">Dica: toque num bloco pra ele repetir (×2, ×3...). Assim cabe mais caminho!</p>
            )}
          </div>

          {/* controles */}
          <div className="grid w-full max-w-[22rem] grid-cols-4 gap-2">
            {DIRS.map((d) => {
              const { Icone, nome, cor } = SETAS[d];
              return (
                <button
                  key={d}
                  type="button"
                  aria-label={nome}
                  disabled={!!exec || cheio}
                  onClick={() => {
                    som.clique();
                    despachar({ tipo: "adicionar", dir: d });
                  }}
                  className={cn(
                    "grid h-16 place-items-center rounded-2xl text-white shadow-[0_5px_0_0_var(--sombra)] transition active:translate-y-1 active:shadow-[0_1px_0_0_var(--sombra)] disabled:opacity-40",
                    cor,
                  )}
                >
                  <Icone className="size-8" strokeWidth={3} />
                </button>
              );
            })}
          </div>
          <div className="grid w-full max-w-[22rem] grid-cols-[auto_auto_1fr] gap-2">
            <BotaoJogo cor="neutro" aria-label="Desfazer" disabled={!!exec || !e.programa.length} onClick={() => despachar({ tipo: "desfazer" })}>
              <Delete />
            </BotaoJogo>
            <BotaoJogo cor="neutro" aria-label="Limpar programa" disabled={!!exec || !e.programa.length} onClick={() => despachar({ tipo: "limpar" })}>
              <Trash2 />
            </BotaoJogo>
            <BotaoJogo cor="sucesso" disabled={!!exec || !e.programa.length} onClick={rodar}>
              <Play className="fill-current" /> Rodar
            </BotaoJogo>
          </div>
        </div>
      )}

      {e.fase === "fim" && (
        <TelaFinal
          estrelas={estrelas}
          detalhe={e.tropecos === 0 ? "Todos os programas funcionaram de primeira!" : `Você consertou ${e.tropecos} ${e.tropecos === 1 ? "bug" : "bugs"} no caminho. Isso é programar!`}
          aoJogarDeNovo={comecar}
        />
      )}
    </CascaJogo>
  );
}
