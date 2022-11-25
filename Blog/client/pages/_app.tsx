import * as React from 'react';
import { AppProps } from 'next/app';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme';
import Navigationbar from '../src/components/Navigationbar';
import Box from '@mui/material/Box';

export default function MyApp(props : AppProps) {
const { Component, pageProps } = props;

return (
 <>
    <Navigationbar/>
    <Box sx={{mt: 8}}></Box>
    <Head><meta name="viewport" content="initial-scale=1, width=device-width" /></Head>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
 </>
 );
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};