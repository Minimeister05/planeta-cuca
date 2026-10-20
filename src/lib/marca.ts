// O Pipo em SVG puro, pra usar nas imagens geradas (ícone e imagem de compartilhamento)
const pipoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 124">
<defs><radialGradient id="c" cx="40%" cy="35%" r="75%"><stop offset="0%" stop-color="#d9f99d"/><stop offset="55%" stop-color="#84cc16"/><stop offset="100%" stop-color="#3f8f1a"/></radialGradient></defs>
<path d="M60 30 Q58 18 64 9" stroke="#4d7c0f" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="64" cy="8" r="6" fill="#fbbf24"/>
<ellipse cx="42" cy="112" rx="11" ry="7" fill="#4d7c0f"/><ellipse cx="78" cy="112" rx="11" ry="7" fill="#4d7c0f"/>
<circle cx="60" cy="68" r="44" fill="url(#c)"/>
<circle cx="60" cy="58" r="19" fill="#fff"/><circle cx="62" cy="59" r="9" fill="#1e1b4b"/><circle cx="66" cy="54" r="3.5" fill="#fff"/>
<ellipse cx="32" cy="78" rx="7" ry="4.5" fill="#f472b6" opacity="0.55"/><ellipse cx="88" cy="78" rx="7" ry="4.5" fill="#f472b6" opacity="0.55"/>
<path d="M47 86 Q60 99 73 86" stroke="#1e1b4b" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

export const pipoDataUri = `data:image/svg+xml,${encodeURIComponent(pipoSvg)}`;

export const fundoMarca = "linear-gradient(135deg, #312e81 0%, #6d28d9 55%, #db2777 100%)";

// Fonte Fredoka (a mesma do site) pras imagens geradas. Sem internet no build, cai na fonte padrão.
export async function fonteFredoka(texto: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Fredoka:wght@600&text=${encodeURIComponent(texto)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return [];
    const data = await (await fetch(url)).arrayBuffer();
    return [{ name: "Fredoka", data, weight: 600 as const, style: "normal" as const }];
  } catch {
    return [];
  }
}
