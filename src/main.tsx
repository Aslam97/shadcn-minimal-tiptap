import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'

import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { HelmetProvider } from 'react-helmet-async'
import { SEO } from './components/custom/seo.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>
        <HelmetProvider>
          <App />
          <SEO />
        </HelmetProvider>
      </TooltipProvider>
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
)
