import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth.jsx'
import { SubNavigationProvider } from '../hooks/useSubNavigation.jsx'
import { ToastProvider } from '../hooks/useToast.jsx'
import { ToastContainer } from '../components/feedback/ToastContainer.jsx'
import { router } from './routes'

export function App() {
  return (
    <AuthProvider>
      <SubNavigationProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </ToastProvider>
      </SubNavigationProvider>
    </AuthProvider>
  )
}
