"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { figurinhas } from "@/lib/figurinhas";
import { estrelasNoPacote, pacotesParaAbrir, PRECO_PACOTE, useProgresso } from "@/lib/progresso";
import { cn } from "@/lib/utils";

export function CartaoAlbum() {
  const p = useProgresso();
  const pacotes = pacotesParaAbrir(p);
  const tem = p.figurinhas.length;

  return (
    <Link
      href="/album"
      className="group mx-auto flex w-full max-w-2xl items-center gap-4 rounded-[2rem] border bg-card/85 p-4 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl sm:p-5"
    >
      <span aria-hidden className={cn("grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-400 text-4xl shadow-inner", pacotes > 0 && "animate-balancar")}>
        {pacotes > 0 ? "🎁" : "📒"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold">Álbum de figurinhas</span>
        <span className="block text-sm text-muted-foreground">
          {pacotes > 0
            ? `Você tem ${pacotes} ${pacotes === 1 ? "pacotinho" : "pacotinhos"} pra abrir!`
            : `Cada ${PRECO_PACOTE} ⭐ viram um pacotinho com uma curiosidade nova.`}
        </span>
        <span className="mt-2 flex items-center gap-2">
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 transition-[width]"
              style={{ width: `${pacotes > 0 ? 100 : (estrelasNoPacote(p) / PRECO_PACOTE) * 100}%` }}
            />
          </span>
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
            {tem}/{figurinhas.length}
          </span>
        </span>
      </span>
      <ChevronRight className="size-6 shrink-0 text-muted-foreground transition group-hover:translate-x-1" />
    </Link>
  );
}
