import React, {useCallback, useRef} from 'react';
import {Box} from '@mui/material';
import {VariableSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import MessageItem from '../MessageItem/MessageItem';
import {Message} from "@/app/actions/actions";
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: Message[];
    darkMode: boolean;
}

export default function MessageList({messages, darkMode}: MessageListProps) {
    const listRef = useRef<List>(null);
    const itemHeights = useRef<number[]>([]);
    const bottomPadding = 90;

    const getItemSize = useCallback((index: number) => {
        const baseHeight = itemHeights.current[index] || 80;
        return index === messages.length - 1 ? baseHeight + bottomPadding : baseHeight;
    }, [messages.length]);

    const setItemSize = useCallback((index: number, size: number) => {
        if (itemHeights.current[index] !== size) {
            itemHeights.current[index] = size;
            if (listRef.current) {
                listRef.current.resetAfterIndex(index);
            }
        }
    }, []);

    const Row = ({index, style}: { index: number; style: React.CSSProperties }) => {
        const message = messages[index];
        const isLastItem = index === messages.length - 1;

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
                {isLastItem && <div style={{height: bottomPadding}}/>}
            </div>
        );
    };

    return (
        <Box className={styles.container}>
            <AutoSizer>
                {({height, width}) => (
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
