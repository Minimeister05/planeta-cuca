import { cn } from "@/lib/utils";

const cores = {
  primario: "bg-primary text-primary-foreground [--sombra:color-mix(in_oklch,var(--primary),black_38%)]",
  sucesso: "bg-sucesso text-white [--sombra:color-mix(in_oklch,var(--sucesso),black_38%)]",
  ouro: "bg-ouro text-amber-950 [--sombra:var(--ouro-escuro)]",
  neutro: "bg-card text-card-foreground [--sombra:color-mix(in_oklch,var(--border),black_18%)] border border-border",
};

const tamanhos = {
  md: "h-12 gap-2 rounded-2xl px-5 text-lg",
  lg: "h-16 gap-3 rounded-3xl px-10 text-2xl",
};

type Estilo = { cor?: keyof typeof cores; tamanho?: keyof typeof tamanhos; className?: string };

// Botão "fofinho" de jogo: borda de baixo mais escura que afunda quando aperta (serve pra <Link> também)
export const estiloBotaoJogo = ({ cor = "primario", tamanho = "md", className }: Estilo = {}) =>
  cn(
    "inline-flex items-center justify-center font-semibold shadow-[0_5px_0_0_var(--sombra)] transition-[translate,box-shadow,scale] outline-none select-none hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-ring/50 active:translate-y-1 active:shadow-[0_1px_0_0_var(--sombra)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em]",
    cores[cor],
    tamanhos[tamanho],
    className,
  );

export function BotaoJogo({ cor, tamanho, className, ...props }: React.ComponentProps<"button"> & Estilo) {
  return <button type="button" className={estiloBotaoJogo({ cor, tamanho, className })} {...props} />;
}
