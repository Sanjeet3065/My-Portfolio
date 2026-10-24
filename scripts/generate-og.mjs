import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const width = 1200
const height = 630
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const raw = Buffer.alloc((width * 3 + 1) * height)

let seed = 927
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const stars = Array.from({ length: 130 }, () => ({
  x: random() * width,
  y: random() * height,
  r: 0.4 + random() * 1.4,
  b: 0.08 + random() * 0.32,
  color: random() > 0.82 ? [255, 59, 78] : random() > 0.5 ? [139, 92, 246] : [200, 210, 230],
}))

const glow = (x, y, cx, cy, radius, color, strength) => {
  const distance = Math.hypot(x - cx, y - cy)
  if (distance >= radius) return [0, 0, 0]
  const falloff = Math.pow(1 - distance / radius, 2.4) * strength
  return [color[0] * falloff, color[1] * falloff, color[2] * falloff]
}

for (let y = 0; y < height; y += 1) {
  const rowStart = y * (width * 3 + 1)
  raw[rowStart] = 0
  for (let x = 0; x < width; x += 1) {
    const offset = rowStart + 1 + x * 3
    let r = 8
    let g = 9
    let b = 13

    // subtle diagonal lift
    r += (x / width) * 2
    g += (y / height) * 2
    b += ((x + y) / (width + height)) * 3

    const violet = glow(x, y, 905, 215, 560, [139, 92, 246], 0.4)
    const ember = glow(x, y, 1060, 520, 460, [255, 59, 78], 0.5)
    const cyan = glow(x, y, 175, 555, 520, [56, 189, 248], 0.13)

    r += violet[0] + ember[0] + cyan[0]
    g += violet[1] + ember[1] + cyan[1]
    b += violet[2] + ember[2] + cyan[2]

    // fine grid
    const gridAlpha = 0.05 * (1 - y / height)
    if (x % 64 < 1 || y % 64 < 1) {
      r += 255 * gridAlpha
      g += 255 * gridAlpha
      b += 255 * gridAlpha
    }

    // orbital rings
    const centerX = 885
    const centerY = 300
    const distanceToCenter = Math.hypot(x - centerX, y - centerY)
    ;[150, 205, 262, 330].forEach((radius, index) => {
      if (Math.abs(distanceToCenter - radius) < 1.2) {
        const color = index === 1 ? [255, 59, 78] : index === 2 ? [56, 189, 248] : [139, 92, 246]
        const alpha = index === 3 ? 0.12 : 0.3
        r += color[0] * alpha
        g += color[1] * alpha
        b += color[2] * alpha
      }
    })

    // central ember core
    const core = Math.max(0, 1 - distanceToCenter / 46)
    r += 255 * core * 0.55
    g += 59 * core * 0.55
    b += 78 * core * 0.55

    // particles
    for (const star of stars) {
      const d = Math.hypot(x - star.x, y - star.y)
      if (d < star.r * 2.2) {
        const intensity = Math.pow(1 - d / (star.r * 2.2), 2) * star.b
        r += star.color[0] * intensity
        g += star.color[1] * intensity
        b += star.color[2] * intensity
      }
    }

    // vignette + film grain
    const nx = (x - width / 2) / (width / 2)
    const ny = (y - height / 2) / (height / 2)
    const vignette = 1 - Math.min(0.55, (nx * nx + ny * ny) * 0.24)
    const grain = (random() - 0.5) * 3.2

    raw[offset] = Math.max(0, Math.min(255, (r + grain) * vignette))
    raw[offset + 1] = Math.max(0, Math.min(255, (g + grain) * vignette))
    raw[offset + 2] = Math.max(0, Math.min(255, (b + grain) * vignette))
  }
}

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n += 1) {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c >>> 0
}

const crc32 = (buffer) => {
  let c = 0xffffffff
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([length, typeBuffer, data, crc])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(width, 0)
ihdr.writeUInt32BE(height, 4)
ihdr[8] = 8
ihdr[9] = 2
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync(join(root, 'public'), { recursive: true })
writeFileSync(join(root, 'public', 'og.png'), png)
console.log(`Generated public/og.png (${(png.length / 1024).toFixed(0)} KB)`)
