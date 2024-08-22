import {createTheme} from '@mui/material/styles';

const theme = (mode: 'light' | 'dark') => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode
                background: {
                    default: '#FFFFFF',
                    paper: '#F8FAFC', // Very light gray for cards
                },
                primary: {
                    main: '#3B82F6', // Bright blue
                },
                secondary: {
                    main: '#10B981', // Emerald green
                },
                grey: {
                    100: '#F1F5F9', // Very light gray for inputs
                    200: '#E2E8F0', // Light gray for borders
                },
                text: {
                    primary: '#1E293B', // Dark slate blue for primary text
                    secondary: '#64748B', // Medium gray for secondary text
                },
            }
            : {
                // Dark mode
                background: {
                    default: '#0F172A', // Very dark blue
                    paper: '#1E293B', // Dark slate blue for cards
                },
                primary: {
                    main: '#60A5FA', // Lighter blue for better contrast in dark mode
                },
                secondary: {
                    main: '#34D399', // Light emerald green
                },
                grey: {
                    700: '#334155', // Medium-dark gray for inputs
                    800: '#1E293B', // Dark gray for borders
                },
                text: {
                    primary: '#F1F5F9', // Very light gray for primary text
                    secondary: '#94A3B8', // Light gray for secondary text
                },
            }),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px', // Slightly reduced for a more modern look
                    textTransform: 'none', // Prevents all-caps text on buttons
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Removes shadow for a cleaner look
                    borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
    },
});

export default theme;
