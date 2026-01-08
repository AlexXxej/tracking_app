import { createContext, useContext, useState, useCallback } from 'react'

const SubNavigationContext = createContext(null)

export function SubNavigationProvider({ children }) {
  const [canGoBack, setCanGoBack] = useState(false)
  const [onBackCallback, setOnBackCallback] = useState(null)

  const enableBack = useCallback((callback) => {
    setCanGoBack(true)
    setOnBackCallback(() => callback)
  }, [])

  const disableBack = useCallback(() => {
    setCanGoBack(false)
    setOnBackCallback(null)
  }, [])

  const goBack = useCallback(() => {
    if (onBackCallback) {
      onBackCallback()
    }
  }, [onBackCallback])

  return (
    <SubNavigationContext.Provider value={{ canGoBack, enableBack, disableBack, goBack }}>
      {children}
    </SubNavigationContext.Provider>
  )
}

export function useSubNavigation() {
  const context = useContext(SubNavigationContext)
  if (!context) {
    throw new Error('useSubNavigation must be used within SubNavigationProvider')
  }
  return context
}
