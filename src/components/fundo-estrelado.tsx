import { comSemente } from "@/lib/aleatorio";

// Estrelinhas sempre nas mesmas posições (semente fixa) → servidor e navegador desenham igual
const aleatorio = comSemente(0.42);
const estrelas = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: aleatorio() * 100,
  y: aleatorio() * 100,
  tamanho: 1.5 + aleatorio() * 2.5,
  atraso: aleatorio() * 4,
  duracao: 2 + aleatorio() * 3,
}));

export function FundoEstrelado() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(170deg,var(--ceu-1),var(--ceu-2)_55%,var(--ceu-3))]"
    >
      {/* nebulosas */}
      <div className="absolute -top-32 -left-24 size-96 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/15" />
      <div className="absolute top-1/3 -right-32 size-[28rem] rounded-full bg-sky-400/20 blur-3xl dark:bg-indigo-500/20" />
      <div className="absolute -bottom-40 left-1/4 size-96 rounded-full bg-amber-300/20 blur-3xl dark:bg-violet-500/15" />
      {estrelas.map((e) => (
        <span
          key={e.id}
          className="absolute animate-piscar rounded-full bg-(--brilho)"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            width: e.tamanho,
            height: e.tamanho,
            animationDelay: `${e.atraso}s`,
            animationDuration: `${e.duracao}s`,
          }}
        />
      ))}
    </div>
  );
}
