import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Fileira de 3 estrelas (ganhas em dourado, o resto apagado)
export function Estrelas({ n, className, animar = false }: { n: number; className?: string; animar?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${n} de 3 estrelas`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={cn(
            animar && i === 1 ? "size-[1.3em] -translate-y-[0.2em]" : "size-[1em]",
            i < n ? "fill-ouro text-ouro-escuro" : "fill-muted text-muted-foreground/30",
            animar && "animate-saltar",
          )}
          style={animar ? { animationDelay: `${0.5 + i * 0.35}s` } : undefined}
        />
      ))}
    </span>
  );
}
