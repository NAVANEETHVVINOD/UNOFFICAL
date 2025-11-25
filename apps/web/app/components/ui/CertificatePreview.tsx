"use client";

import { useEffect, useRef, useState } from 'react';
import { NewspaperCard, RetroButton } from './NewspaperUI';

interface CertificateLayout {
    field: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    align?: 'left' | 'center' | 'right';
}

interface CertificatePreviewProps {
    templateUrl: string;
    data: Record<string, string>;
    layout: CertificateLayout[];
    onClose: () => void;
}

export default function CertificatePreview({ templateUrl, data, layout, onClose }: CertificatePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = templateUrl;

        img.onload = () => {
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw background
            ctx.drawImage(img, 0, 0);

            // Draw text fields
            layout.forEach((item) => {
                const text = data[item.field] || `{${item.field}}`;

                ctx.font = `bold ${item.fontSize}px 'Courier New', monospace`;
                ctx.fillStyle = item.color;
                ctx.textAlign = item.align || 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(text, item.x, item.y);
            });

            setLoading(false);
        };

        img.onerror = () => {
            setError("Failed to load certificate template.");
            setLoading(false);
        };

    }, [templateUrl, data, layout]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <NewspaperCard className="w-full max-w-4xl p-4 relative">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold flex items-center justify-center hover:scale-110 transition-transform z-10"
                >
                    X
                </button>

                <h2 className="text-2xl font-black font-display text-center mb-4">CERTIFICATE PREVIEW</h2>

                <div className="border-4 border-black bg-gray-100 overflow-auto max-h-[70vh] flex justify-center">
                    {loading && (
                        <div className="p-12 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-mono">Loading Template...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-12 text-red-500 font-bold font-mono">
                            {error}
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        className={`max-w-full h-auto shadow-lg ${loading || error ? 'hidden' : 'block'}`}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <RetroButton onClick={onClose}>CLOSE</RetroButton>
                </div>
            </NewspaperCard>
        </div>
    );
}
