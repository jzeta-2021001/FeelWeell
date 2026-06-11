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

    //último mensaje a tiyu para las sugerencias
    const lastAIMessage = [...messages].reverse().find((m) => m.role === 'assistant');
    const lastAITipo = lastAIMessage?.tipo ?? null;

    const showEmergencyBanner = lastAITipo === 'EMERGENCIA';
    const handleSend = (text) => {
        sendMessage(text);
    };

    const handleSuggestion = (text) =>{
        sendMessage(text);
    };

    return (
        <div className='flex flex-col h-full bg-[#f7f8ff]'>
            <ChatHeader />
            <ChatMessageList messages={messages} isTyping={isTyping}/>
            {showEmergencyBanner && <ChatEmergencyBanner />} {/* Solo cuando salta la alerta de emergenvia*/}
            <ChatSuggestions lastAITipo={lastAITipo} onSelect={handleSuggestion} />
            <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
    );
};