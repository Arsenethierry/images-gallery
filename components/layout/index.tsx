import React from 'react';
import Navbar from '../navbar';
import { AppProps } from 'next/app';


function Layout({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            {Component?.WithOwnLayout ?
                (
                    <Component {...pageProps} />
                ) : (
                    <>
                        <Navbar />
                        <Component {...pageProps} />
                    </>
                )}
        </React.Fragment>
    );
}

export default Layout;