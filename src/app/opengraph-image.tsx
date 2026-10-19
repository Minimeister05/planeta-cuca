import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem que aparece quando alguém compartilha o link (WhatsApp, X, Discord...)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0c0a12 0%, #1e1035 60%, #3b0d2e 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          {site.initial}
        </div>
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -2, marginTop: 40 }}>{site.name}</div>
        <div style={{ fontSize: 34, opacity: 0.75, marginTop: 16, maxWidth: 950, lineHeight: 1.3 }}>
          {site.description}
        </div>
      </div>
    ),
    size,
  );
}
