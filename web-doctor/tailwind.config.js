/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/features/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
    ],
    theme: {
        container: { center: true, padding: '1rem', screens: { '2xl': '1100px' } },
        extend: {
            colors: { brand: { DEFAULT: '#6366F1', 600: '#5457EE' }, ok: '#22c55e', err: '#ef4444' },
            borderRadius: { xl: '12px', '2xl': '16px' },
            boxShadow: { soft: '0 12px 28px rgba(0,0,0,0.22)', panel: '0 20px 44px rgba(0,0,0,0.28)' },
        },
    },
    plugins: [],
};
