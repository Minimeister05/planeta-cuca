# Planeta Cuca

Jogos educativos divertidos de verdade para crianças de 4 a 12 anos: matemática, leitura, lógica, cores e música. Grátis e sem cadastro.

## Rodando

```bash
npm install
cp .env.example .env.local   # e preencha os valores
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run check` | lint + checagem de tipos |
| `npm run build` | build de produção |
| `npm start` | roda o build de produção |

## Deploy

1. Sobe o código pro GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importa o repositório.
3. Coloca as variáveis do `.env.example` em **Settings → Environment Variables**.

## Checklist de lançamento

- [ ] Funciona no celular
- [ ] Título, descrição e imagem de compartilhamento (`src/lib/site.ts`)
- [ ] Favicon (`src/app/icon.tsx`)
- [ ] Analytics ligado no painel da Vercel
- [ ] Lighthouse verde
- [ ] Domínio + deploy na Vercel
- [ ] Mostrei pra alguém

---

Criado com `novo` 🚀
