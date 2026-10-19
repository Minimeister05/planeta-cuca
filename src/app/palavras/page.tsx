import type { Metadata } from "next";
import { Palavras } from "@/components/jogos/palavras";

export const metadata: Metadata = {
  title: "Palavras Mágicas — jogo de alfabetização",
  description: "Jogo de leitura para crianças: descubra a letra inicial, complete e monte palavras ouvindo a pronúncia. Grátis.",
};

export default function Page() {
  return <Palavras />;
}
