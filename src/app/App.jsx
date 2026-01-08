import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth.jsx'
import { SubNavigationProvider } from '../hooks/useSubNavigation.jsx'
import { router } from './routes'

export function App() {
  return (
    <AuthProvider>
      <SubNavigationProvider>
        <RouterProvider router={router} />
      </SubNavigationProvider>
    </AuthProvider>
  )
}
