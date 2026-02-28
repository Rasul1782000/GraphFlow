'use client';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import gsap from 'gsap';

interface AnimatedCounterProps {
    value: number;
    format?: (v: number) => string;
    duration?: number;
    className?: string;
}

export function AnimatedCounter({ value, format, duration = 0.8, className }: AnimatedCounterProps) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);
    const counterRef = useRef({ count: value });
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);

    useLayoutEffect(() => {
        const prev = prevRef.current;
        const diff = value - prev;

        if (Math.abs(diff) < 0.0001) return;

        setDirection(diff > 0 ? 'up' : 'down');

        gsap.to(counterRef.current, {
            count: value,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                setDisplay(counterRef.current.count);
            },
            onComplete: () => {
                prevRef.current = value;
                setTimeout(() => setDirection(null), 1000);
            }
        });
    }, [value, duration]);

    return (
        <span className={cn(
            'tabular-nums transition-colors duration-1000',
            direction === 'up' ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' :
                direction === 'down' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]' : '',
            className
        )}>
            {format ? format(display) : display.toFixed(2)}
        </span>
    );
}
