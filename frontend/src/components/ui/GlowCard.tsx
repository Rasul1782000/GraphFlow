'use client';
import { ReactNode } from 'react';

interface GlowCardProps {
    title?: string;
    children: ReactNode;
    headerRight?: ReactNode;
}

export function GlowCard({ title, children, headerRight }: GlowCardProps) {
    return (
        <div className="card-container">
            {(title || headerRight) && (
                <div className="card-header">
                    {title && <h3>{title}</h3>}
                    {headerRight && <div>{headerRight}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>

            <style jsx>{`
                .card-container { 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 12px; 
                    padding: 1.5rem; 
                    transition: 0.3s;
                    height: 100%;
                }
                .card-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 1.5rem; 
                }
                h3 { font-size: 1.1rem; color: #fff; margin: 0; font-weight: 700; }
                .card-body { position: relative; }
            `}</style>
        </div>
    );
}
