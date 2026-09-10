import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

const origin = process.env.SITE_ORIGIN ?? 'http://127.0.0.1:4410';
const securityHeaders = [
  'content-security-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'permissions-policy',
  'referrer-policy',
  'x-content-type-options',
  'x-frame-options',
];

function url(path) {
  return new URL(path, origin);
}

function checkSecurity(response) {
  for (const header of securityHeaders) {
    assert.ok(response.headers.has(header), `${response.url} must include ${header}`);
  }
  assert.equal(response.headers.has('server'), false);
}

async function request(path, options) {
  const response = await fetch(url(path), options);
  checkSecurity(response);
  return response;
}

for (const path of ['/', '/infra/', '/dn42/', '/mirrors/']) {
  const response = await request(path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^text\/html/);
  assert.equal(response.headers.get('cache-control'), 'no-cache');
}

const home = await request('/');
assert.equal(home.headers.has('strict-transport-security'), false);
const html = await home.text();
const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
assert.ok(stylesheet);

const asset = await request(stylesheet);
assert.equal(asset.status, 200);
assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable');

const missingPath = '/not-found?source=http-test';
const missing = await request(missingPath);
assert.equal(missing.status, 404);
assert.match(await missing.text(), /<h1>404<\/h1>/);
assert.match(missing.headers.get('onion-location') ?? '', /\/not-found\?source=http-test$/);
assert.match(missing.headers.get('x-i2p-location') ?? '', /\/not-found\?source=http-test$/);

const sitemap = await request('/sitemap.xml?source=http-test');
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('content-type') ?? '', /xml/);
assert.equal(sitemap.headers.get('cache-control'), 'no-cache');
assert.match(sitemap.headers.get('onion-location') ?? '', /\/sitemap\.xml\?source=http-test$/);

const pgp = await request('/pgp.asc');
assert.equal(pgp.status, 200);
assert.equal(pgp.headers.get('content-type'), 'text/plain; charset=utf-8');

const forwarded = await request('/', { headers: { 'X-Forwarded-Proto': 'https' } });
assert.equal(forwarded.headers.get('strict-transport-security'), 'max-age=31536000');

const forwardedMissing = await request('/not-found?source=hsts-test', {
  headers: { 'X-Forwarded-Proto': 'https' },
});
assert.equal(forwardedMissing.status, 404);
assert.equal(forwardedMissing.headers.get('strict-transport-security'), 'max-age=31536000');


const www = await new Promise((resolve, reject) => {
  const target = url('/dn42/?source=www-test');
  const send = target.protocol === 'https:' ? httpsRequest : httpRequest;
  const req = send(target, { headers: { Host: 'www.avkean.com' } }, (response) => {
    response.resume();
    resolve(response);
  });
  req.on('error', reject);
  req.end();
});
assert.equal(www.statusCode, 301);
assert.equal(www.headers.location, 'https://avkean.com/dn42/?source=www-test');

console.log('production HTTP checks passed');
