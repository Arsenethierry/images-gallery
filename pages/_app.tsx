import Layout from '@/components/layout'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'

export default function App({ Component, pageProps: { session, router, ...pageProps } }: AppProps & { router: Router }) {
  return (
    <SessionProvider session={session}>
      <Layout
        Component={Component}
        pageProps={...pageProps}
        router={router}
      />
    </SessionProvider>
  )
}
