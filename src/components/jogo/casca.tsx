"use client";

import Link from "next/link";
import { ArrowLeft, AudioLines, Volume2, VolumeX } from "lucide-react";
import { acharJogo, type JogoId } from "@/lib/jogos";
import { alternarSom, useProgresso } from "@/lib/progresso";
import { cn } from "@/lib/utils";

export const botaoRedondo =
  "grid size-11 shrink-0 place-items-center rounded-full border border-border/60 bg-vidro shadow-sm backdrop-blur transition hover:scale-105 active:scale-95 [&_svg]:size-5";

// Moldura de todos os jogos: voltar, nome, nível, barra de progresso e botões de som/voz
export function CascaJogo({
  jogo: id,
  nivel,
  passo,
  total,
  aoOuvir,
  children,
  className,
}: {
  jogo: JogoId;
  nivel?: number;
  passo?: number;
  total?: number;
  aoOuvir?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const jogo = acharJogo(id);
  const p = useProgresso();
  const mostrarProgresso = total !== undefined && passo !== undefined;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-3 pb-4 sm:px-6">
      <header className="flex items-center gap-2 py-3">
        <Link href="/" aria-label="Voltar pra galáxia" className={botaoRedondo}>
          <ArrowLeft />
        </Link>
        <div className="min-w-0 flex-1 px-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg leading-tight font-semibold">
              <span aria-hidden>{jogo.emoji}</span> {jogo.nome}
            </h1>
            {nivel !== undefined && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">Nível {nivel}</span>
            )}
          </div>
          {mostrarProgresso && (
            <div
              className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={passo}
              aria-label="Progresso da rodada"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 transition-[width] duration-500"
                style={{ width: `${(passo / total) * 100}%` }}
              />
            </div>
          )}
        </div>
        {aoOuvir && (
          <button type="button" onClick={aoOuvir} aria-label="Ouvir de novo" className={botaoRedondo}>
            <AudioLines />
          </button>
        )}
        <button
          type="button"
          onClick={alternarSom}
          aria-label={p.som ? "Desligar sons" : "Ligar sons"}
          aria-pressed={p.som}
          className={cn(botaoRedondo, !p.som && "text-muted-foreground")}
        >
          {p.som ? <Volume2 /> : <VolumeX />}
        </button>
      </header>
      <main className={cn("relative flex flex-1 flex-col", className)}>{children}</main>
    </div>
  );
}
