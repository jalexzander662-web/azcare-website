// One-time local image optimizer. Run with: npm run optimize-images
//
// Walks public/ and, for every raster image, resizes it down to a sane max
// dimension and re-encodes it as WebP (originals are deleted). favicon.png is
// kept as PNG for browser/apple-touch compatibility. sharp is a devDependency
// only — this never runs inside the Docker/nginx production image.
import { readFile, writeFile, unlink, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const RASTER = /\.(png|jpe?g)$/i

// Resize target (longest edge) by where the image is used. Cards/gallery render
// at most ~800px CSS wide even at 2x DPR, so 1600px is generous headroom.
function maxEdgeFor(relPath) {
  const lower = relPath.toLowerCase()
  if (lower.endsWith('website cover.png')) return 1920 // full-bleed hero
  if (lower.includes('human faces/') || lower.includes('logos/')) return 256 // avatars + icons
  return 1600
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const kb = (n) => (n / 1024).toFixed(1).padStart(8) + ' KB'

const rows = []
let beforeTotal = 0
let afterTotal = 0

for await (const file of walk(publicDir)) {
  const rel = path.relative(publicDir, file).split(path.sep).join('/')
  const base = path.basename(file)
  const beforeSize = (await stat(file)).size

  // favicon stays PNG, just shrink + recompress.
  if (base.toLowerCase() === 'favicon.png') {
    const input = await readFile(file)
    const out = await sharp(input)
      .resize({ width: 180, height: 180, fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80, palette: true, compressionLevel: 9 })
      .toBuffer()
    await writeFile(file, out)
    rows.push([rel + ' (png)', beforeSize, out.length])
    beforeTotal += beforeSize
    afterTotal += out.length
    continue
  }

  if (!RASTER.test(file)) continue

  const isIcon = rel.toLowerCase().includes('human faces/') || rel.toLowerCase().includes('logos/')
  const input = await readFile(file)
  const out = await sharp(input)
    .resize({ width: maxEdgeFor(rel), height: maxEdgeFor(rel), fit: 'inside', withoutEnlargement: true })
    .webp({ quality: isIcon ? 80 : 78, effort: 5 })
    .toBuffer()

  const webpPath = file.replace(RASTER, '.webp')
  await writeFile(webpPath, out)
  await unlink(file) // remove the original raster
  rows.push([rel + ' -> ' + path.basename(webpPath), beforeSize, out.length])
  beforeTotal += beforeSize
  afterTotal += out.length
}

rows.sort((a, b) => b[1] - a[1])
console.log('\n  BEFORE        AFTER     FILE')
for (const [name, b, a] of rows) {
  console.log(`${kb(b)}  ${kb(a)}   ${name}`)
}
console.log('\n' + '-'.repeat(60))
console.log(`TOTAL  ${kb(beforeTotal)} -> ${kb(afterTotal)}  ` +
  `(${(beforeTotal / 1024 / 1024).toFixed(1)} MB -> ${(afterTotal / 1024 / 1024).toFixed(1)} MB, ` +
  `${(100 - (afterTotal / beforeTotal) * 100).toFixed(0)}% smaller)`)
console.log(`Files processed: ${rows.length}`)
