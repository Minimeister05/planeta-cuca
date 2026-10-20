import type { Metadata } from "next";
import { Cores } from "@/components/jogos/cores";

export const metadata: Metadata = {
  title: "Laboratório de Cores — jogo de ciências",
  description: "Jogo de cores para crianças: misture tintas primárias e descubra laranja, verde, roxo, rosa e muito mais. Grátis.",
};

export default function Page() {
  return <Cores />;
}
