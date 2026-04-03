import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import HomePage from '@/pages/HomePage'
import DoctorInfoPage from '@/pages/DoctorInfoPage'
import ImPage from '@/pages/ImPage'
import UserPage from '@/pages/UserPage'
import SetInfoPage from '@/pages/SetInfoPage'
import LoginPage from '@/pages/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'doctor/:id', element: <DoctorInfoPage /> },
      { path: 'im/:id', element: <ImPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'set-info', element: <SetInfoPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

