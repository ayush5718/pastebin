import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Pastebin-Lite',
  description: 'Simple paste sharing service',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
