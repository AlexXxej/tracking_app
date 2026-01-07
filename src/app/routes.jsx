import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { StartPage } from '../pages/start/StartPage'
import { LoginPage } from '../pages/login/LoginPage'
import { CallbackPage } from '../pages/auth/CallbackPage'
import { MainPage } from '../pages/main/MainPage'
import { TagesberichtPage } from '../pages/tagesbericht/TagesberichtPage'
import { BaustellenPage } from '../pages/baustellen/BaustellenPage'
import { HistoriePage } from '../pages/historie/HistoriePage'
import { EinstellungenPage } from '../pages/einstellungen/EinstellungenPage'
import { ROUTES } from '../utils/constants'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.START, element: <StartPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.AUTH_CALLBACK, element: <CallbackPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.MAIN, element: <MainPage /> },
      { path: ROUTES.TAGESBERICHT, element: <TagesberichtPage /> },
      { path: ROUTES.BAUSTELLEN, element: <BaustellenPage /> },
      { path: ROUTES.HISTORIE, element: <HistoriePage /> },
      { path: ROUTES.EINSTELLUNGEN, element: <EinstellungenPage /> },
    ],
  },
])
