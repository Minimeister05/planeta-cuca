"use client";

import Link from "next/link";
import { Estrelas } from "@/components/estrelas";
import { Planeta } from "@/components/planeta";
import { jogos } from "@/lib/jogos";
import { useNoNavegador, useProgresso } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";

// Caminho tracejado ligando os planetas em zigue-zague (cada linha da grade tem 100 unidades de altura)
const caminho = jogos
  .slice(1)
  .map((_, i) => {
    const [x1, x2] = i % 2 === 0 ? [25, 75] : [75, 25];
    const y = 50 + i * 100;
    return `C${x1},${y + 50} ${x2},${y + 50} ${x2},${y + 100}`;
  })
  .join(" ");

export function Trilha() {
  const p = useProgresso();
  const noNavegador = useNoNavegador();

  return (
    <nav aria-label="Planetas-jogo" className="relative mx-auto w-full max-w-2xl">
      <svg
        aria-hidden
        viewBox={`0 0 100 ${jogos.length * 100}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full text-primary/40 dark:text-white/30"
      >
        <path d={`M25,50 ${caminho}`} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="relative">
        {jogos.map((jogo, i) => {
          const recorde = p.recordes[jogo.id] ?? 0;
          const esquerda = i % 2 === 0;
          return (
            <li key={jogo.id} className="h-44 sm:h-52">
              <Link
                href={`/${jogo.id}`}
                onClick={() => som.pop()}
                className={cn("group grid h-full grid-cols-2 items-center gap-2 outline-none", !esquerda && "[direction:rtl]")}
              >
                <div className="grid place-items-center">
                  <Planeta
                    jogo={jogo}
                    tamanho="lg"
                    className="animate-flutuar transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 group-active:scale-95"
                    style={{ animationDelay: `${i * -1.1}s` }}
                  />
                </div>
                <div className={cn("[direction:ltr]", esquerda ? "text-left" : "text-right")}>
                  <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">{jogo.materia}</span>
                  <h2 className="mt-1 text-xl leading-tight font-bold text-balance sm:text-2xl">{jogo.nome}</h2>
                  <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">{jogo.chamada}</p>
                  <div className={cn("mt-1.5 flex", !esquerda && "justify-end")}>
                    {noNavegador && recorde === 0 ? (
                      <span className="rounded-full bg-ouro/30 px-2 py-0.5 text-xs font-semibold">Novo! ✨</span>
                    ) : (
                      <Estrelas n={recorde} className="text-xl" />
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
