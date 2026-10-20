import Link from "next/link";
import { estiloBotaoJogo } from "@/components/botao-jogo";
import { Pipo } from "@/components/pipo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <Pipo humor="triste" className="size-32 animate-flutuar" />
      <h1 className="text-3xl font-bold">Ops! Esse planeta não existe</h1>
      <p className="max-w-sm text-muted-foreground">O Pipo procurou pela galáxia inteira e não achou essa página.</p>
      <Link href="/" className={estiloBotaoJogo({ tamanho: "lg", className: "mt-2" })}>
        Voltar pra galáxia 🚀
      </Link>
    </main>
  );
}
