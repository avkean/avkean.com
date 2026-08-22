import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const pages = [
  { file: 'index.html', current: 'home' },
  { file: 'infra/index.html', current: 'infra' },
  { file: 'dn42/index.html', current: 'dn42' },
  { file: 'mirrors/index.html', current: 'mirrors' },
  { file: '404.html', current: null, noindex: true },
];

const count = (value, pattern) => value.match(pattern)?.length ?? 0;
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });

function localTarget(href) {
  if (href === '/') return join(output, 'index.html');
  const path = href.replace(/^\//, '');
  return href.endsWith('/') ? join(output, path, 'index.html') : join(output, path);
}

for (const page of pages) {
  const path = join(output, page.file);
  assert.ok(existsSync(path), `${page.file} must exist`);
  const html = readFileSync(path, 'utf8');
  const links = html.match(/<link\b[^>]*>/g) ?? [];
  const stylesheets = links
    .filter((link) => attribute(link, 'rel') === 'stylesheet')
    .map((link) => attribute(link, 'href'));
  const icons = links.filter((link) => attribute(link, 'rel') === 'icon');
  const shortcutIcons = links.filter((link) => attribute(link, 'rel') === 'shortcut icon');
  const touchIcons = links.filter((link) => attribute(link, 'rel') === 'apple-touch-icon');
  const nav = html.match(/<nav\b[^>]*class="site-nav"[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? '';

  assert.equal(count(html, /<h1\b/g), 1, `${page.file} must have one h1`);
  assert.equal(count(html, /<main\b/g), 1, `${page.file} must have one main`);
  assert.equal(count(html, /<nav\b[^>]*class="site-nav"/g), 1, `${page.file} must have one primary nav`);
  assert.equal(count(nav, /<a\b/g), 4, `${page.file} must have four navigation links`);
  assert.equal(
    count(nav, /aria-current="page"/g),
    page.current ? 1 : 0,
    `${page.file} must mark the correct navigation state`,
  );
  if (page.current) {
    assert.match(
      nav,
      new RegExp(
        `aria-current="page"[^>]*>\\s*${page.current}\\s*<|>\\s*${page.current}\\s*<[^>]*aria-current="page"`,
      ),
      `${page.file} must mark ${page.current}`,
    );
  }
  assert.match(html, /<a\b[^>]*class="skip-link"[^>]*href="#main"/);
  assert.match(html, /<main\b[^>]*id="main"[^>]*tabindex="-1"/);
  assert.equal(count(html, /<script\b/gi), 0, `${page.file} must not ship scripts`);
  assert.equal(count(html, /rel="modulepreload"/gi), 0, `${page.file} must not preload scripts`);
  assert.equal(count(html, /<style\b/gi), 0, `${page.file} must not ship style blocks`);
  assert.equal(count(html, /\sstyle="/gi), 0, `${page.file} must not ship inline styles`);
  assert.equal(count(html, /\son[a-z]+\s*=/gi), 0, `${page.file} must not ship event handlers`);
  assert.equal(count(html, /<!--/g), 0, `${page.file} must not contain comments`);
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /default-src 'none'/);
  assert.match(html, /script-src 'none'/);
  assert.doesNotMatch(html, /unsafe-inline|unsafe-eval/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.equal(count(html, /<link\b[^>]*rel="canonical"/g), page.noindex ? 0 : 1);
  assert.equal(count(html, /name="robots" content="noindex"/g), page.noindex ? 1 : 0);
  assert.ok(stylesheets.length > 0, `${page.file} must use external CSS`);
  assert.equal(icons.length, 2, `${page.file} must include 16px and 32px PNG favicons`);
  assert.equal(attribute(icons[0], 'href'), '/favicon-32x32.png');
  assert.equal(attribute(icons[0], 'sizes'), '32x32');
  assert.equal(attribute(icons[1], 'href'), '/favicon-16x16.png');
  assert.equal(attribute(icons[1], 'sizes'), '16x16');
  assert.equal(shortcutIcons.length, 1, `${page.file} must include an ICO fallback`);
  assert.equal(attribute(shortcutIcons[0], 'href'), '/favicon.ico');
  assert.equal(touchIcons.length, 1, `${page.file} must include an Apple touch icon`);
  assert.equal(attribute(touchIcons[0], 'href'), '/apple-touch-icon.png');
  assert.equal(attribute(touchIcons[0], 'sizes'), '180x180');

  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/g) ?? [];
  for (const paragraph of paragraphs) {
    assert.doesNotMatch(paragraph, /[A-Za-z0-9)]<a\b/, `${page.file} must space links from text`);
    assert.doesNotMatch(paragraph, /<\/a>[A-Za-z0-9(]/, `${page.file} must space links from text`);
  }

  let pageBytes = Buffer.byteLength(html);
  const loadedAssets = new Set([
    ...stylesheets,
    ...icons.map((icon) => attribute(icon, 'href')),
    ...shortcutIcons.map((icon) => attribute(icon, 'href')),
    ...touchIcons.map((icon) => attribute(icon, 'href')),
    ...[...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map((match) => match[1]),
  ]);
  for (const href of loadedAssets) {
    const stylesheet = localTarget(href);
    assert.ok(existsSync(stylesheet), `${href} must exist`);
    if (!href.endsWith('.woff2')) pageBytes += statSync(stylesheet).size;
  }
  assert.ok(pageBytes <= 25_600, `${page.file} must stay within 25KB`);

  const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (reference.startsWith('#')) {
      assert.match(html, new RegExp(`\\bid="${reference.slice(1)}"`));
      continue;
    }
    if (!reference.startsWith('/')) continue;
    const [href, fragment] = reference.split('#');
    const target = localTarget(href);
    assert.ok(existsSync(target), `${page.file} links to missing ${href}`);
    if (fragment && target.endsWith('.html')) {
      assert.match(readFileSync(target, 'utf8'), new RegExp(`\\bid="${fragment}"`));
    }
  }

  const blankLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  for (const link of blankLinks) {
    assert.match(link, /\brel="[^"]*\bnoopener\b[^"]*"/);
  }
}

const home = readFileSync(join(output, 'index.html'), 'utf8');
const infra = readFileSync(join(output, 'infra/index.html'), 'utf8');
const dn42 = readFileSync(join(output, 'dn42/index.html'), 'utf8');
const mirrors = readFileSync(join(output, 'mirrors/index.html'), 'utf8');

const wordmark = home.match(
  /<div class="wordmark" aria-hidden="true" data-nosnippet>([\s\S]*?)<\/div>/,
)?.[0];
assert.ok(wordmark);
assert.doesNotMatch(wordmark, /<(?:svg|canvas)\b/);
const wordmarkGlyphs = [
  ...wordmark.matchAll(/<pre class="(wm-[avner])">([\s\S]*?)<\/pre>/g),
].map(([, name, pattern]) => [name, pattern]);
assert.deepEqual(wordmarkGlyphs, [
  ['wm-a', ' aaa\na   a\na   a\naaaaa\na   a\na   a\na   a'],
  ['wm-v', 'v   v\nv   v\nv   v\nv   v\nv   v\n v v\n  v'],
  ['wm-n', 'n   n\nnn  n\nnn  n\nn n n\nn  nn\nn  nn\nn   n'],
  ['wm-e', 'eeeee\ne\ne\neeee\ne\ne\neeeee'],
  ['wm-r', 'rrrr\nr   r\nr   r\nrrrr\nr r\nr  r\nr   r'],
]);
assert.match(home, /<h1 class="sr-only">avner<\/h1><div class="wordmark"/);
assert.match(
  home,
  /<meta name="description" content="I build software and work on security, systems, and networks\. I like understanding things properly\.">/,
);
assert.match(home, /<p class="alias"><span data-nosnippet>\(or avkean\)<\/span><\/p>/);
assert.match(home, /<section class="contact" data-nosnippet>/);
const services = infra.match(/<ul class="service-list">([\s\S]*?)<\/ul>/)?.[0];
assert.ok(services);
assert.equal(count(services, /<li>/g), 6);
assert.match(services, /<h3>SearXNG<\/h3>/);
assert.match(services, /href="https:\/\/searxng\.avkean\.com\/"/);
assert.match(
  services,
  /href="http:\/\/lyybdkn77b44vcqp7rc3fbcdgugzm7ygsce2mthjyztqhbjpdfqmt2qd\.onion"/,
);
assert.match(
  infra,
  /<meta name="description" content="What Avner runs: Forgejo, SearXNG, Matrix, Tor, dn42, and supporting infrastructure\.">/,
);
assert.equal(count(infra, /class="plate server /g), 2);
assert.doesNotMatch(infra, /<h3>us1<\/h3>|<p>Oregon<\/p>/);
assert.equal(count(dn42, /class="plate node /g), 2);
assert.equal(count(mirrors, /class="plate address /g), 4);

const outputFiles = files(output);
assert.equal(
  outputFiles.some((file) => /\.(?:js|mjs|cjs)$/.test(file)),
  false,
  'dist must not contain JavaScript',
);

const stylesheets = outputFiles.filter((file) => file.endsWith('.css'));
const fontAssets = new Set();
for (const stylesheet of stylesheets) {
  const css = readFileSync(stylesheet, 'utf8');
  for (const match of css.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/g)) {
    const asset = match[1].startsWith('/') ? localTarget(match[1]) : join(dirname(stylesheet), match[1]);
    assert.ok(existsSync(asset), `${stylesheet} references missing ${match[1]}`);
    if (asset.endsWith('.woff2')) fontAssets.add(asset);
  }
}
assert.equal(fontAssets.size, 2);

const sitemap = outputFiles
  .filter((file) => file.endsWith('.xml'))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');
for (const route of ['/', '/infra/', '/dn42/', '/mirrors/']) {
  assert.match(sitemap, new RegExp(`<loc>https://avkean\\.com${route}</loc>`));
}
assert.doesNotMatch(sitemap, /\/404/);

const commentFree = [
  '.dockerignore',
  '.gitignore',
  'astro.config.mjs',
  'Caddyfile.site',
  'Dockerfile',
  'docker-compose.yml',
  'i2p/i2pd.conf',
  'i2p/tunnels.conf',
  'public/robots.txt',
  'src/layouts/Base.astro',
  'src/components/Wordmark.astro',
  'src/pages/index.astro',
  'src/pages/infra.astro',
  'src/pages/dn42.astro',
  'src/pages/mirrors.astro',
  'src/pages/404.astro',
  'src/styles/fonts.css',
  'src/styles/site.css',
  'tor/.dockerignore',
  'tor/Dockerfile',
  'tor/entrypoint.sh',
  'tor/torrc',
];

for (const file of commentFree) {
  const value = readFileSync(join(root, file), 'utf8');
  assert.doesNotMatch(value, /<!--/g, `${file} must not contain comments`);
  if (/\.(?:astro|css|mjs|js)$/.test(file)) {
    assert.doesNotMatch(value, /\/\*/g, `${file} must not contain comments`);
  }
  assert.equal(
    value.split('\n').some((line) => line.trimStart().startsWith('//')),
    false,
    `${file} must not contain comments`,
  );
  assert.equal(
    value
      .split('\n')
      .some((line, index) => line.trimStart().startsWith('#') && !(index === 0 && line.startsWith('#!'))),
    false,
    `${file} must not contain comments`,
  );
}

const dockerfile = readFileSync(join(root, 'Dockerfile'), 'utf8');
const torDockerfile = readFileSync(join(root, 'tor/Dockerfile'), 'utf8');
const compose = readFileSync(join(root, 'docker-compose.yml'), 'utf8');
const dockerignore = readFileSync(join(root, '.dockerignore'), 'utf8');
const torDockerignore = readFileSync(join(root, 'tor/.dockerignore'), 'utf8');
const caddy = readFileSync(join(root, 'Caddyfile.site'), 'utf8');
const siteCss = readFileSync(join(root, 'src/styles/site.css'), 'utf8');

assert.match(
  siteCss,
  /\.server-list\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);\s*\}/,
);
assert.equal(count(dockerfile, /^FROM .*@sha256:[a-f0-9]{64}/gm), 2);
assert.equal(count(torDockerfile, /^FROM .*@sha256:[a-f0-9]{64}/gm), 1);
assert.match(dockerfile, /RUN caddy validate --config \/etc\/caddy\/Caddyfile --adapter caddyfile/);
assert.match(dockerfile, /USER 65534:65534/);
assert.match(compose, /purplei2p\/i2pd:[^\s]+@sha256:[a-f0-9]{64}/);
assert.equal(count(compose, /^\s+read_only: true$/gm), 3);
assert.equal(count(compose, /^\s+cap_drop:$/gm), 3);
assert.equal(count(compose, /^\s+- no-new-privileges:true$/gm), 3);
assert.match(compose, /\/var\/lib\/tor:rw,noexec,nosuid,nodev/);
assert.equal(dockerignore.split('\n')[0], '*');
assert.doesNotMatch(dockerignore, /!i2p\/keys|!tor\/keys/);
assert.equal(torDockerignore.split('\n')[0], '*');
assert.doesNotMatch(torDockerignore, /!keys/);
assert.match(caddy, /handle_errors\s*\{[\s\S]*import security_headers/);
assert.match(caddy, /@tls_proxy header X-Forwarded-Proto https/);
assert.match(caddy, /Strict-Transport-Security "max-age=31536000"/);
assert.match(caddy, /@immutable path \/_astro\/\*/);
assert.match(caddy, /@mutable not path \/_astro\/\*/);
assert.match(caddy, /script-src 'none'/);
const faviconHashes = new Map([
  ['public/favicon.ico', '778a18e27cc1a4618669eda77a070980f25b63fbd465095df0d520090c47dea9'],
  ['public/favicon-16x16.png', '7b6d42a2851b8b2165ee44f8fcfec1e711a32a1b08ed9d7353c639a4a0175548'],
  ['public/favicon-32x32.png', '072cff08a17334a56179c85fbacc4da7a1ce78a4b1aa5ad8103ad9c6a33cb52f'],
  ['public/apple-touch-icon.png', '9974ae6b9cc150e1f0b0ce613c016e401741350691b3118b45c24e034cffe13b'],
]);
for (const [file, hash] of faviconHashes) assert.equal(sha256(join(root, file)), hash);
assert.match(siteCss, /grid-template-columns: repeat\(5, 5ch\)/);
assert.match(siteCss, /font-variant-ligatures: none/);
assert.match(siteCss, /--mono: "Commit Mono", ui-monospace, Menlo, Consolas, monospace/);
const wordmarkPreRule = siteCss.match(/\.wordmark pre\s*\{[^}]*\}/)?.[0] ?? '';
assert.doesNotMatch(wordmarkPreRule, /\bcolor\s*:/);

console.log('production site checks passed');
