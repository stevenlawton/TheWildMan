import { readFileSync, writeFileSync, rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')

// Import the server-built entry
const { render } = await import(resolve(distDir, 'server', 'entry-server.js'))

// Render the app to HTML
const appHtml = render()

// Read the client-built index.html (has hashed asset links)
const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8')

// Inject pre-rendered HTML into the root div
const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
)

writeFileSync(resolve(distDir, 'index.html'), html)
console.log('Pre-rendered index.html with SSG content')

// Clean up server build output (not needed for deploy)
rmSync(resolve(distDir, 'server'), { recursive: true, force: true })
console.log('Cleaned up dist/server/')
