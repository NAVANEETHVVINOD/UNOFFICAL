import React from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-[1200px] mx-auto px-4">
            {children}
        </div>
    );
}
