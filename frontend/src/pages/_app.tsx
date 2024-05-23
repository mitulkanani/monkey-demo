import '../styles/global.css';

import type { AppProps } from 'next/app';
import React from 'react';
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line import/no-extraneous-dependencies

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <ToastContainer />
    <Component {...pageProps} />
  </>
);

export default MyApp;
