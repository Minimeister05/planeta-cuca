import type { Metadata } from "next";
import { Album } from "@/components/album/album";

export const metadata: Metadata = {
  title: "Álbum de figurinhas",
  description: "Colecione figurinhas com curiosidades reais sobre animais, dinossauros, espaço, corpo humano e natureza.",
};

export default function Page() {
  return <Album />;
}
