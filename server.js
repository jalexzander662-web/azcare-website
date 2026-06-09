import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// ESM has no __dirname — reconstruct it from the module URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3003
const distPath = path.join(__dirname, 'dist')
const indexHtml = path.join(distPath, 'index.html')

// Fail fast with a clear message if the site hasn't been built yet.
if (!fs.existsSync(indexHtml)) {
  console.error(
    `\n[server] No build found at ${distPath}.\n` +
    `[server] Run "npm run build" first, then "npm start".\n`
  )
  process.exit(1)
}

// Serve the hashed assets and static files from the production build.
app.use(express.static(distPath))

// SPA fallback: send index.html for any non-file route so deep links and
// future client-side routes resolve to the app instead of a 404.
app.get('*', (req, res) => {
  res.sendFile(indexHtml)
})

app.listen(PORT, () => {
  console.log(`[server] Serving dist/ at http://localhost:${PORT}`)
})
