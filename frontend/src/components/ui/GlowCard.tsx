'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface GlowCardProps {
    title?: string;
    children: ReactNode;
    className?: string;
    glowColor?: 'indigo' | 'green' | 'red' | 'none';
    headerRight?: ReactNode;
}

const glowMap = {
    indigo: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/40',
    green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]  hover:border-green-500/40',
    red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]  hover:border-red-500/40',
    none: '',
};

export function GlowCard({ title, children, className, glowColor = 'indigo', headerRight }: GlowCardProps) {
    return (
        <div className={cn(
            'bg-neutral-900 border border-neutral-800 rounded-xl p-5 transition-all duration-300',
            glowMap[glowColor],
            className
        )}>
            {(title || headerRight) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-white font-semibold text-base">{title}</h3>}
                    {headerRight && <div>{headerRight}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
