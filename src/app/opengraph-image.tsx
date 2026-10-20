import { ImageResponse } from "next/og";
import { jogos } from "@/lib/jogos";
import { fonteFredoka, fundoMarca, pipoDataUri } from "@/lib/marca";
import { site } from "@/lib/site";

export const alt = `${site.name} — jogos educativos grátis pra crianças`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cores dos planetas (as mesmas da galáxia, em hex porque aqui não tem Tailwind)
const planetas = [
  { x: 820, y: 70, r: 120, cor: "linear-gradient(135deg, #fdba74, #fb7185, #e11d48)", anel: false },
  { x: 1010, y: 230, r: 90, cor: "linear-gradient(135deg, #7dd3fc, #06b6d4, #1d4ed8)", anel: true },
  { x: 800, y: 330, r: 100, cor: "linear-gradient(135deg, #bef264, #10b981, #0f766e)", anel: false },
  { x: 990, y: 440, r: 75, cor: "linear-gradient(135deg, #f9a8d4, #d946ef, #7e22ce)", anel: true },
  { x: 1090, y: 70, r: 55, cor: "linear-gradient(135deg, #fef08a, #fbbf24, #ea580c)", anel: false },
];

const estrelas = Array.from({ length: 40 }, (_, i) => ({ x: (i * 131) % 1200, y: (i * 197) % 630, r: 2 + (i % 3) }));

// Imagem que aparece quando alguém compartilha o link (WhatsApp, X, Discord...)
export default async function OpengraphImage() {
  const subtitulo = "Jogos educativos grátis pra crianças de 4 a 12 anos";
  const fonts = await fonteFredoka(site.name + subtitulo + jogos.map((j) => j.materia).join(""));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: fundoMarca, color: "white", fontFamily: "Fredoka" }}>
        {estrelas.map((e, i) => (
          <div key={i} style={{ position: "absolute", left: e.x, top: e.y, width: e.r, height: e.r, borderRadius: 99, background: "rgba(255,255,255,0.8)" }} />
        ))}
        {planetas.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.r * 2, height: p.r * 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 999, background: p.cor, boxShadow: "inset -18px -20px 0 rgba(0,0,0,0.18), 0 20px 50px rgba(0,0,0,0.35)" }} />
            {p.anel && (
              <div
                style={{
                  position: "absolute",
                  width: p.r * 3,
                  height: p.r * 0.7,
                  borderRadius: 999,
                  border: `${Math.round(p.r / 12)}px solid rgba(255,255,255,0.75)`,
                  transform: "rotate(-14deg)",
                }}
              />
            )}
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 760 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pipoDataUri} width={170} height={176} alt="" />
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -2, marginTop: 18, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 38, marginTop: 18, lineHeight: 1.25, opacity: 0.92 }}>{subtitulo}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            {jogos.map((j) => (
              <div key={j.id} style={{ display: "flex", fontSize: 24, padding: "8px 18px", borderRadius: 999, background: "rgba(255,255,255,0.18)" }}>
                {j.materia}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
