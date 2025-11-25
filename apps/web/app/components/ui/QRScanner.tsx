"use client";

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { RetroButton, NewspaperCard } from './NewspaperUI';

interface QRScannerProps {
    onScan: (data: string | null) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [error, setError] = useState<string | null>(null);
    const QrReaderAny = QrReader as any;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <NewspaperCard className="w-full max-w-md p-4 relative">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold flex items-center justify-center hover:scale-110 transition-transform z-10"
                >
                    X
                </button>

                <h2 className="text-2xl font-black font-display text-center mb-4">SCAN TICKET</h2>

                <div className="border-4 border-black rounded-lg overflow-hidden bg-black">
                    <QrReaderAny
                        onResult={(result: any, error: any) => {
                            if (!!result) {
                                onScan(result?.getText());
                            }
                            if (!!error) {
                                // console.info(error);
                            }
                        }}
                        constraints={{ facingMode: 'environment' }}
                        className="w-full"
                    />
                </div>

                <p className="text-center mt-4 font-mono text-sm text-gray-600">
                    Point camera at the attendee's QR code
                </p>
            </NewspaperCard>
        </div>
    );
}
