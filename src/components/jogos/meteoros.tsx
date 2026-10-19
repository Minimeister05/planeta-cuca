"use client";

import { useReducer, useRef } from "react";
import { Abertura } from "@/components/jogo/abertura";
import { CascaJogo } from "@/components/jogo/casca";
import { TelaFinal } from "@/components/jogo/tela-final";
import { useDepois } from "@/hooks/use-depois";
import { useSalvarRodada } from "@/hooks/use-salvar-rodada";
import { novaSemente } from "@/lib/aleatorio";
import { gerarPergunta, QUEDA, type Pergunta, type Visual } from "@/lib/meteoros";
import { ajustarRitmo, estrelasPorTropecos, ritmoInicial, type Ritmo } from "@/lib/nivel";
import { lerProgresso, nivelDoJogo } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar } from "@/lib/voz";

const TOTAL = 10;
const ESCUDOS = 3;
const PISTAS = [18, 50, 82]; // posição horizontal (%) de cada meteoro

type Alvo = { x: number; y: number };

type Estado = {
  fase: "abertura" | "jogando" | "fim";
  rodada: number;
  indice: number;
  pergunta: Pergunta | null;
  ritmo: Ritmo;
  escudos: number;
  acertos: number;
  tropecos: number;
  resolvida: "acerto" | "perdeu" | null;
  erradas: number[];
  alvo: Alvo | null;
};

type Acao =
  | { tipo: "comecar"; nivel: number; semente: number }
  | { tipo: "acertou"; alvo: Alvo }
  | { tipo: "errou"; opcao: number }
  | { tipo: "caiu" }
  | { tipo: "proxima"; semente: number };

const inicial: Estado = {
  fase: "abertura",
  rodada: 0,
  indice: 0,
  pergunta: null,
  ritmo: ritmoInicial(1),
  escudos: ESCUDOS,
  acertos: 0,
  tropecos: 0,
  resolvida: null,
  erradas: [],
  alvo: null,
};

function reducer(e: Estado, a: Acao): Estado {
  switch (a.tipo) {
    case "comecar":
      return {
        ...inicial,
        fase: "jogando",
        rodada: e.rodada + 1,
        ritmo: ritmoInicial(a.nivel),
        pergunta: gerarPergunta(a.nivel, a.semente),
      };
    case "acertou":
      if (e.resolvida) return e;
      return { ...e, resolvida: "acerto", alvo: a.alvo, acertos: e.acertos + 1, ritmo: ajustarRitmo(e.ritmo, true) };
    case "errou":
      if (e.resolvida || e.erradas.includes(a.opcao)) return e;
      return { ...e, erradas: [...e.erradas, a.opcao], tropecos: e.tropecos + 1, ritmo: ajustarRitmo(e.ritmo, false) };
    case "caiu":
      if (e.resolvida) return e;
      return { ...e, resolvida: "perdeu", escudos: e.escudos - 1, tropecos: e.tropecos + 1, ritmo: ajustarRitmo(e.ritmo, false) };
    case "proxima": {
      const indice = e.indice + 1;
      if (indice >= TOTAL || e.escudos <= 0) return { ...e, fase: "fim", indice };
      return { ...e, indice, pergunta: gerarPergunta(e.ritmo.nivel, a.semente), resolvida: null, erradas: [], alvo: null };
    }
  }
}

export function Meteoros() {
  const [e, despachar] = useReducer(reducer, inicial);
  const { depois } = useDepois();
  const areaRef = useRef<HTMLDivElement>(null);
  const p = e.pergunta;

  const estrelas = e.escudos <= 0 ? 1 : estrelasPorTropecos(e.tropecos, 1, 3);
  useSalvarRodada("meteoros", e.fase === "fim" ? e.rodada : null, estrelas, e.ritmo.nivel);

  const comecar = () => {
    despachar({ tipo: "comecar", nivel: nivelDoJogo(lerProgresso(), "meteoros"), semente: novaSemente() });
  };

  const seguir = (ms: number) => depois(ms, () => despachar({ tipo: "proxima", semente: novaSemente() }));

  function tocar(i: number, alvo: HTMLButtonElement) {
    if (!p || e.resolvida) return;
    if (p.opcoes[i] !== p.resposta) {
      if (e.erradas.includes(i)) return;
      som.erro();
      despachar({ tipo: "errou", opcao: i });
      return;
    }
    const area = areaRef.current?.getBoundingClientRect();
    const r = alvo.getBoundingClientRect();
    despachar({
      tipo: "acertou",
      alvo: { x: r.left + r.width / 2 - (area?.left ?? 0), y: r.top + r.height / 2 - (area?.top ?? 0) },
    });
    som.laser();
    depois(130, som.explosao);
    depois(200, som.acerto);
    seguir(1000);
  }

  function caiu() {
    if (!p || e.resolvida) return;
    despachar({ tipo: "caiu" });
    som.explosao();
    som.erro();
    falar(`Era ${p.resposta}!`);
    seguir(1800);
  }

  return (
    <CascaJogo
      jogo="meteoros"
      nivel={e.fase === "abertura" ? undefined : e.ritmo.nivel}
      passo={e.fase === "abertura" ? undefined : e.indice}
      total={e.fase === "abertura" ? undefined : TOTAL}
      aoOuvir={p ? () => falar(p.fala, { sempre: true }) : undefined}
    >
      {e.fase === "abertura" || !p ? (
        <Abertura jogo="meteoros" aoComecar={comecar} />
      ) : (
        <>
          <div
            ref={areaRef}
            className={cn(
              "relative min-h-[22rem] flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_top,#312e81,#1e1b4b_55%,#0f0a2a)] shadow-inner",
              e.resolvida === "perdeu" && "animate-tremer",
            )}
          >
            <CeuDoJogo />

            <div className="absolute top-3 left-3 flex gap-1 text-2xl" aria-label={`${e.escudos} escudos`}>
              {Array.from({ length: ESCUDOS }, (_, i) => (
                <span key={i} className={cn("transition", i >= e.escudos && "scale-75 opacity-25 grayscale")}>
                  🛡️
                </span>
              ))}
            </div>
            <div className="absolute top-3 right-3 rounded-full bg-white/15 px-3 py-1 text-lg font-semibold text-white backdrop-blur">
              ✅ {e.acertos}
            </div>

            {p.opcoes.map((valor, i) => {
              const certo = valor === p.resposta;
              const errada = e.erradas.includes(i);
              const explodiu = certo && e.resolvida === "acerto";
              return (
                <button
                  key={`${e.indice}-${i}`}
                  type="button"
                  aria-label={`Resposta ${valor}`}
                  disabled={errada || !!e.resolvida}
                  onClick={(ev) => tocar(i, ev.currentTarget)}
                  onAnimationEnd={certo ? (ev) => ev.animationName === "cair" && caiu() : undefined}
                  className={cn(
                    "absolute -translate-x-1/2 [animation-fill-mode:forwards] [animation-name:cair] [animation-timing-function:linear] disabled:cursor-default",
                    e.resolvida && "[animation-play-state:paused]",
                    e.resolvida && !certo && "opacity-0 transition-opacity duration-300",
                    explodiu && "scale-0 opacity-0 transition duration-150",
                  )}
                  style={{ left: `${PISTAS[i]}%`, animationDuration: `${QUEDA[e.ritmo.nivel - 1]}s`, animationDelay: `${-i * 0.8}s` }}
                >
                  <div className={cn("relative", errada && "animate-tremer opacity-40 grayscale")}>
                    <div className="absolute bottom-1/2 left-1/2 h-24 w-14 -translate-x-1/2 rounded-full bg-gradient-to-t from-orange-400/80 via-amber-300/30 to-transparent blur-[6px]" />
                    <div
                      className={cn(
                        "relative grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fde68a,#f97316_45%,#9a3412)] text-3xl font-bold text-white shadow-[0_0_28px_rgb(249_115_22/0.65)] [text-shadow:0_2px_0_rgb(0_0_0/0.4)] sm:size-24 sm:text-4xl",
                        certo && e.resolvida === "perdeu" && "bg-[radial-gradient(circle_at_35%_30%,#bbf7d0,#22c55e_45%,#14532d)] ring-4 ring-white",
                      )}
                    >
                      {valor}
                    </div>
                  </div>
                </button>
              );
            })}

            {e.resolvida === "perdeu" && (
              <p className="absolute inset-x-0 top-[38%] animate-saltar text-center text-4xl font-bold text-white drop-shadow-lg">
                Era {p.resposta}!
              </p>
            )}

            {e.alvo && <Laser alvo={e.alvo} />}

            {/* chão do planeta e a nave */}
            <div className="absolute inset-x-[-10%] bottom-[-6%] h-[18%] rounded-[50%] bg-gradient-to-b from-emerald-300 to-emerald-700 shadow-[0_-8px_30px_rgb(52_211_153/0.35)]" />
            <div
              className="absolute bottom-[7%] -translate-x-1/2 text-5xl transition-[left] duration-150"
              style={{ left: e.alvo ? e.alvo.x : "50%" }}
            >
              <span className="inline-block -rotate-45">🚀</span>
            </div>
          </div>

          <PainelPergunta key={e.indice} pergunta={p} />
        </>
      )}

      {e.fase === "fim" && (
        <TelaFinal
          estrelas={estrelas}
          detalhe={e.escudos <= 0 ? `Os escudos acabaram, mas você acertou ${e.acertos}!` : `Você acertou ${e.acertos} de ${TOTAL} contas.`}
          aoJogarDeNovo={comecar}
        />
      )}
    </CascaJogo>
  );
}

function PainelPergunta({ pergunta: p }: { pergunta: Pergunta }) {
  return (
    <div className="mt-3 animate-saltar rounded-[2rem] border bg-card/90 px-4 py-3 text-center shadow-lg backdrop-blur">
      {p.visual && <VisualConta v={p.visual} />}
      <p className={cn("font-bold tracking-tight", p.visual && !p.visual.sinal ? "text-2xl" : "text-4xl sm:text-5xl")}>
        {p.texto}
        {!p.texto.includes("?") && <span className="text-muted-foreground"> = ?</span>}
      </p>
    </div>
  );
}

// Desenho da conta pros pequenos: 🍎🍎🍎 + 🍎🍎 (na subtração, os tirados ficam apagadinhos)
function VisualConta({ v }: { v: Visual }) {
  const grupo = (n: number, apagados = 0) => (
    <span className="inline-flex max-w-[16rem] flex-wrap justify-center gap-0.5">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={cn("text-3xl sm:text-4xl", i >= n - apagados && "opacity-25 grayscale")}>
          {v.emoji}
        </span>
      ))}
    </span>
  );
  return (
    <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
      {v.sinal === "−" ? (
        grupo(v.a, v.b)
      ) : (
        <>
          {grupo(v.a)}
          {v.b !== undefined && (
            <>
              <span className="text-3xl font-bold text-primary">+</span>
              {grupo(v.b)}
            </>
          )}
        </>
      )}
    </div>
  );
}

const FAISCAS = Array.from({ length: 10 }, (_, i) => {
  const ang = (i / 10) * Math.PI * 2;
  return { dx: `${Math.cos(ang) * 70}px`, dy: `${Math.sin(ang) * 70}px`, cor: i % 2 ? "#fde047" : "#fb923c" };
});

function Laser({ alvo }: { alvo: Alvo }) {
  return (
    <>
      <div
        className="absolute w-2 -translate-x-1/2 origin-bottom rounded-full bg-gradient-to-t from-cyan-300 via-sky-200 to-white shadow-[0_0_16px_#67e8f9] [animation:raio-laser_0.35s_ease-out_forwards]"
        style={{ left: alvo.x, top: alvo.y, bottom: "14%" }}
      />
      <div className="absolute" style={{ left: alvo.x, top: alvo.y }}>
        <span className="absolute -translate-x-1/2 -translate-y-1/2 animate-saltar text-6xl">💥</span>
        {FAISCAS.map((f, i) => (
          <span
            key={i}
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full [animation:faisca_0.6s_ease-out_forwards]"
            style={{ background: f.cor, ["--dx" as string]: f.dx, ["--dy" as string]: f.dy }}
          />
        ))}
      </div>
    </>
  );
}

const PONTINHOS = Array.from({ length: 24 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 70, d: (i % 5) * 0.6 }));

function CeuDoJogo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {PONTINHOS.map((s, i) => (
        <span key={i} className="absolute size-1 animate-piscar rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }} />
      ))}
    </div>
  );
}
