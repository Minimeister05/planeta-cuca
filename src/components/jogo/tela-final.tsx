"use client";

import { useEffect } from "react";
import Link from "next/link";
import { House, RotateCcw } from "lucide-react";
import { BotaoJogo, estiloBotaoJogo } from "@/components/botao-jogo";
import { Estrelas } from "@/components/estrelas";
import { Pipo } from "@/components/pipo";
import { estrelasNoPacote, pacotesParaAbrir, PRECO_PACOTE, useProgresso } from "@/lib/progresso";
import { som } from "@/lib/som";
import { falar } from "@/lib/voz";

const frases = ["", "Boa! Treinando, você fica craque!", "Muito bem! Mandou bem demais!", "Incrível! Você é um gênio!"];

export async function soltarConfete(forte = true) {
  const { default: confete } = await import("canvas-confetti");
  const cores = ["#fbbf24", "#f472b6", "#a78bfa", "#34d399", "#60a5fa"];
  confete({ particleCount: forte ? 140 : 60, spread: 90, origin: { y: 0.6 }, colors: cores, disableForReducedMotion: true });
  if (forte) {
    window.setTimeout(() => {
      confete({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: cores, disableForReducedMotion: true });
      confete({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: cores, disableForReducedMotion: true });
    }, 350);
  }
}

// Fim de rodada: estrelas aparecendo uma a uma, confete e o convite pro álbum
export function TelaFinal({ estrelas, detalhe, aoJogarDeNovo }: { estrelas: number; detalhe: string; aoJogarDeNovo: () => void }) {
  const p = useProgresso();
  const pacotes = pacotesParaAbrir(p);
  const faltam = PRECO_PACOTE - estrelasNoPacote(p);

  useEffect(() => {
    som.vitoria();
    const timers = Array.from({ length: estrelas }, (_, i) => window.setTimeout(() => som.estrela(i), 600 + i * 350));
    void soltarConfete(estrelas >= 2);
    falar(frases[estrelas]);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [estrelas]);

  return (
    <div className="fixed inset-0 z-50 grid animate-in place-items-center overflow-y-auto bg-background/50 p-4 backdrop-blur-sm fade-in">
      <div className="w-full max-w-sm animate-saltar rounded-[2rem] border bg-card p-6 text-center shadow-2xl">
        <Pipo humor="uau" className="mx-auto -mt-16 size-24 animate-flutuar" />
        <h2 className="mt-2 text-3xl font-bold">Missão cumprida!</h2>
        <Estrelas n={estrelas} animar className="mt-4 text-6xl" />
        <p className="mt-3 text-lg font-medium">{frases[estrelas]}</p>
        <p className="text-muted-foreground">{detalhe}</p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-ouro/25 px-3 py-1 font-semibold">
          +{estrelas} <span aria-hidden>⭐</span>
          <span className="sr-only">estrelas</span>
        </p>

        {pacotes > 0 ? (
          <Link
            href="/album"
            className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-dashed border-ouro bg-ouro/15 p-3 text-left transition hover:scale-[1.02]"
          >
            <span aria-hidden className="animate-balancar text-4xl">
              🎁
            </span>
            <span>
              <span className="block font-semibold">
                {pacotes === 1 ? "Você tem 1 pacotinho!" : `Você tem ${pacotes} pacotinhos!`}
              </span>
              <span className="text-sm text-muted-foreground">Toque pra abrir no álbum de figurinhas</span>
            </span>
          </Link>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Faltam {faltam} ⭐ pro próximo pacotinho de figurinhas.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/" onClick={() => som.clique()} className={estiloBotaoJogo({ cor: "neutro", className: "w-full" })}>
            <House /> Galáxia
          </Link>
          <BotaoJogo
            className="w-full"
            onClick={() => {
              som.pop();
              aoJogarDeNovo();
            }}
          >
            <RotateCcw /> De novo
          </BotaoJogo>
        </div>
      </div>
    </div>
  );
}
