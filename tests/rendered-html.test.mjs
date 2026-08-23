import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const noIndexMeta = /<meta(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex[^"']*nofollow[^"']*["'])[^>]*>/i;
const indexMeta = /<meta(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*index[^"']*follow[^"']*["'])[^>]*>/i;
const socialImageMeta = /<meta(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["'][^"']*\/og\.png["'])[^>]*>/i;
const canonicalMeta = /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/lh-photography\.github\.io\/?["'])[^>]*>/i;

test("renders the cleaner portfolio tabs, pricing, booking form and metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Chelmsford Photographer \| Louie Harrington Photography<\/title>/i);
  assert.match(html, /Moments,/i);
  assert.match(html, /honestly framed\./i);
  assert.match(html, /Selected work/i);
  assert.match(html, /City &amp; Architecture/i);
  assert.match(html, /Action &amp; Motorsport/i);
  assert.match(html, /Automotive/i);
  assert.match(html, /Football/i);
  assert.match(html, /Portraits/i);
  assert.match(html, /role="tablist"/i);
  assert.match(html, /Wedding coverage/i);
  assert.match(html, /From £45/i);
  assert.match(html, /One-hour car shoot/i);
  assert.match(html, /£25/i);
  assert.match(html, /Family or property photos/i);
  assert.match(html, /£30/i);
  assert.match(html, /Send booking request/i);
  assert.match(html, /class="booking-form"/i);
  assert.match(html, /louie_photography55/i);
  assert.match(html, /Chelmsford · Danbury · Essex/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /ProfessionalService/i);
  assert.match(html, /sports photographer Chelmsford/i);
  assert.doesNotMatch(html, /louieharrington28/i);
  assert.doesNotMatch(html, noIndexMeta);
  assert.match(html, indexMeta);
  assert.match(html, socialImageMeta);
  assert.match(html, canonicalMeta);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("serves crawlable robots and sitemap files", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("seo-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const robotsResponse = await worker.fetch(new Request("http://localhost/robots.txt"), env, ctx);
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/lh-photography\.github\.io\/sitemap\.xml/i);

  const sitemapResponse = await worker.fetch(new Request("http://localhost/sitemap.xml"), env, ctx);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>https:\/\/lh-photography\.github\.io\/<\/loc>/i);
});

test("includes every supplied photograph and the supplied logo", () => {
  const assets = [
    ...Array.from({ length: 14 }, (_, index) => `../public/photos/photo-${String(index + 1).padStart(2, "0")}.jpg`),
    "../public/photos/louie-portrait.jpg",
    "../public/photos/logo.jpg",
  ];

  for (const asset of assets) {
    assert.ok(statSync(new URL(asset, import.meta.url)).size > 10_000, `${asset} should contain a real image`);
  }
});

test("validates booking requests without exposing the recipient", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("api-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const invalid = await worker.fetch(new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "A", email: "not-an-email", service: "Wedding coverage", message: "Too short" }),
  }), env, ctx);
  assert.equal(invalid.status, 400);

  const honeypot = await worker.fetch(new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ website: "bot-filled-this" }),
  }), env, ctx);
  assert.equal(honeypot.status, 200);
});

test("keeps the booking provider key server-side", () => {
  const route = readFileSync(new URL("../app/api/enquiry/route.ts", import.meta.url), "utf8");
  const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

  assert.match(route, /https:\/\/api\.web3forms\.com\/submit/);
  assert.match(route, /process\.env\.WEB3FORMS_ACCESS_KEY/);
  assert.doesNotMatch(route, /formsubmit\.co/i);
  assert.match(envExample, /WEB3FORMS_ACCESS_KEY=replace-with-your-web3forms-access-key/);
  assert.doesNotMatch(
    route + envExample,
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  );
});
