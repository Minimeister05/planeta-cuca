"use client";

import { useState } from "react";
import { Monitor, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { botaoRedondo } from "@/components/jogo/casca";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { alternarSom, alternarVoz, apagarTudo, definirIdade, useNoNavegador, useProgresso } from "@/lib/progresso";
import { cn } from "@/lib/utils";
import { temVoz } from "@/lib/voz";

export const IDADES = [4, 5, 6, 7, 8, 9, 10, 11, 12];

const TEMAS = [
  { id: "light", nome: "Claro", Icone: Sun },
  { id: "dark", nome: "Escuro", Icone: Moon },
  { id: "system", nome: "Auto", Icone: Monitor },
];

// Ajustes pros pais: idade, som, narração, tema e apagar o progresso
export function Ajustes() {
  const p = useProgresso();
  const noNavegador = useNoNavegador();
  const { theme, setTheme } = useTheme();
  const [confirmando, setConfirmando] = useState(false);

  return (
    <Dialog onOpenChange={() => setConfirmando(false)}>
      <DialogTrigger aria-label="Ajustes" className={botaoRedondo}>
        <Settings />
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto rounded-3xl p-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Ajustes</DialogTitle>
          <DialogDescription>Tudo fica salvo só neste aparelho. Sem cadastro, sem coletar dados.</DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="font-semibold">Idade da criança</h3>
          <p className="text-sm text-muted-foreground">Define a dificuldade inicial. Depois os jogos se ajustam sozinhos.</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
            {IDADES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => definirIdade(i)}
                aria-pressed={p.idade === i}
                className={cn(
                  "h-11 rounded-xl border bg-card font-semibold transition hover:scale-105",
                  p.idade === i && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="flex items-center justify-between gap-3">
            <span>
              <span className="block font-semibold">Sons e músicas</span>
              <span className="text-sm text-muted-foreground">Efeitos dos jogos</span>
            </span>
            <Switch checked={p.som} onCheckedChange={alternarSom} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>
              <span className="block font-semibold">Narração em voz alta</span>
              <span className="text-sm text-muted-foreground">
                {noNavegador && !temVoz() ? "Este navegador não tem voz" : "Lê as instruções pra quem ainda não lê"}
              </span>
            </span>
            <Switch checked={p.voz} onCheckedChange={alternarVoz} />
          </label>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">Tema</h3>
          <div className="grid grid-cols-3 gap-2">
            {TEMAS.map(({ id, nome, Icone }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                aria-pressed={noNavegador && theme === id}
                className={cn(
                  "flex h-11 items-center justify-center gap-1.5 rounded-xl border bg-card text-sm font-medium transition hover:scale-105",
                  noNavegador && theme === id && "border-primary bg-primary text-primary-foreground",
                )}
              >
                <Icone className="size-4" /> {nome}
              </button>
            ))}
          </div>
        </section>

        <section className="border-t pt-4">
          <button
            type="button"
            onClick={() => {
              if (!confirmando) return setConfirmando(true);
              apagarTudo();
              setConfirmando(false);
            }}
            className={cn(
              "w-full rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10",
              confirmando && "bg-destructive text-white hover:bg-destructive/90",
            )}
          >
            {confirmando ? "Tem certeza? Toque de novo pra apagar tudo" : "Apagar estrelas e figurinhas"}
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
