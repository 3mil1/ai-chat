import React from 'react';
import {AppBar, Toolbar, Typography, IconButton, Tooltip, Box} from '@mui/material';
import {DarkMode as DarkModeIcon, LightMode as LightModeIcon, VpnKey as ApiKeyIcon} from '@mui/icons-material';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
    toggleDarkMode: () => void;
    darkMode: boolean;
    openApiKeyDialog: () => void;
    hasApiKey: boolean;
}

export default function ChatHeader({toggleDarkMode, darkMode, openApiKeyDialog, hasApiKey}: ChatHeaderProps) {
    return (
        <AppBar position="static" className={`${styles.header} ${darkMode ? styles.dark : ''}`}>
            <Toolbar className={styles.toolbar}>
                <Typography variant="h6" className={`${styles.title} ${darkMode ? '' : styles.light}`}>
                    Chatbot
                </Typography>
                <Box
                    className={`${styles.themeToggle} ${darkMode ? styles.dark : ''}`}
                    onClick={toggleDarkMode}
                >
                    <Box className={`${styles.themeToggleButton} ${darkMode ? styles.dark : ''}`}>
                        {darkMode ? (
                            <DarkModeIcon sx={{fontSize: 20, color: "#333"}}/>
                        ) : (
                            <LightModeIcon sx={{fontSize: 20, color: "#333"}}/>
                        )}
                    </Box>
                </Box>
                <Tooltip title={hasApiKey ? "Update API key" : "Add API key"}>
                    <IconButton
                        size="large"
                        onClick={openApiKeyDialog}
                        className={styles.apiKeyButton}
                    >
                        <ApiKeyIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}
