import React, { useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import MessageItem from '../MessageItem/MessageItem';
import { Message } from "@/app/actions/actions";
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: Message[];
    darkMode: boolean;
}

export default function MessageList({ messages, darkMode }: MessageListProps) {
    const listRef = useRef<List>(null);
    const itemHeights = useRef<number[]>([]);

    const getItemSize = useCallback((index: number) => {
        return itemHeights.current[index] || 80; // 80 is a fallback in case height is not yet calculated
    }, []);

    const setItemSize = useCallback((index: number, size: number) => {
        if (itemHeights.current[index] !== size) {
            itemHeights.current[index] = size;
            if (listRef.current) {
                listRef.current.resetAfterIndex(index);
            }
        }
    }, []);

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const message = messages[index];

        return (
            <div style={style}>
                <MessageItem
                    key={index}
                    message={{
                        text: message.content,
                        isUser: message.role === 'user'
                    }}
                    darkMode={darkMode}
                    onHeightCalculated={(height: number) => setItemSize(index, height)}
                />
            </div>
        );
    };

    return (
        <Box className={styles.container}>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        itemCount={messages.length}
                        itemSize={getItemSize}
                        width={width}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </Box>
    );
}
