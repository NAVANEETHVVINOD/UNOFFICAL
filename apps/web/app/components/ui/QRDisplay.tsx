"use client";

import { NewspaperCard } from './NewspaperUI';

interface QRDisplayProps {
    qrCodeUrl: string;
    onClose: () => void;
}

export default function QRDisplay({ qrCodeUrl, onClose }: QRDisplayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <NewspaperCard className="w-full max-w-sm p-8 relative rotate-1">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold flex items-center justify-center hover:scale-110 transition-transform z-10"
                >
                    X
                </button>

                <div className="text-center">
                    <h2 className="text-3xl font-black font-display mb-2">YOUR TICKET</h2>
                    <p className="font-mono text-sm text-gray-500 mb-6">Show this at the entrance</p>

                    <div className="bg-white p-4 border-4 border-black inline-block">
                        <img src={qrCodeUrl} alt="Event QR Code" className="w-48 h-48" />
                    </div>

                    <p className="mt-6 font-bold text-xs uppercase tracking-widest text-gray-400">
                        Do not share this code
                    </p>
                </div>
            </NewspaperCard>
        </div>
    );
}
