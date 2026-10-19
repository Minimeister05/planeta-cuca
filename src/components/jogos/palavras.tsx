"use client";

import { useEffect, useReducer } from "react";
import { Lightbulb, Volume2 } from "lucide-react";
import { BotaoJogo } from "@/components/botao-jogo";
import { Abertura } from "@/components/jogo/abertura";
import { CascaJogo } from "@/components/jogo/casca";
import { TelaFinal } from "@/components/jogo/tela-final";
import { useDepois } from "@/hooks/use-depois";
import { useSalvarRodada } from "@/hooks/use-salvar-rodada";
import { novaSemente } from "@/lib/aleatorio";
import { ajustarRitmo, estrelasPorTropecos, ritmoInicial, type Ritmo } from "@/lib/nivel";
import { gerarDesafio, type Desafio } from "@/lib/palavras";
import { lerProgresso, nivelDoJogo } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar, nomeDaLetra } from "@/lib/voz";

const TOTAL = 8;

type Estado = {
  fase: "abertura" | "jogando" | "fim";
  rodada: number;
  indice: number;
  desafio: Desafio | null;
  preenchidas: number;
  usadas: number[];
  erradas: string[];
  tremor: { alvo: string; vez: number } | null;
  erros: number;
  dica: number | null;
  resolvido: boolean;
  tropecos: number;
  vistas: string[];
  ritmo: Ritmo;
};

type Acao =
  | { tipo: "comecar"; nivel: number; semente: number }
  | { tipo: "letra"; letra: string }
  | { tipo: "peca"; id: number }
  | { tipo: "dica" }
  | { tipo: "proxima"; semente: number };

const inicial: Estado = {
  fase: "abertura",
  rodada: 0,
  indice: 0,
  desafio: null,
  preenchidas: 0,
  usadas: [],
  erradas: [],
  tremor: null,
  erros: 0,
  dica: null,
  resolvido: false,
  tropecos: 0,
  vistas: [],
  ritmo: ritmoInicial(1),
};

const novoDesafio = (e: Estado, d: Desafio): Estado => ({
  ...e,
  desafio: d,
  preenchidas: 0,
  usadas: [],
  erradas: [],
  tremor: null,
  erros: 0,
  dica: null,
  resolvido: false,
  vistas: [...e.vistas, d.palavra],
});

const errar = (e: Estado, alvo: string): Estado => ({
  ...e,
  erros: e.erros + 1,
  tropecos: e.tropecos + 1,
  tremor: { alvo, vez: (e.tremor?.vez ?? 0) + 1 },
});

const resolver = (e: Estado): Estado => ({ ...e, resolvido: true, dica: null, ritmo: ajustarRitmo(e.ritmo, e.erros === 0) });

function reducer(e: Estado, a: Acao): Estado {
  const d = e.desafio;
  switch (a.tipo) {
    case "comecar": {
      const base = { ...inicial, fase: "jogando" as const, rodada: e.rodada + 1, ritmo: ritmoInicial(a.nivel) };
      return novoDesafio(base, gerarDesafio(a.nivel, a.semente));
    }
    case "letra": {
      if (!d || d.modo !== "escolher" || e.resolvido || e.erradas.includes(a.letra)) return e;
      if (a.letra === d.palavra[d.oculta]) return resolver(e);
      return { ...errar(e, a.letra), erradas: [...e.erradas, a.letra] };
    }
    case "peca": {
      if (!d || d.modo !== "montar" || e.resolvido || e.usadas.includes(a.id)) return e;
      const peca = d.pecas.find((p) => p.id === a.id);
      if (!peca) return e;
      if (peca.letra !== d.palavra[e.preenchidas]) return errar(e, String(a.id));
      const preenchidas = e.preenchidas + 1;
      const proximo = { ...e, preenchidas, usadas: [...e.usadas, a.id], dica: null };
      return preenchidas >= [...d.palavra].length ? resolver(proximo) : proximo;
    }
    case "dica": {
      if (!d || d.modo !== "montar" || e.resolvido) return e;
      const certa = d.pecas.find((p) => !e.usadas.includes(p.id) && p.letra === d.palavra[e.preenchidas]);
      return certa ? { ...e, dica: certa.id, erros: e.erros + 1, tropecos: e.tropecos + 1 } : e;
    }
    case "proxima": {
      const indice = e.indice + 1;
      if (indice >= TOTAL) return { ...e, fase: "fim", indice };
      return novoDesafio({ ...e, indice }, gerarDesafio(e.ritmo.nivel, a.semente, e.vistas));
    }
  }
}

const pedido = (d: Desafio) => {
  const p = d.palavra.toLowerCase();
  if (d.modo === "montar") return `Escreva: ${p}`;
  return d.oculta === 0 ? `${p}! Com que letra começa ${p}?` : `${p}! Qual letra está faltando?`;
};

export function Palavras() {
  const [e, despachar] = useReducer(reducer, inicial);
  const { depois } = useDepois();
  const d = e.desafio;
  const estrelas = estrelasPorTropecos(e.tropecos, 1, 4);
  useSalvarRodada("palavras", e.fase === "fim" ? e.rodada : null, estrelas, e.ritmo.nivel);

  // Cada desafio novo é lido em voz alta (o primeiro espera a instrução da abertura terminar)
  const indice = e.indice;
  useEffect(() => {
    if (!d) return;
    const t = window.setTimeout(() => falar(pedido(d)), indice === 0 ? 2800 : 250);
    return () => window.clearTimeout(t);
  }, [d, indice]);

  const comecar = () => despachar({ tipo: "comecar", nivel: nivelDoJogo(lerProgresso(), "palavras"), semente: novaSemente() });

  const ganhou = (desafio: Desafio, extra: string) => {
    som.acerto();
    falar(`${extra}${desafio.palavra.toLowerCase()}! Muito bem!`);
    depois(1800, () => despachar({ tipo: "proxima", semente: novaSemente() }));
  };

  function tocarLetra(letra: string) {
    if (!d || d.modo !== "escolher" || e.resolvido || e.erradas.includes(letra)) return;
    despachar({ tipo: "letra", letra });
    if (letra === d.palavra[d.oculta]) ganhou(d, `${nomeDaLetra(letra)}! `);
    else {
      som.erro();
      falar(`Não é ${nomeDaLetra(letra)}. Tenta outra!`);
    }
  }

  function tocarPeca(id: number) {
    if (!d || d.modo !== "montar" || e.resolvido || e.usadas.includes(id)) return;
    const peca = d.pecas.find((p) => p.id === id);
    if (!peca) return;
    despachar({ tipo: "peca", id });
    if (peca.letra !== d.palavra[e.preenchidas]) {
      som.erro();
      return;
    }
    if (e.preenchidas + 1 >= [...d.palavra].length) ganhou(d, "");
    else som.pop();
  }

  return (
    <CascaJogo
      jogo="palavras"
      nivel={e.fase === "abertura" ? undefined : e.ritmo.nivel}
      passo={e.fase === "abertura" ? undefined : e.indice}
      total={e.fase === "abertura" ? undefined : TOTAL}
      aoOuvir={d ? () => falar(pedido(d), { sempre: true }) : undefined}
    >
      {e.fase === "abertura" || !d ? (
        <Abertura jogo="palavras" aoComecar={comecar} />
      ) : (
        <div key={e.indice} className="flex flex-1 animate-saltar flex-col items-center justify-center gap-5 py-2">
          <button
            type="button"
            onClick={() => falar(d.palavra.toLowerCase(), { sempre: true })}
            aria-label="Ouvir a palavra"
            className="relative grid size-36 place-items-center rounded-[2rem] border bg-card/90 text-7xl shadow-lg backdrop-blur transition hover:scale-105 active:scale-95 sm:size-44 sm:text-8xl"
          >
            <span className={cn(e.resolvido && "animate-flutuar")}>{d.emoji}</span>
            <span className="absolute -right-2 -bottom-2 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow">
              <Volume2 className="size-5" />
            </span>
          </button>

          <p className="text-center text-xl font-semibold text-balance">
            {d.modo === "montar" ? "Toque nas letras na ordem certa:" : d.oculta === 0 ? "Com que letra começa?" : "Qual letra está faltando?"}
          </p>

          <Casinhas e={e} d={d} />

          {d.modo === "escolher" ? (
            <div className="flex justify-center gap-3">
              {d.opcoes.map((letra) => {
                const errada = e.erradas.includes(letra);
                const tremendo = e.tremor?.alvo === letra;
                return (
                  <button
                    key={letra}
                    type="button"
                    disabled={errada || e.resolvido}
                    onClick={() => tocarLetra(letra)}
                    className={cn(
                      "grid size-20 place-items-center rounded-3xl border-2 border-primary/30 bg-card text-5xl font-bold shadow-[0_5px_0_0_var(--border)] transition active:translate-y-1 active:shadow-none sm:size-24",
                      errada && "opacity-30",
                      e.resolvido && letra === d.palavra[d.oculta] && "border-sucesso bg-sucesso text-white",
                    )}
                  >
                    <span key={tremendo ? e.tremor?.vez : 0} className={cn(tremendo && "animate-tremer")}>
                      {letra}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className="flex max-w-md flex-wrap justify-center gap-2">
                {d.pecas.map((p) => {
                  const usada = e.usadas.includes(p.id);
                  const tremendo = e.tremor?.alvo === String(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={usada || e.resolvido}
                      onClick={() => tocarPeca(p.id)}
                      aria-label={`Letra ${p.letra}`}
                      className={cn(
                        "grid size-14 place-items-center rounded-2xl border-2 border-primary/30 bg-card text-3xl font-bold shadow-[0_4px_0_0_var(--border)] transition active:translate-y-1 active:shadow-none",
                        usada && "invisible",
                        e.dica === p.id && "animate-pulsar border-ouro bg-ouro/30",
                      )}
                    >
                      <span key={tremendo ? e.tremor?.vez : 0} className={cn(tremendo && "animate-tremer text-destructive")}>
                        {p.letra}
                      </span>
                    </button>
                  );
                })}
              </div>
              <BotaoJogo
                cor="neutro"
                disabled={e.resolvido}
                onClick={() => {
                  const certa = d.pecas.find((p) => !e.usadas.includes(p.id) && p.letra === d.palavra[e.preenchidas]);
                  if (certa) falar(nomeDaLetra(certa.letra), { sempre: true });
                  despachar({ tipo: "dica" });
                }}
              >
                <Lightbulb /> Dica
              </BotaoJogo>
            </>
          )}
        </div>
      )}

      {e.fase === "fim" && (
        <TelaFinal
          estrelas={estrelas}
          detalhe={e.tropecos === 0 ? "Nenhum errinho! Você lê demais!" : `Você descobriu ${TOTAL} palavras mágicas.`}
          aoJogarDeNovo={comecar}
        />
      )}
    </CascaJogo>
  );
}

// As casinhas da palavra: letra escondida (escolher) ou letras sendo montadas (montar)
function Casinhas({ e, d }: { e: Estado; d: Desafio }) {
  const letras = [...d.palavra];
  const fonte = letras.length <= 5 ? "text-4xl" : letras.length <= 8 ? "text-3xl" : "text-2xl";
  return (
    <div className="flex w-full max-w-md justify-center gap-1 px-1" aria-live="polite">
      {letras.map((l, i) => {
        const escondida = d.modo === "escolher" ? i === d.oculta && !e.resolvido : i >= e.preenchidas;
        const aVez = d.modo === "montar" && i === e.preenchidas && !e.resolvido;
        const revelada = d.modo === "escolher" ? i === d.oculta && e.resolvido : i < e.preenchidas;
        return (
          <span
            key={i}
            className={cn(
              "grid aspect-[4/5] max-w-14 flex-1 place-items-center rounded-xl border-2 font-bold",
              fonte,
              escondida ? "border-dashed border-primary/40 bg-primary/5" : "border-transparent bg-card shadow",
              aVez && "border-solid border-primary ring-4 ring-primary/20",
              revelada && "text-sucesso",
              e.resolvido && "border-sucesso",
            )}
          >
            {escondida ? (
              d.modo === "escolher" ? <span className="animate-pulsar text-primary">?</span> : null
            ) : (
              <span className={cn(revelada && "animate-saltar")}>{l}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
