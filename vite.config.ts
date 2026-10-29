import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleContactRequest } from './src/server/contactHandler'

export default defineConfig(({ mode }) => {
  // Load environment variables from .env / .env.local
  const env = loadEnv(mode, process.cwd(), '')
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY
  if (env.CONTACT_EMAIL_TO) process.env.CONTACT_EMAIL_TO = env.CONTACT_EMAIL_TO
  if (env.CONTACT_EMAIL_FROM) process.env.CONTACT_EMAIL_FROM = env.CONTACT_EMAIL_FROM

  return {
    root: __dirname,
    plugins: [
      react(),
      {
        name: 'contact-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use((_req, res, next) => {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
            res.setHeader('Pragma', 'no-cache')
            res.setHeader('Expires', '0')
            next()
          })

          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/contact' && req.method === 'POST') {
              let bodyStr = ''
              req.on('data', (chunk) => {
                bodyStr += chunk
                if (bodyStr.length > 50000) {
                  res.statusCode = 413
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Payload Too Large' }))
                  req.destroy()
                }
              })
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyStr || '{}')
                  const clientIp = req.socket?.remoteAddress || '127.0.0.1'
                  const result = await handleContactRequest(body, clientIp)
                  res.statusCode = result.status
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(result.body))
                } catch {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Invalid JSON payload' }))
                }
              })
              return
            }
            next()
          })
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
      cors: true,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1200,
    },
  }
})
