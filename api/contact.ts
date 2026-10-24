/**
 * Vercel Serverless Function entry point: /api/contact
 */
import { handleContactRequest } from '../src/server/contactHandler'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1'

  try {
    const result = await handleContactRequest(req.body, clientIp)
    return res.status(result.status).json(result.body)
  } catch (error) {
    console.error('Contact endpoint error:', error)
    return res.status(500).json({ error: 'An unexpected server error occurred.' })
  }
}
