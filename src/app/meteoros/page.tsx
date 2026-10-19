import type { Metadata } from "next";
import { Meteoros } from "@/components/jogos/meteoros";

export const metadata: Metadata = {
  title: "Chuva de Meteoros — jogo de matemática",
  description: "Jogo de matemática para crianças: conte, some, subtraia e use a tabuada para explodir meteoros. Grátis.",
};

export default function Page() {
  return <Meteoros />;
}
