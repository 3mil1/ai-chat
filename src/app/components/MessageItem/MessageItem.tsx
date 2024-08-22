import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import styles from './MessageItem.module.css';

interface MessageProps {
    message: {
        text: string;
        isUser: boolean;
    };
    darkMode?: boolean;
    onHeightCalculated: (height: number) => void;
}

export default function MessageItem({ message, darkMode = false, onHeightCalculated }: MessageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            onHeightCalculated(containerRef.current.getBoundingClientRect().height);
        }
    }, [message.text, onHeightCalculated]);

    const containerClass = message.isUser ? styles.user : styles.assistant;
    const contentClass = `${styles.messageContent} ${darkMode ? styles.dark : ''}`;

    return (
        <div ref={containerRef} className={`${styles.container} ${containerClass}`}>
            <div className={contentClass}>
                <Typography variant="body1">{message.text}</Typography>
            </div>
        </div>
    );
}
