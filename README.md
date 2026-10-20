# 🪐 Planeta Cuca

![Planeta Cuca — jogos educativos grátis pra crianças de 4 a 12 anos](src/app/opengraph-image.png)

Jogos educativos divertidos de verdade pra crianças de 4 a 12 anos: matemática, leitura, programação, cores e música. **Grátis, sem cadastro e sem anúncios.**

**▶ Jogar agora: https://minimeister05.github.io/planeta-cuca/**

O Pipo, um alienzinho de um olho só, guia a criança por uma galáxia onde cada planeta é um jogo. As estrelas ganhas viram pacotinhos de figurinhas com curiosidades reais.

## Os planetas

| Planeta | Matéria | O que treina |
| --- | --- | --- |
| ☄️ **Chuva de Meteoros** | Matemática | Contagem, soma, subtração, tabuada e divisão. Acerte a conta pra explodir o meteoro antes que ele caia. |
| 🤖 **Robô Perdido** | Programação | Sequência de comandos, planejamento, depuração e repetição. Monte o caminho com setas e leve o robô até a bateria. |
| 🔤 **Palavras Mágicas** | Leitura | Letra inicial, letra que falta e montar palavras inteiras, de GATO a BORBOLETA. |
| 🧪 **Laboratório de Cores** | Ciências | Cores primárias e secundárias, proporção e experimentação. Misture tintas até chegar na cor pedida. |
| 🎵 **Eco Musical** | Música e memória | Escute a melodia no xilofone e repita. Tem modo livre com músicas de domínio público. |
| 📒 **Álbum de figurinhas** | Curiosidades | 40 figurinhas com fatos sobre animais, dinossauros, espaço, corpo humano e natureza. |

## Como funciona

- **Dificuldade que se adapta:** cada jogo tem 9 níveis. A idade escolhida define o nível inicial; 3 acertos seguidos sobem um nível e 2 erros descem.
- **Narração em voz alta** (Web Speech API, pt-BR): dá pra jogar antes de saber ler.
- **Sons gerados na hora** com Web Audio, sem nenhum arquivo de áudio.
- **Sem login e sem coletar dados de criança:** o progresso (estrelas, níveis e figurinhas) fica só no `localStorage` do aparelho.
- **Feito pra dedinhos:** mobile primeiro, botões grandes, tema claro e escuro.

## Rodando

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000). Não precisa de nenhuma variável de ambiente.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run check` | lint + checagem de tipos |
| `npm run build` | build de produção |
| `npm start` | roda o build de produção |

## Deploy

**GitHub Pages (atual):** cada push no `main` publica sozinho pelo workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml). O **Source** do Pages (Settings → Pages) precisa estar em **GitHub Actions**. O site fica em https://minimeister05.github.io/planeta-cuca/

Pra testar a versão do Pages localmente: `PAGES_BASE_PATH=/planeta-cuca npm run build` gera a pasta `out/`.

**Vercel (alternativa):** importa o repositório em [vercel.com/new](https://vercel.com/new) e clica em Deploy, sem variável nenhuma. Com domínio próprio, coloca `NEXT_PUBLIC_SITE_URL` em **Settings → Environment Variables**.

## Stack

Next.js 16 (App Router) + TypeScript · Tailwind CSS 4 + shadcn/ui · next-themes · canvas-confetti · Vercel Analytics + Speed Insights.

Onde fica cada coisa e como criar um jogo novo: [`AGENTS.md`](AGENTS.md).

## Checklist de lançamento

- [ ] Testado num celular de verdade (voz e sons)
- [x] Título, descrição e imagem de compartilhamento
- [x] Favicon e ícone da Apple
- [ ] Analytics (o da Vercel não funciona no GitHub Pages)
- [ ] Lighthouse verde
- [x] Deploy no ar (GitHub Pages)
- [ ] Domínio próprio
- [ ] Mostrei pra uma criança
