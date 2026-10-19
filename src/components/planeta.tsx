import type { Jogo } from "@/lib/jogos";
import { cn } from "@/lib/utils";

const tamanhos = {
  sm: { caixa: "size-14", emoji: "text-2xl", anel: "border-[3px]" },
  md: { caixa: "size-28", emoji: "text-5xl", anel: "border-[5px]" },
  lg: { caixa: "size-36 sm:size-40", emoji: "text-6xl sm:text-7xl", anel: "border-[6px]" },
};

// Planeta desenhado só com CSS: gradiente, sombra de volume, crateras e anel opcional
export function Planeta({ jogo, tamanho = "md", className }: { jogo: Jogo; tamanho?: keyof typeof tamanhos; className?: string }) {
  const t = tamanhos[tamanho];
  const anel = cn("absolute inset-x-[-24%] top-1/2 h-[28%] -translate-y-1/2 -rotate-12 rounded-[50%] border-white/70 dark:border-white/45", t.anel);
  return (
    <div className={cn("relative shrink-0", t.caixa, className)}>
      {jogo.anel && <div aria-hidden className={anel} />}
      <div
        className={cn(
          "relative grid size-full place-items-center overflow-hidden rounded-full bg-gradient-to-br shadow-[inset_-10px_-12px_0_rgb(0_0_0/0.18),inset_8px_8px_0_rgb(255_255_255/0.28),0_12px_30px_-8px_rgb(0_0_0/0.35)]",
          jogo.planeta,
        )}
      >
        <span aria-hidden className="absolute top-[18%] left-[22%] size-[14%] rounded-full bg-black/10" />
        <span aria-hidden className="absolute right-[18%] bottom-[22%] size-[20%] rounded-full bg-black/10" />
        <span aria-hidden className="absolute bottom-[14%] left-[30%] size-[9%] rounded-full bg-white/20" />
        <span className={cn("relative drop-shadow-[0_3px_2px_rgb(0_0_0/0.25)]", t.emoji)}>{jogo.emoji}</span>
      </div>
      {/* metade da frente do anel passa por cima do planeta */}
      {jogo.anel && <div aria-hidden className={cn(anel, "[clip-path:inset(50%_0_0_0)]")} />}
    </div>
  );
}
