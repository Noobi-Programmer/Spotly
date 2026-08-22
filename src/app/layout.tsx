import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Spotly — Don't wait. Don't wander. Just know.",
  description:
    'Real-time campus occupancy telemetry, deterministic study space matching, and instant space availability alerts for Scaler School of Technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0d1604] text-[#dbe7c6] font-sans selection:bg-[#c5cc7b] selection:text-[#1b1d00]">
        {children}
      </body>
    </html>
  );
}
