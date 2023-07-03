import React from 'react';
import Navbar from '../navbar';
import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';

interface WithOwnLayoutType {
  withOwnLayout?: boolean;
}

type AppPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>;

type AppPageWithLayout<P = {}, IP = P> = AppPage<P, IP> & WithOwnLayoutType;

function Layout({ Component, pageProps }: AppProps) {
  const ComponentWithLayout = Component as AppPageWithLayout;
  return (
    <>
      {ComponentWithLayout.withOwnLayout ? <Component {...pageProps} /> : (
        <>
          <Navbar />
          <Component {...pageProps} />
        </>
      )}
    </>
  );
}

export default Layout;
