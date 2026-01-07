export function NewsIcon({ hasNews = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {hasNews && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-error)]" />
      )}
    </button>
  )
}
