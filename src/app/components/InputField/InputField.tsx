import React from 'react';
import { TextField, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import styles from './InputField.module.css';

interface InputFieldProps {
    onSendMessage: (message: string) => void;
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
    darkMode: boolean;
    disabled: boolean;
}

export default function InputField({onSendMessage, input, onInputChange, isLoading, darkMode, disabled}: InputFieldProps) {
    const handleSend = () => {
        if (input.trim() && !isLoading && !disabled) {
            onSendMessage(input);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
            <div className={styles.wrapper}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={disabled ? "Please add an API key to start chatting" : "Type your message..."}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || disabled}
                    multiline
                    maxRows={10}
                    id="chat-input"
                    aria-label="Chat input"
                    className={`${styles.input} ${darkMode ? styles.dark : ''}`}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={isLoading || disabled}
                    aria-label="Send message"
                    className={`${styles.sendButton} ${darkMode ? styles.dark : ''}`}
                >
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    );
}
