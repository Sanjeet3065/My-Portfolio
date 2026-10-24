import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { lockScroll, unlockScroll } from '../../lib/scroll'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  label: string
  panelClassName?: string
}

export function Modal({ open, onClose, children, label, panelClassName = 'max-w-5xl' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    lockScroll()
    const previousFocus = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = [
        ...(closeRef.current ? [closeRef.current] : []),
        ...Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.offsetParent !== null),
      ]

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      unlockScroll()
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto overscroll-contain bg-ink/90 p-4 backdrop-blur-xl sm:p-6"
        data-lenis-prevent
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={`relative my-auto w-full focus:outline-none ${panelClassName}`}
        >
          {children}
        </div>
      </div>
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close dialog"
        className="fixed right-4 top-4 z-[120] grid h-11 w-11 place-items-center rounded-full border border-line/20 bg-surface/80 text-paper backdrop-blur-md transition-colors hover:border-ember/50 hover:text-ember sm:right-6 sm:top-6"
      >
        <X className="h-4 w-4" />
      </button>
    </>,
    document.body,
  )
}
