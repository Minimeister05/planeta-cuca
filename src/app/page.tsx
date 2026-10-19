import Link from "next/link";
import { ArrowRight, Globe, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

const recursos = [
  { icone: Zap, titulo: "Rápido", texto: "Carrega num piscar de olhos, no celular ou no computador." },
  { icone: Sparkles, titulo: "Bonito", texto: "Interface caprichada, com tema claro e escuro." },
  { icone: Globe, titulo: "Pronto pro mundo", texto: "SEO, imagem de compartilhamento e analytics já configurados." },
];

// Com cacheComponents, new Date() solto quebra o prerender — "use cache" congela o ano no build
async function AnoAtual() {
  "use cache";
  return new Date().getFullYear();
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* brilho de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-pink-500/25 blur-3xl"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white">
            {site.initial}
          </span>
          {site.name}
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <section className="flex flex-col items-center py-20 text-center sm:py-28">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Em construção — novidades chegando
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">{site.name}</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">{site.description}</p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" className="h-11 px-6 text-base" asChild>
              <Link href="#recursos">
                Começar agora <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-6 text-base" asChild>
              <Link href="#recursos">Saiba mais</Link>
            </Button>
          </div>
        </section>

        <section id="recursos" className="grid scroll-mt-8 gap-4 pb-24 sm:grid-cols-3">
          {recursos.map(({ icone: Icone, titulo, texto }) => (
            <div
              key={titulo}
              className="rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/5"
            >
              <Icone className="size-5 text-violet-500" />
              <h2 className="mt-4 font-semibold">{titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © <AnoAtual /> {site.name}
          </p>
          <p>Feito com ❤️ no Brasil</p>
        </div>
      </footer>
    </div>
  );
}
