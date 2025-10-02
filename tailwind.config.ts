import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        screens: {
            xs: '380px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1400px',
        },
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                bodyBackground: '#F7F7F7',
                bodyText: '#3D3D3D',
                primary: '#82B015',
                primaryLight: '#C6E779',
                secondary: '#FF8200',
                secondaryLight: '#FFE8D0',
                third: '#15395B',
                paymentBlue: '#3578EC',
                deleteRed: '#BC2353',
                active: '#22c55e',
                inactive: '#ef4444', 
                vippsOrange: '#ff5b24',
                vippsWhite: '#fff4ec',
                vippsPurple: '#562c83',
                Primary: {
                    50: '#F9FDE8',
                    100: '#F0FACD',
                    200: '#E2F5A1',
                    300: '#CCED69',
                    400: '#B4DF3C',
                    500: '#97C51D',
                    600: '#82B015',
                    700: '#587813',
                    800: '#485F15',
                    900: '#3D5116',
                    950: '#1E2C07',
                },
                Secondary: {
                    50: '#FFFAEC',
                    100: '#FFF4D3',
                    200: '#FFE6A5',
                    300: '#FFD26D',
                    400: '#FFB332',
                    500: '#FF9A0A',
                    600: '#FF8200',
                    700: '#CC5F02',
                    800: '#A1490B',
                    900: '#823E0C',
                    950: '#461D04',
                },
               
            },
        },
    },
    plugins: [],
};

export default config;
