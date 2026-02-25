/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '.dark'],
    theme: {
        extend: {
            colors: {
                // HUD Theme Colors
                hud: {
                    bg: {
                        primary: 'var(--hud-bg-primary)',
                        secondary: 'var(--hud-bg-secondary)',
                        card: 'var(--hud-bg-card)',
                        hover: 'var(--hud-bg-hover)',
                    },
                    accent: {
                        primary: 'rgb(var(--hud-accent-primary-rgb) / <alpha-value>)',
                        info: 'rgb(var(--hud-accent-info-rgb) / <alpha-value>)',
                        warning: 'rgb(var(--hud-accent-warning-rgb) / <alpha-value>)',
                        danger: 'rgb(var(--hud-accent-danger-rgb) / <alpha-value>)',
                        success: 'rgb(var(--hud-accent-success-rgb) / <alpha-value>)',
                        secondary: '#FF1493', // Kept for backward compatibility
                    },
                    text: {
                        primary: 'var(--hud-text-primary, #FFFFFF)',
                        secondary: 'var(--hud-text-secondary, #A0AEC0)',
                        muted: 'var(--hud-text-muted, #64748B)',
                    },
                    border: {
                        primary: 'var(--hud-border-primary, rgba(0, 255, 204, 0.3))',
                        secondary: 'var(--hud-border-secondary, rgba(255, 255, 255, 0.1))',
                        table: 'var(--hud-border-table, rgba(255, 255, 255, 0.1))',
                    }
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            boxShadow: {
                'hud': '0 0 20px rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.1)',
                'hud-glow': '0 0 30px rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.3)',
                'hud-pink': '0 0 20px rgba(255, 20, 147, 0.3)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.4)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
            backgroundImage: {
                'hud-grid': `
          linear-gradient(rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--hud-accent-primary-rgb, 0, 255, 204), 0.03) 1px, transparent 1px)
        `,
            },
            backgroundSize: {
                'grid': '50px 50px',
            },
        },
    },
    plugins: [],
}
