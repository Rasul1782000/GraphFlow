'use client';
import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    value: number;
    format?: (v: number) => string;
    className?: string;
}

export function AnimatedCounter({ value, format, className }: AnimatedCounterProps) {
    const [display, setDisplay] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const start = prevValueRef.current;
        const end = value;
        const duration = 800;
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const current = start + (end - start) * progress;
            setDisplay(current);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                prevValueRef.current = value;
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return (
        <span className={className}>
            {format ? format(display) : display.toFixed(2)}
        </span>
    );
}
