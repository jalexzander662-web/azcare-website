// Emits the design-system components the page uses as ES modules in src/ds/.
// The DS bundle is per-file Babel output, one try{(()=>{ ... Object.assign(__ds_scope,{X}) })()} block per component,
// so each used block can be lifted as-is: byte-faithful to the design, no hand port.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const bundle = fs.readFileSync(path.join(ROOT, 'design-src', 'ds-bundle.js'), 'utf8')
const USED = ['Nav', 'Hero', 'Section', 'TrustItem', 'PageTabs', 'ServiceCard', 'FaqItem', 'StatCounter', 'ReviewCard', 'Footer', 'WAFloat', 'CartDrawer']

const outDir = path.join(ROOT, 'src', 'ds')
fs.mkdirSync(outDir, { recursive: true })

const re = /\/\/ (components\/[\w/]+\.jsx)\ntry \{ \(\(\) => \{\n([\s\S]*?)\nObject\.assign\(__ds_scope, \{ (\w+) \}\);\n\}\)\(\); \} catch/g
const found = {}
for (const m of bundle.matchAll(re)) found[m[3]] = { src: m[1], body: m[2] }

for (const name of USED) {
  const f = found[name]
  if (!f) throw new Error('component block not found: ' + name)
  // every capitalised identifier passed to createElement must be defined in the same block
  const used = new Set([...f.body.matchAll(/createElement\(([A-Z]\w*)(?![\w.])/g)].map((x) => x[1]))
  for (const id of used) {
    if (!new RegExp(`(function|const|let|class) ${id}\\b`).test(f.body)) throw new Error(`${name}: unresolved reference ${id}`)
  }
  const code = `// Lifted verbatim from the AZ Care.pk design system (${f.src}) by tools/extract-ds.mjs. Do not hand-edit.\nimport React from 'react'\n\n${f.body}\n\nexport default ${name}\n`
  fs.writeFileSync(path.join(outDir, `${name}.js`), code)
  console.log('wrote src/ds/' + name + '.js', f.body.length, 'bytes')
}
