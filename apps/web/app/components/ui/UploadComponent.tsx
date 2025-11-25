"use client";

import { useState, useRef } from 'react';
import { RetroButton, NewspaperCard } from './NewspaperUI';
import { api } from '../../../lib/api';
import { motion } from 'framer-motion';

interface UploadComponentProps {
    onUpload: (url: string) => void;
    accept?: string;
    label?: string;
    className?: string;
}

export default function UploadComponent({ onUpload, accept = "image/*", label = "Upload File", className = "" }: UploadComponentProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        // Upload
        setUploading(true);
        setError(null);

        try {
            const result = await api.uploadFile(file);
            onUpload(result.url);
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Please try again.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const triggerSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={className}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
            />

            <div onClick={triggerSelect} className="cursor-pointer">
                <NewspaperCard
                    className={`p-6 border-dashed border-2 transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-black hover:bg-gray-50'}`}
                    noShadow
                >
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                        {preview ? (
                            <div className="relative w-full max-w-xs aspect-video bg-gray-100 border-2 border-black overflow-hidden">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold animate-pulse">
                                        UPLOADING...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                                    {uploading ? '⏳' : '📁'}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{uploading ? 'Uploading...' : label}</p>
                                    <p className="text-sm text-gray-500 font-mono mt-1">
                                        {uploading ? 'Please wait' : `Supports: ${accept}`}
                                    </p>
                                </div>
                            </>
                        )}

                        {error && (
                            <p className="text-red-600 font-bold text-sm bg-red-100 px-2 py-1 border border-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                </NewspaperCard>
            </div>
        </div>
    );
}
