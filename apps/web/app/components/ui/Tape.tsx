import React from 'react';

interface TapeProps {
    className?: string;
    rotate?: number;
}

export const Tape: React.FC<TapeProps> = ({ className = '', rotate = -2 }) => {
    return (
        <div
            className={`tape-strip w-32 h-8 absolute -top-4 left-1/2 -translate-x-1/2 ${className}`}
            style={{ transform: `translateX(-50%) rotate(${rotate}deg)` }}
        />
    );
};
