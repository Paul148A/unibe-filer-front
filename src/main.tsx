import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/routes.tsx'
import React from 'react'
import { UseContext } from './components/Context/hooks/use-context.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UseContext>
      <AppRouter />
    </UseContext>
  </React.StrictMode>
)
