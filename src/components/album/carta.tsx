import { categorias, nomeRaridade, type Figurinha } from "@/lib/figurinhas";
import { cn } from "@/lib/utils";

const moldura = {
  comum: "border-white/90 dark:border-white/70",
  rara: "border-slate-200 shadow-[0_0_0_2px_rgb(148_163_184),0_0_18px_rgb(186_230_253/0.7)]",
  lendaria: "border-amber-200 shadow-[0_0_0_3px_rgb(245_158_11),0_0_26px_rgb(251_191_36/0.8)]",
};

// Uma figurinha do álbum: fundo da categoria, emoji grandão, nome e brilho conforme a raridade
export function Carta({ f, grande = false, nova = false, className }: { f: Figurinha; grande?: boolean; nova?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border-4 bg-gradient-to-br shadow-md",
        categorias[f.categoria].fundo,
        moldura[f.raridade],
        grande && "rounded-3xl border-[6px]",
        className,
      )}
    >
      {f.raridade !== "comum" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.55)_45%,transparent_60%)] bg-[length:200%_100%] [animation:brilho-raro_2.6s_linear_infinite]",
            f.raridade === "lendaria" && "bg-[linear-gradient(110deg,transparent_25%,rgb(253_230_138/0.75)_45%,transparent_65%)] [animation-duration:1.8s]",
          )}
        />
      )}
      <span className={cn("grid flex-1 place-items-center drop-shadow-[0_4px_4px_rgb(0_0_0/0.25)]", grande ? "text-8xl" : "text-4xl sm:text-5xl")}>{f.emoji}</span>
      <span className={cn("relative bg-white/85 px-1 py-1 text-center leading-tight font-bold text-slate-800", grande ? "text-xl" : "truncate text-xs sm:text-sm")}>
        {f.nome}
      </span>
      {f.raridade !== "comum" && (
        <span
          className={cn(
            "absolute top-1 left-1 rounded-full px-1.5 text-[0.65rem] font-bold uppercase",
            f.raridade === "rara" ? "bg-slate-100 text-slate-700" : "bg-amber-300 text-amber-950",
            grande && "top-2 left-2 px-2.5 py-0.5 text-sm",
          )}
        >
          {grande ? nomeRaridade[f.raridade] : f.raridade === "rara" ? "Rara" : "★"}
        </span>
      )}
      {nova && <span className="absolute top-1 right-1 animate-pulsar rounded-full bg-rose-500 px-1.5 text-[0.65rem] font-bold text-white">NOVA!</span>}
    </div>
  );
}
