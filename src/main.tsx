import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'

import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { TooltipProvider } from '@/components/ui/tooltip'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>
        <App />
      </TooltipProvider>
      <Analytics />
    </NextThemesProvider>
  </React.StrictMode>
)
