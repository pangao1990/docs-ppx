import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'

const root = resolve('dist')
const base = '/docs-ppx/'
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path.endsWith('.html') ? [path] : []
  })
}
const files = walk(root)
const pages = new Map(files.map(file => [file, readFileSync(file, 'utf8')]))
const failures = []
let links = 0
for (const [file, html] of pages) {
  const pageUrl = new URL(base + relative(root, file), 'https://local.invalid')
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&')
    const url = new URL(href, pageUrl)
    if (url.origin !== pageUrl.origin || !url.pathname.startsWith(base)) continue
    links++
    const path = join(root, decodeURIComponent(url.pathname.slice(base.length)))
    const candidates = [path + '.html', join(path, 'index.html'), path]
    const target = candidates.find(candidate => pages.has(candidate))
    if (!target) {
      if (!existsSync(path)) failures.push(`${relative(root, file)} → ${href}（页面或资源不存在）`)
      continue
    }
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1))
      if (!pages.get(target).includes(`id="${id}"`)) {
        failures.push(`${relative(root, file)} → ${href}（锚点不存在）`)
      }
    }
  }
}
for (const path of ['v5/index.html', 'v5/home.html', 'guide/start/introduction.html', 'guide/start/quick-start.html', 'api/window.html']) {
  if (!pages.has(join(root, path))) failures.push(`V5 归档入口缺失：${path}`)
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'))
  process.exitCode = 1
} else {
  console.log(`通过：${files.length} 个页面，${links} 个站内链接；V5 归档入口完整。`)
}
