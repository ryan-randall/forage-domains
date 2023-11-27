// app/layout.tsx
import { Providers } from "./providers";
import './globals.css'
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script strategy='lazyOnload' data-domain="forage.domains" src="https://plausible.io/js/plausible.js" />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}