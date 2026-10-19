import type { Metadata } from "next";
import { Robo } from "@/components/jogos/robo";

export const metadata: Metadata = {
  title: "Robô Perdido — programação para crianças",
  description: "Jogo de lógica e programação para crianças: monte uma sequência de comandos e leve o robô até a bateria. Grátis.",
};

export default function Page() {
  return <Robo />;
}
