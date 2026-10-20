"use client";

import Link from "next/link";
import { Ajustes } from "@/components/galaxia/ajustes";
import { Pipo } from "@/components/pipo";
import { pacotesParaAbrir, useProgresso } from "@/lib/progresso";
import { cn } from "@/lib/utils";

export function Cabecalho() {
  const p = useProgresso();
  const pacotes = pacotesParaAbrir(p);

  return (
    <header className="flex items-center gap-2 py-4">
      <Link href="/" className="mr-auto flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight whitespace-nowrap sm:text-2xl">
        <Pipo className="size-10 shrink-0" />
        Planeta Cuca
      </Link>
      <span
        className="flex h-11 items-center gap-1 rounded-full border border-border/60 bg-vidro px-3 font-semibold shadow-sm backdrop-blur"
        aria-label={`${p.estrelas} estrelas`}
      >
        <span aria-hidden>⭐</span> {p.estrelas}
      </span>
      <Link
        href="/album"
        aria-label={pacotes ? `Álbum de figurinhas: ${pacotes} pacotinho pra abrir` : "Álbum de figurinhas"}
        className="relative grid size-11 place-items-center rounded-full border border-border/60 bg-vidro text-xl shadow-sm backdrop-blur transition hover:scale-105"
      >
        <span aria-hidden className={cn(pacotes > 0 && "animate-balancar")}>
          {pacotes > 0 ? "🎁" : "📒"}
        </span>
        {pacotes > 0 && (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white">
            {pacotes}
          </span>
        )}
      </Link>
      <Ajustes />
    </header>
  );
}
