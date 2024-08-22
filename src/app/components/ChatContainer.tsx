'use client';

import React, {useState, useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {Box, CssBaseline} from '@mui/material';
import ChatHeader from './ChatHeader/ChatHeader';
import MessageList from './MessageList/MessageList';
import InputField from './InputField/InputField';
import ApiKeyDialog from './ApiKeyDialog/ApiKeyDialog';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import createTheme from '../styles/theme';
import {readStreamableValue} from 'ai/rsc';
import {continueConversation, Message} from "@/app/actions/actions";
import styles from './ChatContainer.module.css';

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. How can I help you today?'
};

export default function ChatContainer() {
    const [conversation, setConversation] = useState<Message[]>([WELCOME_MESSAGE]);
    const [darkMode, setDarkMode] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('openaiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            setIsApiKeyDialogOpen(true);
        }
    }, []);

    const theme = createTheme(darkMode ? 'dark' : 'light');

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleSaveApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        localStorage.setItem('openaiApiKey', newApiKey);
        setIsApiKeyDialogOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (input.trim() && !isLoading && apiKey) {
            const userMessage: Message = {role: 'user', content: input};
            setConversation((prev) => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const {newMessage} = await continueConversation([...conversation, userMessage], apiKey);

                let textContent = '';

                for await (const delta of readStreamableValue(newMessage)) {
                    textContent += delta;

                    setConversation((prev) => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];

                        if (lastMessage.role === 'assistant') {
                            lastMessage.content = textContent;
                        } else {
                            newMessages.push({role: 'assistant', content: textContent});
                        }

                        return newMessages;
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error instanceof Error ? error.message : 'Unknown error occurred');
                setConversation((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
                <ChatHeader
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                    openApiKeyDialog={() => setIsApiKeyDialogOpen(true)}
                    hasApiKey={!!apiKey}
                />
                <MessageList messages={conversation} darkMode={darkMode}/>
                <InputField
                    onSendMessage={handleSendMessage}
                    input={input}
                    onInputChange={handleInputChange}
                    isLoading={isLoading}
                    darkMode={darkMode}
                    disabled={!apiKey}
                />
                {error && (
                    <ErrorMessage
                        error={error}
                        onClose={() => setError(null)}
                    />
                )}
                <ApiKeyDialog
                    open={isApiKeyDialogOpen}
                    onClose={() => {
                        if (apiKey) {
                            setIsApiKeyDialogOpen(false);
                        }
                    }}
                    onSave={handleSaveApiKey}
                    canClose={!!apiKey}
                />
            </Box>
        </ThemeProvider>
    );
}
