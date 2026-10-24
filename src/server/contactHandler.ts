/**
 * Secure Contact Form Processing Engine
 * Handles validation, anti-spam (honeypot + timing), rate limiting, HTML templating, and Resend API dispatch.
 * 
 * Target Recipient: chauhansanjeet887@gmail.com
 * Provider: Resend (https://resend.com)
 */

export interface ContactPayload {
  name?: string
  email?: string
  category?: string
  subject?: string
  message?: string
  _gotcha?: string
  _timestamp?: number | string
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
  sanitized?: {
    name: string
    email: string
    category: string
    subject: string
    message: string
  }
}

// Allowed inquiry categories matching the portfolio UI
export const ALLOWED_CATEGORIES = [
  'Internship / Hiring',
  'Freelance Project',
  'Full-Stack Development',
  'Collaboration',
  'General Inquiry',
] as const

export type InquiryCategory = (typeof ALLOWED_CATEGORIES)[number]

// In-memory rate limiting: 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

export function isRateLimited(ip: string): boolean {
  if (!ip) return false
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

// HTML Entity escape for safe insertion in email body
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Strip \r and \n to prevent email header injection
export function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n]+/g, ' ').trim()
}

export function validateContactSubmission(data: ContactPayload): ValidationResult {
  const errors: Record<string, string> = {}

  // 1. Honeypot check: automated spam bot trap
  if (data._gotcha && data._gotcha.trim() !== '') {
    return {
      valid: false,
      errors: { bot: 'Automated submission rejected.' },
    }
  }

  // 2. Sub-second bot submission check
  if (data._timestamp) {
    const submissionTime = Number(data._timestamp)
    if (!isNaN(submissionTime) && Date.now() - submissionTime < 1200) {
      return {
        valid: false,
        errors: { bot: 'Submission was submitted too rapidly. Please retry.' },
      }
    }
  }

  // 3. Name validation
  const name = sanitizeHeader(data.name || '')
  if (!name) {
    errors.name = 'Your name is required.'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.'
  }

  // 4. Email validation
  const email = sanitizeHeader(data.email || '').toLowerCase()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.'
  } else if (email.length > 120) {
    errors.email = 'Email cannot exceed 120 characters.'
  }

  // 5. Category validation
  const category = sanitizeHeader(data.category || '')
  if (!category) {
    errors.category = 'Please select an inquiry category.'
  } else if (!ALLOWED_CATEGORIES.includes(category as InquiryCategory)) {
    errors.category = 'Invalid category selected.'
  }

  // 6. Subject validation
  const subject = sanitizeHeader(data.subject || '')
  if (!subject) {
    errors.subject = 'Subject is required.'
  } else if (subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.'
  } else if (subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters.'
  }

  // 7. Message validation
  const message = (data.message || '').trim()
  if (!message) {
    errors.message = 'Message is required.'
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  } else if (message.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters.'
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: {},
    sanitized: {
      name,
      email,
      category,
      subject,
      message,
    },
  }
}

export function buildEmailTemplate({
  name,
  email,
  category,
  subject,
  message,
  timestamp,
}: {
  name: string
  email: string
  category: string
  subject: string
  message: string
  timestamp: string
}): { html: string; text: string } {
  const escName = escapeHtml(name)
  const escEmail = escapeHtml(email)
  const escCategory = escapeHtml(category)
  const escSubject = escapeHtml(subject)
  const escMessage = escapeHtml(message)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Contact: ${escSubject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #08090D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F4F4F5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #101218; border: 1px solid rgba(255, 59, 78, 0.25); border-radius: 12px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.7);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, rgba(71,23,37,0.7) 0%, rgba(26,15,34,0.85) 60%, rgba(16,18,24,0.95) 100%); border-bottom: 1px solid rgba(255,59,78,0.25);">
        <p style="margin: 0; font-family: 'JetBrains Mono', monospace, Consolas; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #FF3B4E; font-weight: 600;">
          Portfolio Contact Submission
        </p>
        <h1 style="margin: 10px 0 0; font-size: 22px; font-weight: 600; line-height: 1.3; color: #FFFFFF;">
          ${escSubject}
        </h1>
      </td>
    </tr>
    <!-- Details List -->
    <tr>
      <td style="padding: 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #989BA5; width: 130px;">
              Sender:
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-weight: 600;">
              ${escName}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #989BA5;">
              Email:
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 500;">
              <a href="mailto:${escEmail}" style="color: #FF3B4E; text-decoration: none;">${escEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #989BA5;">
              Category:
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: rgba(255,59,78,0.12); border: 1px solid rgba(255,59,78,0.3); color: #FF3B4E; font-size: 11px; font-family: monospace; font-weight: 600; letter-spacing: 0.05em;">
                ${escCategory}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #989BA5;">
              Subject:
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF;">
              ${escSubject}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #989BA5;">
              Submitted At:
            </td>
            <td style="padding: 10px 0; color: #D4D0DA; font-size: 12px; font-family: monospace;">
              ${timestamp}
            </td>
          </tr>
        </table>

        <!-- Message Body -->
        <p style="margin: 24px 0 10px; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #989BA5; font-weight: 600;">
          Message:
        </p>
        <div style="padding: 22px; background-color: #08090D; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #F4F4F5; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word;">${escMessage}</div>

        <!-- Direct Reply Prompt -->
        <div style="margin-top: 28px; padding: 16px 20px; background-color: rgba(255,59,78,0.06); border-left: 3px solid #FF3B4E; border-radius: 4px; font-size: 13px; color: #D4D0DA;">
          <strong>Quick Action:</strong> Click <em>Reply</em> in your email client to respond directly to <strong>${escName}</strong> at <code>${escEmail}</code>.
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 16px 32px; background-color: #08090D; border-top: 1px solid rgba(255,255,255,0.06); font-family: monospace; font-size: 11px; color: #71717A; text-align: center;">
        Delivered via Sanjeet Chauhan Portfolio Contact System · Reply-To: ${escEmail}
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Portfolio Contact Submission

From: ${name}
Email: ${email}
Category: ${category}
Subject: ${subject}
Submitted At: ${timestamp}

Message:
${message}

--------------------------------------------------
Reply directly to this email to respond to ${name} (${email}).
`

  return { html, text }
}

export async function handleContactRequest(
  data: ContactPayload,
  clientIp = ''
): Promise<{ status: number; body: Record<string, unknown> }> {
  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        error: 'Too many submissions from your connection. Please wait a few minutes before trying again or email directly.',
      },
    }
  }

  // 2. Validate & Sanitize Input
  const validation = validateContactSubmission(data)
  if (!validation.valid || !validation.sanitized) {
    return {
      status: 400,
      body: {
        error: 'Please fix the errors in the form.',
        fields: validation.errors,
      },
    }
  }

  const { name, email, category, subject, message } = validation.sanitized
  const timestamp = new Date().toUTCString()
  const recipientEmail = process.env.CONTACT_EMAIL_TO || 'chauhansanjeet887@gmail.com'
  const fromEmail = process.env.CONTACT_EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>'
  const resendApiKey = process.env.RESEND_API_KEY

  const { html, text } = buildEmailTemplate({
    name,
    email,
    category,
    subject,
    message,
    timestamp,
  })

  // 3. Real Email Delivery via Resend
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          reply_to: email,
          subject: `Portfolio Inquiry — [${category}] — ${subject}`,
          html,
          text,
        }),
      })

      const resData = (await response.json()) as { id?: string; message?: string; name?: string }

      if (!response.ok) {
        console.error('Resend API returned error:', resData)
        return {
          status: 502,
          body: {
            error: resData.message || 'Email delivery provider rejected the message. Please contact via email directly.',
          },
        }
      }

      return {
        status: 200,
        body: {
          success: true,
          message: "Message sent successfully! I'll get back to you soon.",
          id: resData.id,
        },
      }
    } catch (err: unknown) {
      console.error('Failed to dispatch email via Resend:', err)
      return {
        status: 500,
        body: {
          error: 'An internal network error occurred while sending your message. Please try again or email directly.',
        },
      }
    }
  }

  // 4. Missing Credentials Handling
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  if (isProduction) {
    console.error('CRITICAL: RESEND_API_KEY environment variable is not configured in production.')
    return {
      status: 503,
      body: {
        error: 'Email delivery service is currently being configured. Please email chauhansanjeet887@gmail.com directly.',
      },
    }
  }

  // Local development simulated response with clear status
  console.log(`[Local Dev] Contact form received submission from ${name} <${email}>: "${subject}".`)
  console.log(`[Local Dev] Note: RESEND_API_KEY is not set in .env. Live email delivery to ${recipientEmail} is pending configuration.`)

  return {
    status: 200,
    body: {
      success: true,
      simulated: true,
      message: "Message received in local dev mode! (Add RESEND_API_KEY to your .env to deliver real emails to chauhansanjeet887@gmail.com).",
    },
  }
}
