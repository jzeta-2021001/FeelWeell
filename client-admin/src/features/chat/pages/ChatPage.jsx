import { useChatStore } from '../store/chatStore.js';
import { ChatHeader } from '../components/ChatHeader.jsx';
import { ChatMessageList } from '../components/ChatMessageList.jsx';
import { ChatSuggestions } from '../components/ChatSuggestions.jsx';
import { ChatInput } from '../components/ChatInput.jsx';
import { ChatEmergencyBanner } from '../components/ChatEmergencyBanner.jsx';

export const ChatPage = () => {
    const messages = useChatStore((s) => s.messages);
    const isTyping = useChatStore((s) => s.isTyping);
    const sendMessage = useChatStore((s) => s.sendMessage);

    const lastAIMessage = [...messages].reverse().find((m) => m.role === 'assistant');
    const lastAITipo = lastAIMessage?.tipo ?? null;

    const showEmergencyBanner = lastAITipo === 'EMERGENCIA';

    const handleSend = (text) => sendMessage(text);
    const handleSuggestion = (text) => sendMessage(text);

    return (
        <div className='flex flex-col h-full bg-[#f7f8ff] overflow-hidden'>
            <ChatHeader />
            <ChatMessageList messages={messages} isTyping={isTyping} />
            {showEmergencyBanner && <ChatEmergencyBanner />}
            <ChatSuggestions lastAITipo={lastAITipo} onSelect={handleSuggestion} />
            <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
    );
};