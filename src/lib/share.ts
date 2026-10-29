/**
 * Sharing utility for Sanjeet Chauhan Portfolio
 *
 * Ensures shared and copied message text contains the complete, clickable
 * HTTPS URL on its own line:
 *
 * Sanjeet Chauhan | Full Stack Developer
 * Explore my projects, skills, and achievements.
 * https://sanjeet-chauhan.vercel.app
 *
 * WhatsApp and social platforms parse the URL from the message body,
 * render the high-resolution Open Graph card, and keep the complete URL
 * 100% visible and clickable in the message text.
 */

export const PORTFOLIO_SHARE_DATA = {
  title: 'Sanjeet Chauhan | Full-Stack Developer Portfolio',
  description:
    "Explore Sanjeet Chauhan's developer portfolio featuring full-stack projects, MERN stack development, Java, DSA, and software engineering work.",
  url: 'https://sanjeet-chauhan.vercel.app',
  get messageText(): string {
    return `${this.title}\n${this.description}\n${this.url}`
  },
} as const

/**
 * Returns a direct WhatsApp Web/Mobile share link with the complete prefilled message.
 */
export function getWhatsAppShareUrl(customText?: string): string {
  const text = customText ?? PORTFOLIO_SHARE_DATA.messageText
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
}

/**
 * Copies the complete share message (with full HTTPS URL on its own line) to clipboard.
 */
export async function copyShareText(customText?: string): Promise<boolean> {
  const text = customText ?? PORTFOLIO_SHARE_DATA.messageText
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers or restricted environments
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
    return false
  } catch {
    return false
  }
}

export type ShareResult = 'shared' | 'copied' | 'opened_whatsapp' | 'cancelled' | 'failed'

/**
 * Shares the portfolio using the native Web Share API (mobile/supported desktop),
 * with an automatic fallback to clipboard copy or direct WhatsApp URL.
 */
export async function sharePortfolio(): Promise<ShareResult> {
  const shareText = PORTFOLIO_SHARE_DATA.messageText
  const shareUrl = PORTFOLIO_SHARE_DATA.url
  const shareTitle = PORTFOLIO_SHARE_DATA.title

  // 1. Web Share API (Standard on mobile devices: iOS Safari, Android Chrome, etc.)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: shareTitle,
        text: `${shareTitle}\n${PORTFOLIO_SHARE_DATA.description}\n`,
        url: shareUrl,
      })
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return 'cancelled'
      }
      // If passing both text and url failed on this platform, retry with text-only containing the full URL
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        })
        return 'shared'
      } catch (fallbackError) {
        if (fallbackError instanceof Error && fallbackError.name === 'AbortError') {
          return 'cancelled'
        }
      }
    }
  }

  // 2. Clipboard copy fallback
  const copied = await copyShareText(shareText)
  if (copied) {
    return 'copied'
  }

  // 3. Direct WhatsApp open fallback
  try {
    if (typeof window !== 'undefined') {
      window.open(getWhatsAppShareUrl(shareText), '_blank', 'noopener,noreferrer')
      return 'opened_whatsapp'
    }
  } catch {
    // ignore
  }

  return 'failed'
}
