import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Laptop,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
  Users2,
} from 'lucide-react'
import { ALLOWED_CATEGORIES, InquiryCategory } from '../../server/contactHandler'

interface ContactFormProps {
  recipientEmail: string
  className?: string
}

interface FormState {
  name: string
  email: string
  category: InquiryCategory
  subject: string
  message: string
}

const CATEGORY_META: Record<
  InquiryCategory,
  { icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  'Internship / Hiring': {
    icon: Briefcase,
    description: 'Full-time, contract, or internship roles',
  },
  'Freelance Project': {
    icon: Laptop,
    description: 'Custom client websites & applications',
  },
  'Full-Stack Development': {
    icon: Code2,
    description: 'MERN stack, React, Node.js & APIs',
  },
  'Collaboration': {
    icon: Users2,
    description: 'Open-source or hackathon collaboration',
  },
  'General Inquiry': {
    icon: MessageSquare,
    description: 'Questions, ideas, or casual tech talk',
  },
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  category: 'Internship / Hiring',
  subject: '',
  message: '',
}

export function ContactForm({ recipientEmail, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSimulated, setIsSimulated] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const mountTimeRef = useRef<number>(Date.now())
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mountTimeRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (!isCategoryOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCategoryOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCategoryOpen])

  const selectCategory = (cat: InquiryCategory) => {
    setFormData((prev) => ({ ...prev, category: cat }))
    setIsCategoryOpen(false)
    if (fieldErrors.category) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated.category
        return updated
      })
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    const name = formData.name.trim()
    const email = formData.email.trim()
    const subject = formData.subject.trim()
    const message = formData.message.trim()

    if (!name) {
      errors.name = 'Your name is required'
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters'
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    if (!email) {
      errors.email = 'Email address is required'
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email format'
    }

    if (!formData.category) {
      errors.category = 'Please select a category'
    }

    if (!subject) {
      errors.subject = 'Subject is required'
    } else if (subject.length < 3) {
      errors.subject = 'Subject must be at least 3 characters'
    }

    if (!message) {
      errors.message = 'Message is required'
    } else if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters'
    } else if (message.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific field error as user corrects it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        _gotcha: honeypot,
        _timestamp: mountTimeRef.current,
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.fields) {
          setFieldErrors(result.fields)
        }
        throw new Error(result.error || 'Failed to deliver message.')
      }

      setSubmitSuccess(true)
      setIsSimulated(Boolean(result.simulated))
      setFormData(INITIAL_FORM)
      setFieldErrors({})
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong. Please try again or email me directly.'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mailtoFallback = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    formData.subject || `Inquiry: ${formData.category}`
  )}&body=${encodeURIComponent(
    `Hi Sanjeet,\n\nName: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\n${formData.message}`
  )}`

  return (
    <div className={`mt-8 ${className}`}>
      {/* Honeypot for automated spam-bots */}
      <input
        type="text"
        name="company_website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden pointer-events-none"
        aria-hidden="true"
      />

      {/* Success Notification Banner */}
      {submitSuccess ? (
        <div className="rounded-xl border border-ember/30 bg-ember/[0.08] p-6 text-paper shadow-[0_0_32px_-8px_rgba(255,59,78,0.25)] transition-all">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
            <div>
              <p className="font-display text-lg font-medium text-white">
                Message sent successfully!
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Thank you for reaching out. Your message has been routed to my inbox and I&apos;ll get back to you soon.
              </p>

              {isSimulated ? (
                <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ember/80">
                  ⚡ Local dev mode: Add <code className="text-white">RESEND_API_KEY</code> to your .env file to enable live delivery to {recipientEmail}.
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false)
                  setFormData(INITIAL_FORM)
                  mountTimeRef.current = Date.now()
                }}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ember transition-colors hover:text-white"
              >
                Send another message →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Error Banner */}
          {submitError ? (
            <div className="flex items-start gap-3 rounded-lg border border-ember/40 bg-ember/[0.08] p-4 text-xs text-paper/90">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
              <div className="leading-relaxed">
                <span>{submitError}</span>{' '}
                <a href={mailtoFallback} className="font-medium text-ember underline underline-offset-2 hover:text-white">
                  Email me directly here
                </a>
                .
              </div>
            </div>
          ) : null}

          {/* Row 1: Name and Email Address */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                Your Name <span className="text-ember">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={isSubmitting}
                className={`mt-2 w-full rounded-lg border bg-surface/50 px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted/35 backdrop-blur-sm transition-all duration-200 focus:outline-none ${
                  fieldErrors.name
                    ? 'border-ember ring-1 ring-ember/40'
                    : 'border-line/15 hover:border-line/30 focus:border-ember/70 focus:ring-1 focus:ring-ember/40'
                }`}
              />
              {fieldErrors.name ? (
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                Email Address <span className="text-ember">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={120}
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                disabled={isSubmitting}
                className={`mt-2 w-full rounded-lg border bg-surface/50 px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted/35 backdrop-blur-sm transition-all duration-200 focus:outline-none ${
                  fieldErrors.email
                    ? 'border-ember ring-1 ring-ember/40'
                    : 'border-line/15 hover:border-line/30 focus:border-ember/70 focus:ring-1 focus:ring-ember/40'
                }`}
              />
              {fieldErrors.email ? (
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          {/* Row 2: Inquiry Category */}
          <div ref={categoryRef} className="relative">
            <label htmlFor="contact-category-btn" className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
              Inquiry Category <span className="text-ember">*</span>
            </label>
            <input type="hidden" name="category" value={formData.category} />

            <div className="relative mt-2">
              <button
                id="contact-category-btn"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
                disabled={isSubmitting}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className={`group relative flex w-full items-center justify-between rounded-lg border bg-surface/50 px-3.5 py-2.5 text-left font-body text-sm text-paper backdrop-blur-sm transition-all duration-200 focus:outline-none ${
                  isCategoryOpen
                    ? 'border-ember/70 ring-1 ring-ember/40 shadow-[0_0_24px_-4px_rgba(255,59,78,0.25)]'
                    : fieldErrors.category
                    ? 'border-ember ring-1 ring-ember/40'
                    : 'border-line/15 hover:border-line/35 hover:bg-surface/70 focus:border-ember/70 focus:ring-1 focus:ring-ember/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const ActiveIcon = CATEGORY_META[formData.category].icon
                    return (
                      <span className="grid h-6 w-6 place-items-center rounded-md border border-ember/30 bg-ember/15 text-ember">
                        <ActiveIcon className="h-3.5 w-3.5" />
                      </span>
                    )
                  })()}
                  <span className="font-medium text-paper">{formData.category}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform duration-300 ${
                    isCategoryOpen ? 'rotate-180 text-ember' : 'group-hover:text-paper'
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line/20 bg-[#0B0A12]/95 p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_32px_-8px_rgba(255,59,78,0.2)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-ember/15 blur-2xl" />
                  <div className="relative space-y-1">
                    {ALLOWED_CATEGORIES.map((cat) => {
                      const isSelected = cat === formData.category
                      const Meta = CATEGORY_META[cat]
                      const CatIcon = Meta.icon
                      return (
                        <button
                          key={cat}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => selectCategory(cat)}
                          className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                            isSelected
                              ? 'border border-ember/35 bg-ember/[0.12] text-white shadow-[0_0_16px_-4px_rgba(255,59,78,0.35)]'
                              : 'border border-transparent text-paper/85 hover:border-line/20 hover:bg-surface/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-7 w-7 place-items-center rounded-md border transition-colors ${
                                isSelected
                                  ? 'border-ember/40 bg-ember/20 text-ember'
                                  : 'border-line/15 bg-surface/60 text-muted group-hover:border-ember/30 group-hover:text-ember'
                              }`}
                            >
                              <CatIcon className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className={`font-medium leading-none ${isSelected ? 'text-ember' : 'text-paper'}`}>
                                {cat}
                              </p>
                              <p className="mt-1 text-[11px] text-muted leading-tight">
                                {Meta.description}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 text-ember" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {fieldErrors.category ? (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                {fieldErrors.category}
              </p>
            ) : null}
          </div>

          {/* Row 3: Subject */}
          <div>
            <label htmlFor="contact-subject" className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
              Subject <span className="text-ember">*</span>
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              maxLength={200}
              value={formData.subject}
              onChange={handleChange}
              placeholder="What would you like to discuss?"
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-lg border bg-surface/50 px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted/35 backdrop-blur-sm transition-all duration-200 focus:outline-none ${
                fieldErrors.subject
                  ? 'border-ember ring-1 ring-ember/40'
                  : 'border-line/15 hover:border-line/30 focus:border-ember/70 focus:ring-1 focus:ring-ember/40'
              }`}
            />
            {fieldErrors.subject ? (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                {fieldErrors.subject}
              </p>
            ) : null}
          </div>

          {/* Row 4: Message Textarea */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="contact-message" className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                Message <span className="text-ember">*</span>
              </label>
              <span
                className={`font-mono text-[9px] tracking-[0.08em] ${
                  formData.message.length > 1900 ? 'text-ember' : 'text-muted/70'
                }`}
              >
                {formData.message.length} / 2000 characters
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your opportunity, project, or idea..."
              disabled={isSubmitting}
              className={`mt-2 min-h-[140px] max-h-[240px] w-full resize-y rounded-lg border bg-surface/50 px-3.5 py-2.5 font-body text-sm leading-relaxed text-paper placeholder:text-muted/35 backdrop-blur-sm transition-all duration-200 focus:outline-none ${
                fieldErrors.message
                  ? 'border-ember ring-1 ring-ember/40'
                  : 'border-line/15 hover:border-line/30 focus:border-ember/70 focus:ring-1 focus:ring-ember/40'
              }`}
            />
            {fieldErrors.message ? (
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ember">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          {/* Action Row: Send Button + Security Info */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-ember px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-ember/90 hover:shadow-[0_0_24px_rgba(255,59,78,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted/80">
              <ShieldCheck className="h-3.5 w-3.5 text-ember" />
              <span>Spam protected • Direct delivery</span>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="pt-1 text-[11px] leading-relaxed text-muted/65">
            Your details are used solely to respond to your inquiry and are never shared, sold, or retained for marketing.
          </p>
        </form>
      )}
    </div>
  )
}
