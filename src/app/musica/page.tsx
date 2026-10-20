import type { Metadata } from "next";
import { Musica } from "@/components/jogos/musica";

export const metadata: Metadata = {
  title: "Eco Musical — jogo de música e memória",
  description: "Jogo musical para crianças: escute a melodia no xilofone e toque igual. Treina memória, atenção e as notas musicais. Grátis.",
};

export default function Page() {
  return <Musica />;
}
