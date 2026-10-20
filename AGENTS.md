<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Planeta Cuca

Jogos educativos divertidos de verdade para crianças de 4 a 12 anos: matemática, leitura, lógica, cores e música. Grátis e sem cadastro.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui + lucide-react
- next-themes (claro/escuro)
- Vercel Analytics + Speed Insights

## Onde fica o quê
- `src/lib/site.ts` — nome, descrição e URL do site (SEO, imagem de compartilhamento, sitemap)
- `src/lib/jogos.ts` — catálogo dos 5 planetas-jogo (ordem = ordem da trilha na galáxia)
- `src/lib/<jogo>.ts` — lógica pura de cada jogo (`meteoros`, `robo`, `palavras`, `cores`, `musica`): geradores de fase por nível 1–9
- `src/components/jogos/<jogo>.tsx` — tela de cada jogo (useReducer puro; sorteios só nos cliques via `novaSemente()`)
- `src/components/jogo/` — moldura comum: `CascaJogo` (cabeçalho), `Abertura`, `TelaFinal` (estrelas + confete)
- `src/lib/progresso.ts` — estrelas, recordes, níveis, figurinhas, som/voz (localStorage, sem login)
- `src/lib/nivel.ts` — dificuldade adaptativa (3 acertos sobe, 2 erros desce)
- `src/lib/figurinhas.ts` — figurinhas do álbum com curiosidades (confira o fato antes de adicionar!)
- `src/lib/som.ts` (Web Audio, sem arquivos) · `src/lib/voz.ts` (narração pt-BR) · `src/lib/marca.ts` (Pipo em SVG pras imagens geradas)
- `src/app/` — páginas (App Router). `opengraph-image.tsx`, `icon.tsx` e `apple-icon.tsx` geram as imagens por código
- `src/components/ui/` — componentes shadcn. Adicione com `npx shadcn@latest add <componente>`

## Jogo novo
1. Lógica em `src/lib/<id>.ts`, tela em `src/components/jogos/<id>.tsx` usando `CascaJogo`, `Abertura`, `TelaFinal` e `useSalvarRodada`.
2. Registra em `src/lib/jogos.ts` e cria `src/app/<id>/page.tsx` com título e descrição pro SEO.
3. Testa nos níveis 1, 5 e 9, no celular e nos dois temas.

## Regras
- Público: crianças de 4 a 12 anos. Botões grandes, textos curtos, tudo narrado com `falar()`. Nada de coletar dado de criança.
- Textos da interface em pt-BR. Mobile primeiro. Tudo tem que ficar bom no tema claro **e** escuro.
- Use os componentes shadcn e as cores do tema (`bg-background`, `text-muted-foreground`...) em vez de cores fixas.
- Segredos só no `.env.local` (nunca commitado). Variável nova → documente no `.env.example`.
- Antes de dizer que terminou: `npm run check` e `npm run build` passando.

## Comandos
- `npm run dev` — servidor local em http://localhost:3000
- `npm run check` — lint + checagem de tipos
- `npm run build` — build de produção
