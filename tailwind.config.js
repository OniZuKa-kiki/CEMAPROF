import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1A3FCB',
                    dark: '#1530A0',
                    foreground: '#FFFFFF',
                },
                accent: {
                    DEFAULT: '#E8151B',
                    dark: '#C0100F',
                    foreground: '#FFFFFF',
                },
                surface: '#F5F7FA',
                foreground: '#1A1A1A',
                muted: {
                    DEFAULT: '#F5F7FA',
                    foreground: '#6B7280',
                },
                border: '#E5E7EB',
                input: '#E5E7EB',
                ring: '#1A3FCB',
                destructive: {
                    DEFAULT: '#E8151B',
                    foreground: '#FFFFFF',
                },
            },
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                lg: '0.75rem',
                md: '0.5rem',
                sm: '0.375rem',
                '2xl': '1rem',
            },
            boxShadow: {
                card: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
                'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
            keyframes: {
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
            },
        },
    },

    plugins: [forms, animate],
};
