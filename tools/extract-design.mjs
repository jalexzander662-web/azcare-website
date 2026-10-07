// Re-extracts the Claude Design export into design-src/ (raw pieces) and public/img/ (images).
// Usage: node tools/extract-design.mjs "<AZ Care Mobile View.html>" [desktop.html]
// The MOBILE file nests the newer `homePage` bundle; that is the source of truth.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const [mobileFile, desktopFile] = process.argv.slice(2)
if (!mobileFile) {
  console.error('usage: node tools/extract-design.mjs <mobile.html> [desktop.html]')
  process.exit(1)
}

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'design-src')
const IMG = path.join(ROOT, 'public', 'img')

function tag(html, type) {
  const open = `<script type="${type}">`
  const i = html.indexOf(open)
  if (i < 0) return null
  return html.slice(i + open.length, html.indexOf('</script>', i))
}
function readBundle(html) {
  return {
    manifest: JSON.parse(tag(html, '__bundler/manifest')),
    template: JSON.parse(tag(html, '__bundler/template')),
    ext: JSON.parse(tag(html, '__bundler/ext_resources') || '[]'),
  }
}
function decode(entry) {
  let buf = Buffer.from(entry.data, 'base64')
  if (entry.compressed) buf = zlib.gunzipSync(buf)
  return buf
}
function write(rel, data) {
  const p = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, data)
  return p
}

function loadPage(file) {
  const outer = readBundle(fs.readFileSync(file, 'utf8'))
  const home = outer.ext.find((e) => e.id === 'homePage')
  // Mobile file wraps the page; the desktop file IS the page.
  return home ? readBundle(decode(outer.manifest[home.uuid]).toString('utf8')) : outer
}

const page = loadPage(mobileFile)
fs.mkdirSync(OUT, { recursive: true })

// uuid -> bytes for every manifest entry, uuid -> ext id
const byUuid = {}
for (const [uuid, entry] of Object.entries(page.manifest)) byUuid[uuid] = { mime: entry.mime, buf: decode(entry) }
const idByUuid = Object.fromEntries(page.ext.map((e) => [e.uuid, e.id]))

// --- template (uuids left in place; resolved by the later steps)
write('template.raw.html', page.template)

// --- scripts / html blobs by ext id or sniffed
for (const [uuid, { mime, buf }] of Object.entries(byUuid)) {
  if (mime.startsWith('font/') || mime === 'application/octet-stream' || mime.startsWith('image/')) continue
  const id = idByUuid[uuid] || uuid
  const head = buf.slice(0, 80).toString('utf8')
  let name
  if (id === './BookingForm.dc.html') name = 'BookingForm.dc.html'
  else if (head.includes('@ds-bundle')) name = 'ds-bundle.js'
  else if (head.includes('dc-runtime')) name = 'dc-runtime.js'
  else if (head.includes('react-dom')) name = 'react-dom.js'
  else if (head.includes('react.production')) name = 'react.js'
  else name = `other-${uuid}.${mime.includes('html') ? 'html' : 'js'}`
  write(name, buf)
}

// --- images. The design resolves `assets/<cat>/<name>.<ext>` via id = path.replace(/[^a-z0-9]/gi,'_').
// That mangling is lossy, so invert it by convention: assets_<cat>_<name_parts>_<ext> -> <cat>/<name-parts>.<ext>
// (every category in this export is a single word, names are kebab-case). Output is always .webp:
// the bytes are WebP regardless of the original extension (verified below).
const imageMap = {}
for (const { id, uuid } of page.ext) {
  const m = id.match(/^assets_([a-z0-9]+)_(.+)_(webp|png|jpe?g)$/)
  if (!m || !byUuid[uuid]) continue
  const [, cat, name, ext] = m
  const orig = `assets/${cat}/${name.replace(/_/g, '-')}.${ext}`
  const rel = `${cat}/${name.replace(/_/g, '-')}.webp`
  const dest = path.join(IMG, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, byUuid[uuid].buf)
  imageMap[orig] = '/img/' + rel
}
write('image-map.json', JSON.stringify(imageMap, null, 2))

// cross-check: every `<cat>/<name>.<ext>` literal in the design source must resolve to an extracted image
const scan = [page.template, ...Object.values(byUuid).filter((b) => b.mime.includes('javascript') || b.mime.includes('html')).map((b) => b.buf.toString('utf8'))].join('\n')
const unresolved = new Set()
for (const m of scan.matchAll(/\b(?:assets\/)?([a-z]+\/[a-z0-9][a-z0-9-]*\.(?:webp|png|jpe?g))\b/g)) {
  if (!imageMap['assets/' + m[1]]) unresolved.add(m[1])
}
console.log(`images: ${Object.keys(imageMap).length} written, ${unresolved.size} unresolved literals`, [...unresolved])

// --- sanity: every written image really is WebP
let bad = 0
for (const rel of Object.values(imageMap)) {
  const b = fs.readFileSync(path.join(ROOT, 'public', rel))
  if (b.slice(0, 4).toString() !== 'RIFF' || b.slice(8, 12).toString() !== 'WEBP') {
    bad++
    console.warn('NOT WEBP:', rel)
  }
}
console.log('non-webp:', bad)

if (desktopFile) {
  const d = loadPage(desktopFile)
  write('desktop.template.raw.html', d.template)
}
