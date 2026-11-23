# Expert Daune RCA

Site static: varianta Prototype aprobata, cu pagini de servicii, asiguratori, contact si resurse PDF.

## Cloudflare Pages
 
## Publicare cPanel

In Git Version Control: Update from Remote, apoi Deploy HEAD Commit.
`.cpanel.yml` ruleaza `scripts/deploy-cpanel.sh`, fara Node.js pe hosting.
Destinatie: `/home2/expertdaunerca/public_html`.
Deploy-ul activeaza indexarea (echivalentul `INDEX_SITE=true`) si publica robots.txt cu sitemap.
Pagina 404 ramane noindex. Sursa locala ramane pentru preview.
Backup-ul directorului public anterior se salveaza in `/home2/expertdaunerca/site-backups`.
Fisierele existente care nu sunt suprascrise sunt pastrate.

## Configurare Cloudflare Pages

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

## Contact

Contactarea se face prin telefon sau WhatsApp. Site-ul nu include formular de contact sau backend pentru trimiterea solicitarilor.

## Continut

Paginile HTML sunt sursa activa. Arhivele, documentele clientului, capturile, logurile si serverul local `.preview` nu sunt versionate.
Imaginea sociala curenta: `assets/share-accident-expert-daune-rca.png`.

Nu sunt necesare pachete npm pentru build.
