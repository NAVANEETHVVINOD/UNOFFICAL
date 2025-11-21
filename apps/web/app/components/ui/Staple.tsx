import React from 'react';

interface StapleProps {
    className?: string;
    rotate?: number;
}

export const Staple: React.FC<StapleProps> = ({ className = '', rotate = 0 }) => {
    return (
        <div
            className={`staple-pin absolute -top-2 left-4 ${className}`}
            style={{ transform: `rotate(${rotate}deg)` }}
        />
    );
};
