import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            colors: {
                brand: {
                    DEFAULT: '#6366f1',
                    50: '#eef2ff',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    900: '#1e1b4b',
                },
            },
            keyframes: {
                scroll: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
                'fade-in': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                'glow-pulse': { '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.6)' } },
            },
            animation: {
                scroll: 'scroll 30s linear infinite',
                'fade-in': 'fade-in 0.3s ease-out',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
export default config;
