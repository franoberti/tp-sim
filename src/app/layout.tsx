// app/layout.tsx
import './globals.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulación TP Final',
  description: 'Simulador de reparaciones para taller con garantía',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          <main className="min-h-screen p-4 bg-gray-50 text-gray-900">
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
