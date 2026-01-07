import { useNavigate, useLocation } from 'react-router-dom'
import { getParentRoute } from '../../utils/constants'

export function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleBack = () => {
    const parentRoute = getParentRoute(location.pathname)
    if (parentRoute) {
      navigate(parentRoute)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
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
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  )
}