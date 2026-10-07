// Splits design-src/template.raw.html into css blocks, markup and page script.
// Run after extract-design.mjs.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const OUT = path.resolve(import.meta.dirname, '..', 'design-src')
const t = fs.readFileSync(path.join(OUT, 'template.raw.html'), 'utf8')

const helmetStart = t.indexOf('<helmet>')
const helmetEnd = t.indexOf('</helmet>')
const helmet = t.slice(helmetStart, helmetEnd)

// style blocks
const styles = []
for (const m of helmet.matchAll(/<style>([\s\S]*?)<\/style>/g)) styles.push(m[1])
fs.mkdirSync(path.join(OUT, 'css'), { recursive: true })
const seen = new Map()
styles.forEach((css, i) => {
  const sha = crypto.createHash('sha1').update(css).digest('hex').slice(0, 8)
  const dupOf = seen.get(sha)
  if (dupOf == null) seen.set(sha, i)
  fs.writeFileSync(path.join(OUT, 'css', `${String(i).padStart(2, '0')}.css`), css)
  console.log(String(i).padStart(2), String(css.length).padStart(7), sha, dupOf != null ? `DUP of ${dupOf}` : '', JSON.stringify(css.slice(0, 70)))
})

// markup between </helmet> and </x-dc>
const markup = t.slice(helmetEnd + '</helmet>'.length, t.indexOf('</x-dc>'))
fs.writeFileSync(path.join(OUT, 'markup.html'), markup)

// page script
const sOpen = t.indexOf('<script type="text/x-dc"')
const sBody = t.indexOf('>', sOpen) + 1
const script = t.slice(sBody, t.indexOf('</script>', sBody))
fs.writeFileSync(path.join(OUT, 'page-script.js'), script)
fs.writeFileSync(path.join(OUT, 'script-open-tag.txt'), t.slice(sOpen, sBody))
console.log('markup bytes', markup.length, 'script bytes', script.length)
