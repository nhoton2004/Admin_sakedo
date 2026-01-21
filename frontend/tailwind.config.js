/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF6A3D',
                    50: '#FFF4F0',
                    100: '#FFE8DF',
                    200: '#FFD1BF',
                    300: '#FFBA9F',
                    400: '#FFA37F',
                    500: '#FF6A3D',
                    600: '#E55A2D',
                    700: '#CC4A1D',
                    800: '#B33A0D',
                    900: '#992A00',
                },
                purple: {
                    DEFAULT: '#7C5CFF',
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#7C5CFF',
                    600: '#6D4DD9',
                    700: '#5D3EB3',
                    800: '#4E2E8C',
                    900: '#3F1F66',
                },
                neutral: {
                    50: '#F8F9FA',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 12px rgba(0, 0, 0, 0.06)',
                'hover': '0 8px 20px rgba(0, 0, 0, 0.08)',
            },
            borderRadius: {
                'card': '16px',
                'pill': '24px',
            },
        },
    },
    plugins: [],
}
