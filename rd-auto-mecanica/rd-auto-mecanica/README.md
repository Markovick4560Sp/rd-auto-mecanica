# RD Auto Mecânica · Site oficial

Site one-page da **RD Auto Mecânica**, oficina mecânica no Jardim São Cristóvão, em São Luís - MA.

Nacionais, importados e 4x4. Nota 5,0 no Google.

## Estrutura

```
rd-auto-mecanica/
├── index.html               # estrutura e conteúdo da página
├── README.md
├── .nojekyll                # faz o GitHub Pages servir os arquivos sem processar
└── assets/
    ├── css/
    │   └── style.css        # cores, layout, animações e responsividade
    ├── js/
    │   └── main.js          # preloader, faíscas, stories, galeria, formulário
    ├── img/                 # logo, fotos da oficina e artes do Instagram
    └── fonts/               # ícones Font Awesome (só os usados no site)
```

Sem build, sem dependências. Basta abrir o `index.html` no navegador.

> **Importante:** o `index.html` precisa ficar na **raiz** do repositório. Ao subir, entre na pasta `rd-auto-mecanica`, selecione tudo (Ctrl+A) e arraste. Não arraste a pasta de fora, e não suba o `.zip`: GitHub e Vercel não descompactam.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `rd-auto-mecanica`), **público**.
2. Envie os arquivos para a raiz do repositório:
   - **Pelo navegador:** em *Add file → Upload files*, entre na pasta `rd-auto-mecanica`, selecione **tudo** (Ctrl+A, inclusive a pasta `assets`), arraste e clique em *Commit changes*.
   - **Pelo terminal:**
     ```bash
     git init
     git add .
     git commit -m "Site RD Auto Mecânica"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/rd-auto-mecanica.git
     git push -u origin main
     ```
3. No repositório, vá em **Settings → Pages**.
4. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e clique em *Save*.
5. Em 1 a 2 minutos o site fica no ar em:
   `https://SEU-USUARIO.github.io/rd-auto-mecanica/`

### Domínio próprio (opcional)

1. Em **Settings → Pages → Custom domain**, digite o domínio (ex.: `rdautomecanica.com.br`) e salve.
2. No painel do domínio, crie um registro **CNAME** de `www` apontando para `SEU-USUARIO.github.io`.
3. Para o domínio sem `www`, crie registros **A** apontando para:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Depois de propagar, marque **Enforce HTTPS**.

## Onde editar

Abra o arquivo indicado e procure pelo termo (Ctrl+F):

| O que mudar | Arquivo | Procure por |
|---|---|---|
| WhatsApp / telefone | `index.html` e `assets/js/main.js` | `5598988233321` |
| Horário de funcionamento | `index.html` | `Segunda a sexta` e `HORÁRIO DE` (story) |
| Regra do selo "Aberto agora" | `assets/js/main.js` | `Status aberto/fechado` |
| Formas de pagamento | `index.html` | `Formas de pagamento` |
| Avaliações do Google | `assets/js/main.js` | `const avaliacoes` |
| Fotos da galeria (Instagram) | `assets/js/main.js` | `const posts` |
| Seguidores / posts do Instagram | `index.html` | `ig-counts` |
| Marcas atendidas | `assets/js/main.js` | `const marcas` |
| Cores da marca | `assets/css/style.css` | `--primary` |

Para trocar uma foto, salve a nova imagem em `assets/img/` com o mesmo nome da antiga.

## Créditos

- Fotos e artes: RD Auto Mecânica (Instagram [@rdautomecanicaslz](https://www.instagram.com/rdautomecanicaslz/)).
- Ícones: [Font Awesome Free](https://fontawesome.com) (licença em `assets/fonts/LICENSE-fontawesome.txt`).
- Fonte: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.
