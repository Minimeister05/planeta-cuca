"use client";

import { useReducer } from "react";
import { Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { BotaoJogo } from "@/components/botao-jogo";
import { Abertura } from "@/components/jogo/abertura";
import { CascaJogo } from "@/components/jogo/casca";
import { TelaFinal } from "@/components/jogo/tela-final";
import { useDepois } from "@/hooks/use-depois";
import { useSalvarRodada } from "@/hooks/use-salvar-rodada";
import { novaSemente } from "@/lib/aleatorio";
import {
  corDaMistura,
  corDoAlvo,
  gerarAlvo,
  gotas,
  MAX_GOTAS,
  mesmaProporcao,
  ORDEM,
  parecido,
  rgbCss,
  tintasDoNivel,
  TINTAS,
  type Alvo,
  type Receita,
  type Tinta,
} from "@/lib/cores";
import { ajustarRitmo, estrelasPorTropecos, ritmoInicial, type Ritmo } from "@/lib/nivel";
import { lerProgresso, nivelDoJogo } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar } from "@/lib/voz";

const TOTAL = 6;

type Estado = {
  fase: "abertura" | "jogando" | "fim";
  rodada: number;
  indice: number;
  alvo: Alvo | null;
  tintas: Tinta[];
  mistura: Receita;
  historico: Tinta[];
  ultimaGota: { tinta: Tinta; vez: number } | null;
  dica: boolean;
  tropecosAqui: number;
  tropecos: number;
  acertou: boolean;
  ritmo: Ritmo;
};

type Acao =
  | { tipo: "comecar"; nivel: number; semente: number }
  | { tipo: "pingar"; tinta: Tinta }
  | { tipo: "desfazer" }
  | { tipo: "esvaziar" }
  | { tipo: "dica" }
  | { tipo: "proxima"; semente: number };

const inicial: Estado = {
  fase: "abertura",
  rodada: 0,
  indice: 0,
  alvo: null,
  tintas: [],
  mistura: {},
  historico: [],
  ultimaGota: null,
  dica: false,
  tropecosAqui: 0,
  tropecos: 0,
  acertou: false,
  ritmo: ritmoInicial(1),
};

const novoAlvo = (e: Estado, nivel: number, semente: number): Estado => ({
  ...e,
  alvo: gerarAlvo(nivel, semente, e.alvo?.nome),
  tintas: tintasDoNivel(nivel),
  mistura: {},
  historico: [],
  ultimaGota: null,
  dica: false,
  tropecosAqui: 0,
  acertou: false,
});

function reducer(e: Estado, a: Acao): Estado {
  switch (a.tipo) {
    case "comecar":
      return novoAlvo({ ...inicial, fase: "jogando", rodada: e.rodada + 1, ritmo: ritmoInicial(a.nivel) }, a.nivel, a.semente);
    case "pingar": {
      if (!e.alvo || e.acertou || gotas(e.mistura) >= MAX_GOTAS) return e;
      const mistura = { ...e.mistura, [a.tinta]: (e.mistura[a.tinta] ?? 0) + 1 };
      const acertou = mesmaProporcao(mistura, e.alvo.receita);
      return {
        ...e,
        mistura,
        historico: [...e.historico, a.tinta],
        ultimaGota: { tinta: a.tinta, vez: (e.ultimaGota?.vez ?? 0) + 1 },
        acertou,
        ritmo: acertou ? ajustarRitmo(e.ritmo, e.tropecosAqui === 0) : e.ritmo,
      };
    }
    case "desfazer": {
      const ultima = e.historico.at(-1);
      if (!ultima || e.acertou) return e;
      return { ...e, mistura: { ...e.mistura, [ultima]: (e.mistura[ultima] ?? 1) - 1 }, historico: e.historico.slice(0, -1) };
    }
    case "esvaziar":
      if (e.acertou || !e.historico.length) return e;
      return { ...e, mistura: {}, historico: [], tropecosAqui: e.tropecosAqui + 1, tropecos: e.tropecos + 1 };
    case "dica":
      if (e.dica || e.acertou) return e;
      return { ...e, dica: true, tropecosAqui: e.tropecosAqui + 1, tropecos: e.tropecos + 1 };
    case "proxima": {
      const indice = e.indice + 1;
      if (indice >= TOTAL) return { ...e, fase: "fim", indice };
      return novoAlvo({ ...e, indice }, e.ritmo.nivel, a.semente);
    }
  }
}

const ROTULO_PARECIDO = ["Bem diferente...", "Tá longe", "Esquentando!", "Tá perto!", "Quase lá!!"];

export function Cores() {
  const [e, despachar] = useReducer(reducer, inicial);
  const { depois } = useDepois();
  const estrelas = estrelasPorTropecos(e.tropecos, 1, 3);
  useSalvarRodada("cores", e.fase === "fim" ? e.rodada : null, estrelas, e.ritmo.nivel);

  const comecar = () => despachar({ tipo: "comecar", nivel: nivelDoJogo(lerProgresso(), "cores"), semente: novaSemente() });

  const alvo = e.alvo;
  const n = gotas(e.mistura);
  const cheio = n >= MAX_GOTAS;
  const nota = alvo ? parecido(e.mistura, alvo) : 0;
  const nivelParecido = n === 0 ? -1 : Math.min(4, Math.floor(nota * 5));

  function pingar(t: Tinta) {
    if (!alvo || e.acertou || cheio) return;
    som.gota();
    despachar({ tipo: "pingar", tinta: t });
    const mistura = { ...e.mistura, [t]: (e.mistura[t] ?? 0) + 1 };
    if (mesmaProporcao(mistura, alvo.receita)) {
      depois(250, som.acerto);
      falar(`Isso! Você fez ${alvo.nome.toLowerCase()}!`);
      depois(2000, () => despachar({ tipo: "proxima", semente: novaSemente() }));
    } else if (gotas(mistura) >= MAX_GOTAS) {
      falar("O pote encheu! Esvazie e tente de novo.");
    }
  }

  return (
    <CascaJogo
      jogo="cores"
      nivel={e.fase === "abertura" ? undefined : e.ritmo.nivel}
      passo={e.fase === "abertura" ? undefined : e.indice}
      total={e.fase === "abertura" ? undefined : TOTAL}
      aoOuvir={alvo ? () => falar(`Misture as tintas pra fazer ${alvo.nome.toLowerCase()}!`, { sempre: true }) : undefined}
    >
      {e.fase === "abertura" || !alvo ? (
        <Abertura jogo="cores" aoComecar={comecar} />
      ) : (
        <div className="flex flex-1 flex-col items-center gap-4 py-1">
          {/* cor pedida */}
          <div key={e.indice} className="flex w-full max-w-sm animate-saltar items-center gap-4 rounded-3xl border bg-card/90 p-3 shadow-lg backdrop-blur">
            <div
              className="size-20 shrink-0 rounded-2xl border-4 border-white shadow-inner dark:border-white/80"
              style={{ background: rgbCss(corDoAlvo(alvo)) }}
            />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Faça esta cor:</p>
              <p className="text-2xl leading-tight font-bold">{alvo.nome}</p>
              {e.dica ? (
                <p className="mt-1 flex flex-wrap gap-1 text-sm">
                  {ORDEM.filter((t) => alvo.receita[t]).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                      <span className="size-3 rounded-full border" style={{ background: TINTAS[t].cor }} />
                      {alvo.receita[t]}× {TINTAS[t].nome.toLowerCase()}
                    </span>
                  ))}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Quais tintas será que vão nela?</p>
              )}
            </div>
          </div>

          {/* o pote de mistura */}
          <div className="relative mt-2">
            {e.ultimaGota && (
              <span
                key={e.ultimaGota.vez}
                aria-hidden
                className="absolute -top-10 left-1/2 z-10 size-5 -translate-x-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] border border-black/10 [animation:gota_0.45s_ease-in_forwards]"
                style={{ background: TINTAS[e.ultimaGota.tinta].cor }}
              />
            )}
            <div className="relative h-44 w-40 overflow-hidden rounded-t-xl rounded-b-[3.5rem] border-4 border-white/80 bg-white/30 shadow-[inset_0_-8px_20px_rgb(0_0_0/0.08),0_14px_30px_-10px_rgb(0_0_0/0.4)] backdrop-blur dark:border-white/30 dark:bg-white/10">
              <div
                className={cn("absolute inset-x-0 bottom-0 transition-[height,background-color] duration-500", e.acertou && "animate-pulsar")}
                style={{ height: `${n === 0 ? 0 : 18 + (n / MAX_GOTAS) * 72}%`, background: rgbCss(corDaMistura(e.mistura)) }}
              >
                <span className="absolute inset-x-3 top-1.5 h-2 rounded-full bg-white/40" />
              </div>
              {n === 0 && <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted-foreground">Pote vazio</p>}
              {e.acertou && <span className="absolute inset-0 grid animate-saltar place-items-center text-5xl">✨</span>}
              <span className="absolute top-3 left-3 h-24 w-3 rounded-full bg-white/50" />
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {n}/{MAX_GOTAS} gotas
            </p>
          </div>

          {/* quão parecido */}
          <div className="w-full max-w-xs text-center" aria-live="polite">
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-3 flex-1 rounded-full bg-muted transition-colors",
                    i <= nivelParecido && (nivelParecido >= 3 ? "bg-sucesso" : nivelParecido >= 2 ? "bg-ouro" : "bg-orange-400"),
                  )}
                />
              ))}
            </div>
            <p className="mt-1 font-semibold">
              {e.acertou ? "Igualzinho! 🎉" : cheio ? "O pote encheu! Esvazie 👇" : nivelParecido < 0 ? "Pingue uma tinta!" : ROTULO_PARECIDO[nivelParecido]}
            </p>
          </div>

          {/* tintas */}
          <div className="flex w-full max-w-sm justify-center gap-2">
            {e.tintas.map((t) => (
              <button
                key={t}
                type="button"
                disabled={e.acertou || cheio}
                onClick={() => pingar(t)}
                aria-label={`Pingar ${TINTAS[t].nome.toLowerCase()}`}
                className="group flex flex-1 flex-col items-center gap-1 disabled:opacity-50"
              >
                <span className="relative grid h-16 w-full max-w-16 place-items-end overflow-hidden rounded-t-lg rounded-b-2xl border-2 border-black/10 bg-card shadow-[0_4px_0_0_var(--border)] transition group-active:translate-y-1 group-active:shadow-none dark:border-white/15">
                  <span className="absolute inset-x-0 bottom-0 h-3/4" style={{ background: TINTAS[t].cor }} />
                  <span className="absolute top-1 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-muted-foreground/30" />
                  {(e.mistura[t] ?? 0) > 0 && (
                    <span className="relative m-1 rounded-full bg-black/55 px-1.5 text-xs font-bold text-white">{e.mistura[t]}</span>
                  )}
                </span>
                <span className="text-xs font-medium">{TINTAS[t].nome}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <BotaoJogo cor="neutro" aria-label="Desfazer última gota" disabled={e.acertou || !e.historico.length} onClick={() => despachar({ tipo: "desfazer" })}>
              <Undo2 />
            </BotaoJogo>
            <BotaoJogo
              cor="neutro"
              disabled={e.acertou || !e.historico.length}
              onClick={() => {
                som.clique();
                despachar({ tipo: "esvaziar" });
              }}
            >
              <RotateCcw /> Esvaziar
            </BotaoJogo>
            <BotaoJogo
              cor="ouro"
              disabled={e.acertou || e.dica}
              onClick={() => {
                despachar({ tipo: "dica" });
                const receita = ORDEM.filter((t) => alvo.receita[t]).map((t) => `${alvo.receita[t]} de ${TINTAS[t].nome.toLowerCase()}`);
                falar(`Pra fazer ${alvo.nome.toLowerCase()}: ${receita.join(", ")}.`, { sempre: true });
              }}
            >
              <Lightbulb /> Dica
            </BotaoJogo>
          </div>
        </div>
      )}

      {e.fase === "fim" && (
        <TelaFinal
          estrelas={estrelas}
          detalhe={e.tropecos === 0 ? "Todas as cores de primeira! Cientista nato!" : `Você misturou ${TOTAL} cores novas no laboratório.`}
          aoJogarDeNovo={comecar}
        />
      )}
    </CascaJogo>
  );
}
