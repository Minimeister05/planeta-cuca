import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-7xl font-bold tracking-tight text-muted-foreground/40">404</p>
      <h1 className="text-2xl font-semibold">Essa página não existe (ainda)</h1>
      <p className="max-w-sm text-muted-foreground">O link pode estar quebrado ou a página mudou de lugar.</p>
      <Button asChild>
        <Link href="/">Voltar pro início</Link>
      </Button>
    </main>
  );
}
