"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AudioLines } from "lucide-react";
import { Carta } from "@/components/album/carta";
import { BotaoJogo, estiloBotaoJogo } from "@/components/botao-jogo";
import { botaoRedondo } from "@/components/jogo/casca";
import { soltarConfete } from "@/components/jogo/tela-final";
import { Pipo } from "@/components/pipo";
import { useDepois } from "@/hooks/use-depois";
import { categorias, figurinhas, nomeRaridade, type Categoria, type Figurinha } from "@/lib/figurinhas";
import { abrirPacote, estrelasNoPacote, marcarVista, pacotesParaAbrir, PRECO_PACOTE, useProgresso } from "@/lib/progresso";
import { som } from "@/lib/som";
import { cn } from "@/lib/utils";
import { falar } from "@/lib/voz";

type Mostrando = { f: Figurinha; etapa: "pacote" | "carta"; nova: boolean };

export function Album() {
  const p = useProgresso();
  const { depois } = useDepois();
  const [mostrando, setMostrando] = useState<Mostrando | null>(null);
  const pacotes = pacotesParaAbrir(p);
  const tem = new Set(p.figurinhas);
  const completo = tem.size === figurinhas.length;

  function abrir() {
    const f = abrirPacote();
    if (!f) return;
    som.pop();
    setMostrando({ f, etapa: "pacote", nova: true });
    depois(1100, () => {
      setMostrando({ f, etapa: "carta", nova: true });
      som.revelar();
      if (f.raridade !== "comum") void soltarConfete(f.raridade === "lendaria");
      falar(`${f.raridade === "comum" ? "" : f.raridade === "rara" ? "Uma figurinha rara! " : "Uau, uma figurinha lendária! "}${f.nome}! ${f.fato}`);
    });
  }

  function ver(f: Figurinha) {
    som.clique();
    if (p.novas.includes(f.id)) marcarVista(f.id);
    setMostrando({ f, etapa: "carta", nova: false });
    falar(`${f.nome}! ${f.fato}`);
  }

  function fechar() {
    if (mostrando?.nova) marcarVista(mostrando.f.id);
    setMostrando(null);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pb-10 sm:px-6">
      <header className="flex items-center gap-2 py-3">
        <Link href="/" aria-label="Voltar pra galáxia" className={botaoRedondo}>
          <ArrowLeft />
        </Link>
        <h1 className="flex-1 text-xl font-bold">Álbum de figurinhas</h1>
        <span className="rounded-full border border-border/60 bg-vidro px-3 py-1.5 text-sm font-semibold backdrop-blur">
          {tem.size}/{figurinhas.length}
        </span>
      </header>

      {/* pacotinhos */}
      <section className="mt-2 rounded-[2rem] border bg-card/85 p-5 text-center shadow-lg backdrop-blur">
        {completo ? (
          <>
            <p className="text-5xl">🏆</p>
            <h2 className="mt-2 text-2xl font-bold">Álbum completo!</h2>
            <p className="text-muted-foreground">Você colecionou todas as {figurinhas.length} figurinhas. Que explorador!</p>
          </>
        ) : pacotes > 0 ? (
          <>
            <button type="button" onClick={abrir} aria-label="Abrir pacotinho" className="group mx-auto block">
              <span aria-hidden className="block animate-balancar text-8xl transition group-hover:scale-110 group-active:scale-95">
                🎁
              </span>
            </button>
            <h2 className="mt-2 text-2xl font-bold">
              {pacotes === 1 ? "Você tem 1 pacotinho!" : `Você tem ${pacotes} pacotinhos!`}
            </h2>
            <BotaoJogo cor="ouro" tamanho="lg" className="mt-4" onClick={abrir}>
              Abrir!
            </BotaoJogo>
          </>
        ) : (
          <div className="flex items-center gap-4 text-left">
            <Pipo className="size-20 shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-bold">Quer mais figurinhas?</h2>
              <p className="text-sm text-muted-foreground">
                Cada {PRECO_PACOTE} ⭐ que você ganha nos jogos viram um pacotinho. Faltam {PRECO_PACOTE - estrelasNoPacote(p)} ⭐!
              </p>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500"
                  style={{ width: `${(estrelasNoPacote(p) / PRECO_PACOTE) * 100}%` }}
                />
              </div>
              <Link href="/" className={estiloBotaoJogo({ className: "mt-3 h-10 px-4 text-base" })}>
                Jogar 🚀
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* coleção por categoria */}
      {(Object.keys(categorias) as Categoria[]).map((c) => {
        const daCategoria = figurinhas.filter((f) => f.categoria === c);
        const quantas = daCategoria.filter((f) => tem.has(f.id)).length;
        return (
          <section key={c} className="mt-8" aria-labelledby={`cat-${c}`}>
            <h2 id={`cat-${c}`} className="mb-3 flex items-baseline justify-between text-lg font-bold">
              {categorias[c].nome}
              <span className="text-sm font-medium text-muted-foreground">
                {quantas}/{daCategoria.length}
              </span>
            </h2>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {daCategoria.map((f) => (
                <li key={f.id}>
                  {tem.has(f.id) ? (
                    <button type="button" onClick={() => ver(f)} className="block w-full transition hover:-rotate-2 hover:scale-105" aria-label={`Ver ${f.nome}`}>
                      <Carta f={f} nova={p.novas.includes(f.id)} />
                    </button>
                  ) : (
                    <div className="grid aspect-[3/4] place-items-center rounded-2xl border-2 border-dashed border-foreground/15 bg-foreground/5 text-3xl font-bold text-foreground/20">
                      <span aria-label="Figurinha que falta">?</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {mostrando && (
        <div
          className="fixed inset-0 z-50 grid animate-in place-items-center overflow-y-auto bg-background/70 p-4 backdrop-blur-md fade-in"
          role="dialog"
          aria-modal
          aria-label={mostrando.etapa === "carta" ? mostrando.f.nome : "Abrindo pacotinho"}
          onClick={(ev) => ev.target === ev.currentTarget && mostrando.etapa === "carta" && fechar()}
        >
          {mostrando.etapa === "pacote" ? (
            <span aria-hidden className="animate-tremer text-[9rem] [animation-iteration-count:3]">
              🎁
            </span>
          ) : (
            <div className="flex w-full max-w-xs flex-col items-center text-center">
              <div className="w-56 [perspective:800px]">
                <Carta f={mostrando.f} grande className={cn(mostrando.nova && "[animation:virar-carta_0.7s_ease-out_both]")} />
              </div>
              <p className="mt-4 text-sm font-semibold text-muted-foreground">
                {categorias[mostrando.f.categoria].nome} · {nomeRaridade[mostrando.f.raridade]}
              </p>
              <p className="mt-2 text-lg font-medium text-balance">{mostrando.f.fato}</p>
              <div className="mt-5 flex gap-2">
                <BotaoJogo cor="neutro" aria-label="Ouvir de novo" onClick={() => falar(`${mostrando.f.nome}! ${mostrando.f.fato}`, { sempre: true })}>
                  <AudioLines />
                </BotaoJogo>
                <BotaoJogo onClick={fechar}>{mostrando.nova ? "Guardar no álbum" : "Fechar"}</BotaoJogo>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
