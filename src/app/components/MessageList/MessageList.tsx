import React, {useCallback, useRef, useEffect} from 'react';
import {Box} from '@mui/material';
import {VariableSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {Message} from "@/app/actions/actions";
import styles from './MessageList.module.css';
import MessageItem from "@/app/components/MessageItem/MessageItem";

interface MessageListProps {
    messages: Message[];
    darkMode: boolean;
}

export default function MessageList({messages, darkMode}: MessageListProps) {
    const listRef = useRef<List>(null);
    const itemHeights = useRef<number[]>([]);
    const bottomPadding = 90;

    const getItemSize = useCallback((index: number) => {
        return itemHeights.current[index] || 80;
    }, []);

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
                    style={{
                        paddingBottom: isLastItem ? bottomPadding : 0,
                    }}
                />
            </div>
        );
    };

    // Scroll to the last item when messages change
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToItem(messages.length - 1, 'end');
        }
    }, [messages]);

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
