# Expert Daune RCA

Site static: varianta Prototype aprobata, cu pagini de servicii, asiguratori, contact si resurse PDF.

## Cloudflare Pages

- Production branch: `main`
- Framework preset: None
- Build command: `node scripts/build-cloudflare.cjs`
- Build output directory: `dist`
- Root directory: radacina repository-ului
- Node.js: 22 sau mai nou

Variabile de build:

- `SITE_ORIGIN`: domeniul public, fara slash final. Implicit: `https://expertdaunerca.ro`.
- `INDEX_SITE`: implicit dezactivat. Seteaza `true` numai la lansarea versiunii care trebuie indexata.

Buildul actualizeaza canonical, metadatele sociale si sitemap pentru domeniul ales. Variantele de test raman noindex.

## Verificare locala

```sh
node scripts/build-cloudflare.cjs
```

Folderul `dist` poate fi incarcat manual in Cloudflare sau generat automat de Cloudflare dupa conectarea acestui repository.

## Formular

`api/` contine varianta PHP pentru hosting compatibil. Nu este inclusa in buildul Cloudflare, care nu executa PHP. Pana la configurarea serviciului de contact, formularul ramane dezactivat; telefonul si WhatsApp sunt disponibile.

## Continut

Paginile HTML sunt sursa activa. Arhivele, documentele clientului, capturile, logurile si serverul local `.preview` nu sunt versionate.
Imaginea sociala curenta: `assets/share-accident-expert-daune-rca.png`.

Nu sunt necesare pachete npm pentru build.
