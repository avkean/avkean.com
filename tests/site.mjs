import assert from 'node:assert/strict';
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
  assert.equal(count(html, /<style\b/gi), 0, `${page.file} must not ship style blocks`);
  assert.equal(count(html, /\sstyle="/gi), 0, `${page.file} must not ship inline styles`);
  assert.equal(count(html, /\son[a-z]+\s*=/gi), 0, `${page.file} must not ship event handlers`);
  assert.equal(count(html, /<!--/g), 0, `${page.file} must not contain comments`);
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /default-src 'none'/);
  assert.doesNotMatch(html, /unsafe-inline|unsafe-eval/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.equal(count(html, /<link\b[^>]*rel="canonical"/g), page.noindex ? 0 : 1);
  assert.equal(count(html, /name="robots" content="noindex"/g), page.noindex ? 1 : 0);
  assert.ok(stylesheets.length > 0, `${page.file} must use external CSS`);

  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/g) ?? [];
  for (const paragraph of paragraphs) {
    assert.doesNotMatch(paragraph, /[A-Za-z0-9)]<a\b/, `${page.file} must space links from text`);
    assert.doesNotMatch(paragraph, /<\/a>[A-Za-z0-9(]/, `${page.file} must space links from text`);
  }

  let pageBytes = Buffer.byteLength(html);
  const loadedAssets = new Set([
    ...stylesheets,
    ...(html.match(/<link\b[^>]*rel="icon"[^>]*href="([^"]+)"/)?.slice(1) ?? []),
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

assert.equal(count(home, /class="wordmark"/g), 1);
assert.equal(count(infra, /class="plate server /g), 3);
assert.equal(count(dn42, /class="plate node /g), 2);
assert.equal(count(mirrors, /class="plate address /g), 4);

const outputFiles = files(output);
assert.equal(
  outputFiles.some((file) => /\.(?:js|mjs)$/.test(file)),
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
  'public/favicon.svg',
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

console.log('production site checks passed');
