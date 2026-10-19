import { lerProgresso } from "./progresso";

// Narração em voz alta (Web Speech API) — essencial pra quem ainda não sabe ler.
function escolherVoz() {
  const vozes = window.speechSynthesis.getVoices();
  const br = vozes.filter((v) => v.lang.replace("_", "-").toLowerCase() === "pt-br");
  return (
    br.find((v) => /natural|online|google|francisca|thalita/i.test(v.name)) ??
    br[0] ??
    vozes.find((v) => v.lang.toLowerCase().startsWith("pt")) ??
    null
  );
}

export const temVoz = () => typeof window !== "undefined" && "speechSynthesis" in window;

export function falar(texto: string, { sempre = false } = {}) {
  if (!temVoz() || (!sempre && !lerProgresso().voz)) return;
  try {
    const fala = window.speechSynthesis;
    fala.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = 0.95;
    u.pitch = 1.1;
    const voz = escolherVoz();
    if (voz) u.voice = voz;
    fala.speak(u);
  } catch {
    // navegador sem voz: segue o jogo só com texto
  }
}

export const calar = () => {
  if (temVoz()) window.speechSynthesis.cancel();
};

// Nome das letras do jeito que se fala (o leitor de voz às vezes lê "A" como artigo)
const NOMES: Record<string, string> = {
  A: "á", B: "bê", C: "cê", D: "dê", E: "é", F: "éfe", G: "gê", H: "agá", I: "i", J: "jota", K: "cá", L: "éle", M: "ême",
  N: "ene", O: "ó", P: "pê", Q: "quê", R: "érre", S: "ésse", T: "tê", U: "u", V: "vê", W: "dáblio", X: "xis", Y: "ípsilon", Z: "zê",
  Ç: "cê cedilha", Ã: "á com til", Õ: "ó com til", Á: "á com acento", É: "é com acento", Í: "i com acento", Ó: "ó com acento",
  Ú: "u com acento", Â: "á com chapéu", Ê: "ê com chapéu", Ô: "ô com chapéu",
};

export const nomeDaLetra = (letra: string) => NOMES[letra] ?? letra;
