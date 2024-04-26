import React from 'react';
import Head from 'next/head';
import { config } from '@components/config';

/**
 * Header component
 */
export const Header: React.FC = () => {
  return (
    <Head>
      <title>{config.name}</title>
      <link rel="icon" href={`/favicon.ico`} />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <meta name="description" content={config.description}></meta>
      <meta name="viewport" content="user-scalable=yes, initial-scale=1, maximum-scale=5, minimum-scale=1, width=device-width" />
      <meta property="og:title" content={config.name} />
      <meta property="og:site_name" content={config.name} />
      <meta property="og:url" content="" />
      <meta property="og:description" content={config.name} />
      <meta property="og:type" content="profile" />
      <meta httpEquiv="content-language" content="en" />
    </Head>
  );
};

export default Header;
