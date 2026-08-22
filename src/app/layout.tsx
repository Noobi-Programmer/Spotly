import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spotly — Know where to study right now',
  description:
    'Real-time campus occupancy telemetry, deterministic facility matching, and instant space availability alerts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
