import { BoasVindas } from "@/components/galaxia/boas-vindas";
import { Cabecalho } from "@/components/galaxia/cabecalho";
import { CartaoAlbum } from "@/components/galaxia/cartao-album";
import { Trilha } from "@/components/galaxia/trilha";
import { Planeta } from "@/components/planeta";
import { jogos } from "@/lib/jogos";

const promessas = [
  { emoji: "🔒", titulo: "Sem cadastro e sem anúncios", texto: "Nada de login, propaganda ou coleta de dados. O progresso fica salvo só no aparelho." },
  { emoji: "📈", titulo: "Dificuldade que se adapta", texto: "Acertou 3 seguidas, o desafio sobe. Errou 2, ele desce. Ninguém fica entediado nem frustrado." },
  { emoji: "🗣️", titulo: "Narração em voz alta", texto: "As instruções são lidas em voz alta — dá pra jogar antes mesmo de saber ler." },
  { emoji: "📱", titulo: "Celular, tablet ou computador", texto: "Feito pra dedinhos: botões grandes, tudo funciona com toque e no tema claro ou escuro." },
];

// Com cacheComponents, new Date() solto quebra o prerender — "use cache" congela o ano no build
async function AnoAtual() {
  "use cache";
  return new Date().getFullYear();
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
      <Cabecalho />
      <BoasVindas />

      <main className="flex flex-1 flex-col gap-10 pb-12">
        <section className="pt-4 text-center sm:pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Aprender é uma{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">aventura espacial!</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl">
            Escolha um planeta e decole 🚀 Jogos de matemática, leitura, programação, cores e música pra crianças de 4 a 12 anos.
          </p>
        </section>

        <Trilha />
        <CartaoAlbum />

        <section aria-labelledby="pais" className="mt-6 space-y-6 rounded-[2rem] border bg-card/70 p-5 shadow-sm backdrop-blur sm:p-8">
          <div className="text-center">
            <h2 id="pais" className="text-2xl font-bold sm:text-3xl">
              Pra pais e professores
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Cada planeta treina uma habilidade de verdade, no ritmo de cada criança. E é grátis.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {jogos.map((jogo) => (
              <li key={jogo.id} className="flex gap-3 rounded-2xl bg-background/60 p-3">
                <Planeta jogo={jogo} tamanho="sm" />
                <div>
                  <h3 className="font-semibold">
                    {jogo.nome} <span className="text-sm font-normal text-muted-foreground">· {jogo.materia}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{jogo.ensina}</p>
                </div>
              </li>
            ))}
            <li className="flex gap-3 rounded-2xl bg-background/60 p-3">
              <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-orange-400 text-2xl">
                📒
              </span>
              <div>
                <h3 className="font-semibold">
                  Álbum de figurinhas <span className="text-sm font-normal text-muted-foreground">· Curiosidades</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  As estrelas viram figurinhas com fatos reais sobre animais, dinossauros, espaço, corpo humano e natureza.
                </p>
              </div>
            </li>
          </ul>

          <ul className="grid gap-4 sm:grid-cols-2">
            {promessas.map((p) => (
              <li key={p.titulo} className="flex gap-3">
                <span aria-hidden className="text-2xl">
                  {p.emoji}
                </span>
                <div>
                  <h3 className="font-semibold">{p.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{p.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        Feito com 💜 no Brasil · Planeta Cuca © <AnoAtual />
      </footer>
    </div>
  );
}
