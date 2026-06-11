import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage.jsx';
import { ChatTypingIndicator } from './ChatTypingIndicator.jsx';
import { MessageCircleHeart } from 'lucide-react';

export const ChatMessageList = ({ messages, isTyping }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    if (messages.length === 0 && !isTyping) {
        return (
            <div className='flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#edefff] to-[#f0eaff] flex items-center justify-center'>
                    <MessageCircleHeart size={32} className='text-[#8b91ef]' />
                </div>
                <div>
                    <p className='text-[15px] font-black text-[#2f3348] mb-1'>Hola, estoy aquí para ti 💙</p>
                    <p className='text-[13px] font-bold text-[#9b9fb8] leading-relaxed'>
                        Cuéntame cómo te sientes hoy.<br />
                        Todo lo que compartas es confidencial.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-y-auto py-4 flex flex-col gap-3'>
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && <ChatTypingIndicator />}
            <div ref={bottomRef} />
        </div>
    );
};