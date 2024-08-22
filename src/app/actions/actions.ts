'use server';

import {streamText} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {createStreamableValue} from 'ai/rsc';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export async function continueConversation(history: Message[], apiKey: string) {
    const stream = createStreamableValue();

    const openai = createOpenAI({
        apiKey,
    });

    void (async () => {
        const {textStream} = await streamText({
            model: openai('gpt-3.5-turbo'),
            messages: history,
        });

        for await (const text of textStream) {
            stream.update(text);
        }

        stream.done();
    })();

    return {
        messages: history,
        newMessage: stream.value,
    };
}


export async function validateApiKey(apiKey: string): Promise<boolean> {
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (response.ok) {
            return true;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error('Validation error:', error);
        return false;
    }
}
