'use client';
import Image from 'next/image';

export function BrandLogo({ size = 48, showText = true, vertical = false, color }: { size?: number, showText?: boolean, vertical?: boolean, color?: string }) {
    const teal = color || 'var(--brand)';

    return (
        <div className={`brand-logo-container ${vertical ? 'vertical' : ''}`}>
            <Image
                src="/images/logo.png"
                alt="GraphFlow Logo"
                width={size}
                height={size}
                className="logo-icon"
                priority
            />

            {showText && (
                <div className="brand-text-block">
                    <span className="brand-name" style={{ color: teal }}>GRAPHFLOW</span>
                    <span className="brand-tagline">TRADE SMARTER</span>
                </div>
            )}

            <style jsx>{`
                .brand-logo-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .brand-logo-container.vertical {
                    flex-direction: column;
                    text-align: center;
                }
                .logo-icon {
                    filter: drop-shadow(0 0 8px rgba(77, 150, 187, 0.3));
                    object-fit: contain;
                }
                .brand-text-block {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.1;
                    font-family: 'Inter', sans-serif;
                }
                .brand-name {
                    font-weight: 900;
                    font-size: 1.5rem;
                    letter-spacing: 0.05em;
                }
                .brand-tagline {
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.35em;
                    color: #fff;
                    margin-top: 2px;
                    opacity: 0.8;
                }
                
                .vertical .brand-name { font-size: 2rem; }
                .vertical .brand-tagline { font-size: 0.75rem; }
            `}</style>
        </div>
    );
}
