import React, {useEffect, useRef} from 'react';
import {Typography} from '@mui/material';
import styles from './MessageItem.module.css';

interface MessageProps {
    message: {
        text: string;
        isUser: boolean;
    };
    darkMode?: boolean;
    onHeightCalculated: (height: number) => void;
    style?: React.CSSProperties;
}

export default function MessageItem({message, darkMode, onHeightCalculated, style}: MessageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            onHeightCalculated(containerRef.current.getBoundingClientRect().height);
        }
    }, [message.text, onHeightCalculated]);

    const containerClass = message.isUser ? styles.user : styles.assistant;
    const contentClass = `${styles.messageContent} ${darkMode ? styles.dark : ''}`;

    return (
        <div
            ref={containerRef}
            style={style}
            className={`${styles.container} ${containerClass}`}
        >
            <div className={contentClass}>
                <Typography variant="body1">{message.text}</Typography>
            </div>
        </div>
    );
}
