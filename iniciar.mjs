import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const win = process.platform === 'win32'
const pnpm = (args, opts) => (opts?.sync ? spawnSync : spawn)('npx', ['-y', 'pnpm@10', ...args], { stdio: 'inherit', shell: win })

if (!existsSync('node_modules')) {
  console.log('Instalando dependências, aguarde...')
  if (pnpm(['install'], { sync: true }).status !== 0) process.exit(1)
}

const url = 'http://localhost:3000'
const server = pnpm(['dev'])
server.on('exit', code => process.exit(code ?? 0))

const open = () => spawn(win ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open', win ? ['/c', 'start', '', url] : [url], { stdio: 'ignore', detached: true }).on('error', () => console.log(`Abra ${url} no navegador.`)).unref()
const wait = async () => {
  for (;;) {
    try { await fetch(`${url}/api/clinic`); return open() } catch { await new Promise(r => setTimeout(r, 1000)) }
  }
}
wait()
