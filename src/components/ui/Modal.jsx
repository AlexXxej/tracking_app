import { useEffect } from 'react'

export function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-[var(--color-bg-secondary)] p-6 shadow-xl">
        {children}
      </div>
    </div>
  )
}
