import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { Root } from '../components/Root';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'QBE Commercial Property AI UW Agent',
  description: 'AI-powered underwriting workbench',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Root />
          {children}
        </Providers>
      </body>
    </html>
  );
}
