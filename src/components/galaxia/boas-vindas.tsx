"use client";

import { IDADES } from "@/components/galaxia/ajustes";
import { Pipo } from "@/components/pipo";
import { definirIdade, useNoNavegador, useProgresso } from "@/lib/progresso";
import { som } from "@/lib/som";
import { falar } from "@/lib/voz";

// Primeira visita: o Pipo pergunta a idade pra acertar a dificuldade
export function BoasVindas() {
  const p = useProgresso();
  const noNavegador = useNoNavegador();
  if (!noNavegador || p.idade !== null) return null;

  return (
    <div className="fixed inset-0 z-50 grid animate-in place-items-center overflow-y-auto bg-background/60 p-4 backdrop-blur-sm fade-in" role="dialog" aria-modal aria-labelledby="boas-vindas">
      <div className="w-full max-w-sm animate-saltar rounded-[2rem] border bg-card p-6 text-center shadow-2xl">
        <Pipo humor="uau" className="mx-auto -mt-16 size-28 animate-flutuar" />
        <h2 id="boas-vindas" className="mt-2 text-2xl font-bold text-balance">
          Oi! Eu sou o Pipo 👋
        </h2>
        <p className="mt-1 text-lg">Quantos anos você tem?</p>
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {IDADES.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                som.pop();
                definirIdade(i);
                falar("Oba! Escolha um planeta e vamos decolar!");
              }}
              className="h-16 rounded-2xl border-2 border-primary/25 bg-primary/10 text-3xl font-bold text-primary shadow-[0_4px_0_0_color-mix(in_oklch,var(--primary),transparent_70%)] transition hover:scale-105 active:translate-y-1 active:shadow-none"
            >
              {i}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Só serve pra ajustar a dificuldade e fica guardado neste aparelho. Dá pra mudar depois nos ajustes ⚙️</p>
      </div>
    </div>
  );
}
