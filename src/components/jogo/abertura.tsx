"use client";

import { Play } from "lucide-react";
import { BotaoJogo } from "@/components/botao-jogo";
import { Estrelas } from "@/components/estrelas";
import { Planeta } from "@/components/planeta";
import { acharJogo, type JogoId } from "@/lib/jogos";
import { useProgresso } from "@/lib/progresso";
import { som } from "@/lib/som";
import { falar } from "@/lib/voz";

// Tela antes de começar: o toque em "Jogar" também destrava o som e a voz do navegador
export function Abertura({ jogo: id, aoComecar, children }: { jogo: JogoId; aoComecar: () => void; children?: React.ReactNode }) {
  const jogo = acharJogo(id);
  const recorde = useProgresso().recordes[id] ?? 0;

  return (
    <div className="flex flex-1 animate-saltar flex-col items-center justify-center gap-6 py-6 text-center">
      <Planeta jogo={jogo} tamanho="lg" className="animate-flutuar" />
      <div className="space-y-2">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">{jogo.materia}</span>
        <h2 className="text-4xl font-bold tracking-tight text-balance">{jogo.nome}</h2>
        <p className="mx-auto max-w-sm text-lg text-pretty text-muted-foreground">{jogo.instrucao}</p>
      </div>
      {recorde > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Seu recorde: <Estrelas n={recorde} className="text-xl" />
        </p>
      )}
      <BotaoJogo
        tamanho="lg"
        cor="sucesso"
        className="animate-pulsar"
        onClick={() => {
          som.pop();
          falar(jogo.instrucao);
          aoComecar();
        }}
      >
        <Play className="fill-current" /> Jogar!
      </BotaoJogo>
      {children}
    </div>
  );
}
