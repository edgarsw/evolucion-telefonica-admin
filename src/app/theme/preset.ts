import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';

const MainPreset = definePreset(Material, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '#4080FF',
            500: '#0D80AF',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '#1D3C50'
        },
    },
    tokens: {
        primary: '{semantic.primary}',
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    root: {
                        primary: {
                            hoverBackground: '#3b94b8',
                            hoverBorderColor: '#3b94b8',
                            activeBackground: '#1D3C50',
                            activeBorderColor: '#1D3C50',
                        }
                    }
                },
            },
        }
    }
});

export default MainPreset;
