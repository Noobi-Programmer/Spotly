'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SeatBooking } from '@/types';
import { getTicketVerificationUrl } from '@/lib/utils/ticketCrypto';
import { ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface TicketQRCodeProps {
  ticket: SeatBooking;
  size?: number;
}

export const TicketQRCode: React.FC<TicketQRCodeProps> = ({ ticket, size = 160 }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [verifyUrl, setVerifyUrl] = useState<string>('');

  useEffect(() => {
    if (!ticket) return;

    const url = getTicketVerificationUrl(ticket);
    setVerifyUrl(url);

    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: {
        dark: '#0d1604',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.warn('QR Code generation failed, falling back:', err);
      });
  }, [ticket, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative p-2.5 rounded-2xl bg-white text-black shadow-2xl border-2 border-primary-container flex items-center justify-center overflow-hidden">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`QR Code for ${ticket.ticket_code}`}
            width={size}
            height={size}
            className="rounded-xl block"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-gray-100 rounded-xl"
          >
            <QrIcon className="w-8 h-8 text-gray-400 animate-pulse" />
          </div>
        )}

        {/* Animated Laser Scanning Line */}
        <div className="absolute inset-x-2 h-0.5 bg-primary shadow-[0_0_8px_#a6d29b] animate-bounce opacity-80 pointer-events-none" />
      </div>

      {/* Test Scan link */}
      {verifyUrl && (
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-tertiary underline font-mono font-semibold transition-colors mt-0.5"
          title="Open verification screen in new tab"
        >
          <span>Test Camera Scan Link</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
