// Configuração central do site — muda aqui e reflete no SEO, imagem de compartilhamento e páginas.
export const site = {
  name: "Planeta Cuca",
  description: "Jogos educativos divertidos de verdade para crianças de 4 a 12 anos: matemática, leitura, programação, cores e música. Grátis e sem cadastro.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  locale: "pt_BR",
  initial: "P",
};
