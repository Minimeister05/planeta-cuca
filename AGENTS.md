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
- `src/app/` — páginas (App Router). `opengraph-image.tsx`, `icon.tsx` e `apple-icon.tsx` geram as imagens por código
- `src/components/ui/` — componentes shadcn. Adicione com `npx shadcn@latest add <componente>`

## Regras
- Textos da interface em pt-BR. Mobile primeiro. Tudo tem que ficar bom no tema claro **e** escuro.
- Use os componentes shadcn e as cores do tema (`bg-background`, `text-muted-foreground`...) em vez de cores fixas.
- Segredos só no `.env.local` (nunca commitado). Variável nova → documente no `.env.example`.
- Antes de dizer que terminou: `npm run check` e `npm run build` passando.

## Comandos
- `npm run dev` — servidor local em http://localhost:3000
- `npm run check` — lint + checagem de tipos
- `npm run build` — build de produção
