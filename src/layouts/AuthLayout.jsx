import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <Outlet />
    </div>
  )
}
