const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const origin = (process.env.SITE_ORIGIN || 'https://expert-daune-rca.capitalboost.ro').replace(/\/$/, '');
if (!/^https:\/\/[^/\s]+$/.test(origin)) throw new Error('SITE_ORIGIN must be an HTTPS origin without a path.');
const indexable = process.env.INDEX_SITE === 'true';
const directories = ['assets','asiguratori','confidentialitate','contact','despre-noi','politica-cookies','resurse','servicii','termeni-si-conditii'];
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid output directory');
fs.rmSync(output, {recursive:true, force:true});
fs.mkdirSync(output);
for (const name of directories) fs.cpSync(path.join(root,name),path.join(output,name),{recursive:true});
for (const entry of fs.readdirSync(root,{withFileTypes:true})) {
  if(entry.isFile() && /\.(html|css|js|xml|txt)$/.test(entry.name)) fs.copyFileSync(path.join(root,entry.name),path.join(output,entry.name));
}
for(const name of ['_headers','_redirects']) fs.copyFileSync(path.join(root,'cloudflare',name),path.join(output,name));
let count=0;
function visit(dir) {
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()) visit(file);
  else if(/\.(html|xml)$/.test(entry.name)) {
   let text=fs.readFileSync(file,'utf8').replaceAll('https://expertdaunerca.ro',origin).replaceAll('https://expert-daune-rca.capitalboost.ro',origin);
   if(entry.name.endsWith('.html')) {
    const robots=indexable && entry.name!=='404.html'?'index, follow':'noindex, nofollow';
    text=text.replace(/<meta name="robots" content="[^"]*"\s*\/?>/g,`<meta name="robots" content="${robots}">`);
    count++;
   }
   fs.writeFileSync(file,text);
  }
 }
}
visit(output);
fs.writeFileSync(path.join(output,'robots.txt'),indexable?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
console.log(`Cloudflare build: ${count} HTML pages, origin ${origin}, indexing ${indexable?'enabled':'disabled'}. Output: dist`);
