import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router'

import type { Route } from './+types/root'
import css from './app.module.scss'
import { Footer } from './components/Footer'
import { useEffect } from 'react'
import { onScroll } from './browser.client'

import '@fontsource/libre-franklin/300.css'
import '@fontsource/libre-franklin/500.css'
import '@fontsource/libre-baskerville/400.css'
import '@fontsource/libre-baskerville/700.css'

export function Layout({ children }: { children: React.ReactNode }) {
  let location = useLocation()

  useEffect(() => {
    window.supportsPassiveScroll = false
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () {
          window.supportsPassiveScroll = true
          return true
        },
      })
      window.addEventListener('testPassive', null, opts)
      window.removeEventListener('testPassive', null, opts)
    } catch (e) {}

    onScroll()
    window.document.addEventListener(
      'scroll',
      onScroll,
      window.supportsPassiveScroll ? { passive: true } : false
    )
    window.document.addEventListener(
      'resize',
      onScroll,
      window.supportsPassiveScroll ? { passive: true } : false
    )
  }, [])

  useEffect(() => {
    onScroll()
  }, [location])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
        />
        <link rel="me" href="https://mastodon.social/@_Nec" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="48x48" href="/icon-48x48.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/icon-256x256.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <link rel="canonical" href="https://nec.is/" />
        <link rel="me" href="https://mastodon.social/@_Nec" />
        <Meta />
        <Links />
      </head>

      <body>
        <main className={css.layout}>
          {children}
          <Footer />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
