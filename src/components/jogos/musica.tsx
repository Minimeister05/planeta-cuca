"use client";

import { useReducer } from "react";
import { Music } from "lucide-react";
import { BotaoJogo } from "@/components/botao-jogo";
import { Abertura } from "@/components/jogo/abertura";
import { CascaJogo } from "@/components/jogo/casca";
import { soltarConfete, TelaFinal } from "@/components/jogo/tela-final";
import { Pipo, type Humor } from "@/components/pipo";
import { useDepois } from "@/hooks/use-depois";
import { useSalvarRodada } from "@/hooks/use-salvar-rodada";
import { configMusica, MUSICAS, NOTAS } from "@/lib/musica";
import { ajustarRitmo, estrelasPorTropecos, ritmoInicial, type Ritmo } from "@/lib/nivel";
import { lerProgresso, nivelDoJogo } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar } from "@/lib/voz";

const VIDAS = 3;
const TODAS = [0, 1, 2, 3, 4, 5, 6, 7];

type Status = "ouvindo" | "suaVez" | "acertou" | "errou";

type Estado = {
  fase: "abertura" | "jogando" | "livre" | "fim";
  rodada: number;
  nivelRodada: number;
  sequencia: number[];
  entrada: number;
  tocandoAte: number;
  status: Status;
  destaque: number | null;
  ecos: number;
  vidas: number;
  erroNesta: boolean;
  tropecos: number;
  ritmo: Ritmo;
  musica: number | null;
  posMusica: number;
};

type Acao =
  | { tipo: "comecar"; nivel: number; sequencia: number[] }
  | { tipo: "ouvir" }
  | { tipo: "acender"; nota: number | null; ate?: number }
  | { tipo: "suaVez" }
  | { tipo: "tocar"; nota: number }
  | { tipo: "crescer"; nota: number }
  | { tipo: "fim" }
  | { tipo: "livre" }
  | { tipo: "escolherMusica"; musica: number | null }
  | { tipo: "sair" };

const inicial: Estado = {
  fase: "abertura",
  rodada: 0,
  nivelRodada: 1,
  sequencia: [],
  entrada: 0,
  tocandoAte: -1,
  status: "ouvindo",
  destaque: null,
  ecos: 0,
  vidas: VIDAS,
  erroNesta: false,
  tropecos: 0,
  ritmo: ritmoInicial(1),
  musica: null,
  posMusica: 0,
};

function reducer(e: Estado, a: Acao): Estado {
  switch (a.tipo) {
    case "comecar":
      return {
        ...inicial,
        fase: "jogando",
        rodada: e.rodada + 1,
        nivelRodada: a.nivel,
        ritmo: ritmoInicial(a.nivel),
        sequencia: a.sequencia,
      };
    case "ouvir":
      return { ...e, status: "ouvindo", entrada: 0, tocandoAte: -1 };
    case "acender":
      return { ...e, destaque: a.nota, tocandoAte: a.ate ?? e.tocandoAte };
    case "suaVez":
      return { ...e, status: "suaVez", destaque: null };
    case "tocar": {
      if (e.fase === "livre") {
        if (e.musica === null) return e;
        const notas = MUSICAS[e.musica].notas;
        return a.nota === notas[e.posMusica] ? { ...e, posMusica: e.posMusica + 1 } : e;
      }
      if (e.status !== "suaVez") return e;
      if (a.nota !== e.sequencia[e.entrada]) {
        return {
          ...e,
          status: "errou",
          vidas: e.vidas - 1,
          tropecos: e.tropecos + 1,
          erroNesta: true,
          ritmo: ajustarRitmo(e.ritmo, false),
        };
      }
      const entrada = e.entrada + 1;
      if (entrada < e.sequencia.length) return { ...e, entrada };
      return { ...e, entrada, status: "acertou", ecos: e.ecos + 1, ritmo: e.erroNesta ? e.ritmo : ajustarRitmo(e.ritmo, true) };
    }
    case "crescer":
      return { ...e, sequencia: [...e.sequencia, a.nota], entrada: 0, erroNesta: false, status: "ouvindo", tocandoAte: -1 };
    case "fim":
      return { ...e, fase: "fim" };
    case "livre":
      return { ...inicial, fase: "livre", rodada: e.rodada };
    case "escolherMusica":
      return { ...e, musica: a.musica, posMusica: 0 };
    case "sair":
      return { ...inicial, rodada: e.rodada };
  }
}

const sortearNota = (teclas: readonly number[], evitar?: number) => {
  const opcoes = teclas.length > 2 && evitar !== undefined ? teclas.filter((t) => t !== evitar) : teclas;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
};

export function Musica() {
  const [e, despachar] = useReducer(reducer, inicial);
  const { depois, cancelar } = useDepois();
  const cfg = configMusica(e.nivelRodada);
  const estrelas = e.vidas <= 0 ? 1 : estrelasPorTropecos(e.tropecos, 0, 1);
  useSalvarRodada("musica", e.fase === "fim" ? e.rodada : null, estrelas, e.ritmo.nivel);

  function tocarSequencia(seq: number[], ms: number, espera = 600) {
    despachar({ tipo: "ouvir" });
    seq.forEach((nota, i) => {
      depois(espera + i * ms, () => {
        despachar({ tipo: "acender", nota, ate: i });
        som.nota(nota, (ms / 1000) * 0.9);
      });
      depois(espera + i * ms + ms * 0.65, () => despachar({ tipo: "acender", nota: null }));
    });
    depois(espera + seq.length * ms, () => despachar({ tipo: "suaVez" }));
  }

  function comecar() {
    cancelar();
    const nivel = nivelDoJogo(lerProgresso(), "musica");
    const c = configMusica(nivel);
    const seq: number[] = [];
    for (let i = 0; i < c.inicio; i++) seq.push(sortearNota(c.teclas, seq.at(-1)));
    despachar({ tipo: "comecar", nivel, sequencia: seq });
    tocarSequencia(seq, c.ms, 2400);
  }

  function apertar(nota: number) {
    som.nota(nota, 0.5);
    despachar({ tipo: "acender", nota });
    depois(220, () => despachar({ tipo: "acender", nota: null }));

    if (e.fase === "livre") {
      if (e.musica === null) return;
      despachar({ tipo: "tocar", nota });
      const notas = MUSICAS[e.musica].notas;
      if (nota === notas[e.posMusica] && e.posMusica + 1 === notas.length) {
        depois(400, () => {
          som.vitoria();
          void soltarConfete(false);
          falar(`Que lindo! Você tocou ${MUSICAS[e.musica!].nome}!`);
          despachar({ tipo: "escolherMusica", musica: null });
        });
      }
      return;
    }

    if (e.status !== "suaVez") return;
    despachar({ tipo: "tocar", nota });
    if (nota !== e.sequencia[e.entrada]) {
      som.erro();
      if (e.vidas - 1 <= 0) {
        depois(1300, () => despachar({ tipo: "fim" }));
        return;
      }
      falar("Ops! Escuta de novo.");
      depois(1500, () => tocarSequencia(e.sequencia, cfg.ms));
      return;
    }
    if (e.entrada + 1 < e.sequencia.length) return;
    // completou o eco!
    depois(350, som.acerto);
    if (e.ecos + 1 >= cfg.meta) {
      depois(1200, () => despachar({ tipo: "fim" }));
      return;
    }
    const proxima = sortearNota(cfg.teclas, e.sequencia.at(-1));
    depois(1200, () => {
      despachar({ tipo: "crescer", nota: proxima });
      tocarSequencia([...e.sequencia, proxima], cfg.ms, 300);
    });
  }

  const livre = e.fase === "livre";
  const teclas = livre ? TODAS : cfg.teclas;
  const proximaDaMusica = livre && e.musica !== null ? MUSICAS[e.musica].notas[e.posMusica] : null;

  const humor: Humor = e.status === "errou" ? "triste" : e.status === "acertou" ? "uau" : "feliz";
  const recado = {
    ouvindo: "Escuta só... 🎧",
    suaVez: "Sua vez! Toca igualzinho 👇",
    acertou: "Isso! Que ouvido! 🎉",
    errou: "Ops! Escuta de novo...",
  }[e.status];

  return (
    <CascaJogo
      jogo="musica"
      nivel={e.fase === "jogando" || e.fase === "fim" ? e.ritmo.nivel : undefined}
      passo={e.fase === "jogando" || e.fase === "fim" ? e.ecos : undefined}
      total={e.fase === "jogando" || e.fase === "fim" ? cfg.meta : undefined}
      aoOuvir={e.fase === "jogando" && e.status === "suaVez" ? () => tocarSequencia(e.sequencia, cfg.ms, 200) : undefined}
    >
      {e.fase === "abertura" ? (
        <Abertura jogo="musica" aoComecar={comecar}>
          <BotaoJogo
            cor="neutro"
            onClick={() => {
              som.clique();
              despachar({ tipo: "livre" });
            }}
          >
            <Music /> Tocar livre
          </BotaoJogo>
        </Abertura>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-4 py-2">
          {livre ? (
            <div className="w-full max-w-md space-y-3 text-center">
              <p className="text-lg font-semibold">
                {e.musica === null ? "Toque à vontade ou escolha uma música:" : `Siga a luz: ${MUSICAS[e.musica].nome} ${MUSICAS[e.musica].emoji}`}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {MUSICAS.map((m, i) => (
                  <button
                    key={m.nome}
                    type="button"
                    onClick={() => {
                      som.clique();
                      despachar({ tipo: "escolherMusica", musica: e.musica === i ? null : i });
                    }}
                    className={cn(
                      "rounded-full border bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition hover:scale-105",
                      e.musica === i && "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {m.emoji} {m.nome}
                  </button>
                ))}
              </div>
              {e.musica !== null && (
                <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 transition-[width]"
                    style={{ width: `${(e.posMusica / MUSICAS[e.musica].notas.length) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full max-w-md items-center gap-3 rounded-3xl border bg-card/90 p-3 shadow-lg backdrop-blur">
              <Pipo humor={humor} className={cn("size-16 shrink-0", e.status === "ouvindo" && "animate-balancar")} />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold" aria-live="polite">
                  {recado}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1" aria-hidden>
                  {e.sequencia.map((n, i) => {
                    const feita = e.status === "ouvindo" ? i <= e.tocandoAte : i < e.entrada;
                    return (
                      <span
                        key={i}
                        className={cn("size-3.5 rounded-full bg-muted transition", feita && NOTAS[n].cor, feita && "scale-110")}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center text-lg" aria-label={`${e.vidas} vidas`}>
                {Array.from({ length: VIDAS }, (_, i) => (
                  <span key={i} className={cn("leading-tight transition", i >= e.vidas && "opacity-20 grayscale")}>
                    ❤️
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* xilofone */}
          <div className="flex w-full max-w-xl flex-1 items-center">
            <div className="flex h-[min(52vh,22rem)] w-full items-center justify-center gap-1.5 sm:gap-2.5">
              {teclas.map((nota, i) => {
                const n = NOTAS[nota];
                const acesa = e.destaque === nota;
                const travada = !livre && e.status !== "suaVez";
                return (
                  <button
                    key={nota}
                    type="button"
                    aria-label={`Nota ${n.nome}${nota === 7 ? " agudo" : ""}`}
                    onPointerDown={(ev) => {
                      ev.preventDefault();
                      if (!travada) apertar(nota);
                    }}
                    onKeyDown={(ev) => {
                      if ((ev.key === "Enter" || ev.key === " ") && !travada) {
                        ev.preventDefault();
                        apertar(nota);
                      }
                    }}
                    className={cn(
                      "relative flex max-w-24 flex-1 flex-col items-center justify-between rounded-2xl py-3 text-white shadow-[0_6px_0_0_var(--sombra)] transition-[translate,box-shadow,filter,scale] duration-100 outline-none focus-visible:ring-4 focus-visible:ring-ring/60",
                      n.cor,
                      n.sombra,
                      acesa && "translate-y-1 scale-105 shadow-[0_2px_0_0_var(--sombra),0_0_32px_8px_rgb(255_255_255/0.45)] brightness-125",
                      travada && !acesa && "opacity-80",
                      proximaDaMusica === nota && "animate-pulsar ring-4 ring-white",
                    )}
                    style={{ height: `${100 - (i / Math.max(1, teclas.length - 1)) * 30}%` }}
                  >
                    <span className="size-3 rounded-full bg-white/70 shadow-inner" />
                    <span className="text-base font-bold [text-shadow:0_1px_2px_rgb(0_0_0/0.35)] sm:text-xl">{n.nome}</span>
                    <span className="size-3 rounded-full bg-white/70 shadow-inner" />
                  </button>
                );
              })}
            </div>
          </div>

          {livre && (
            <BotaoJogo cor="neutro" onClick={() => despachar({ tipo: "sair" })}>
              Voltar pro jogo
            </BotaoJogo>
          )}
        </div>
      )}

      {e.fase === "fim" && (
        <TelaFinal
          estrelas={estrelas}
          detalhe={
            e.vidas <= 0
              ? `Os corações acabaram, mas você repetiu ${e.ecos} ${e.ecos === 1 ? "melodia" : "melodias"}!`
              : `Você repetiu uma melodia de ${e.sequencia.length} notas!`
          }
          aoJogarDeNovo={comecar}
        />
      )}
    </CascaJogo>
  );
}
