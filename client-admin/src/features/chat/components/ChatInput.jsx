import { useRef, useState } from 'react';
import { Send } from 'lucide-react';

const MAX_CHARS = 2000;

export const ChatInput = ({ onSend, disabled }) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);
    const canSend = value.trim().length > 0 && !disabled && value.length <= MAX_CHARS;

    const handleSend = () => {
        if (!canSend) return;
        onSend(value.trim());
        setValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
        }
    };

    const remaining = MAX_CHARS - value.length;
    const isNearLimit = remaining < 200;

    return (
        <div className='px-4 pb-4 pt-2'>
            <div className='flex items-end gap-2 bg-white border-[1.5px] border-[#e5e7f0] rounded-[16px] px-4 py-2.5 shadow-sm focus-within:border-[#8b91ef] transition-colors'>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Escribe cómo te sientes...'
                    rows={1}
                    maxLength={MAX_CHARS}
                    disabled={disabled}
                    className='flex-1 resize-none outline-none text-[14px] font-semibold text-[#2f3348] placeholder:text-[#9b9fb8] bg-transparent leading-relaxed max-h-[120px] disabled:opacity-50'
                    aria-label='Escribe tu mensaje'
                />

                {isNearLimit && (
                    <span className={`text-[10px] font-bold self-end mb-1 ${remaining < 50 ? 'text-[#d14b6d]' : 'text-[#9b9fb8]'}`}>
                        {remaining}
                    </span>
                )}

                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label='Enviar mensaje'
                    className='w-9 h-9 rounded-full bg-[#6d72d8] flex items-center justify-center text-white flex-shrink-0 self-end transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#8b91ef] cursor-pointer active:scale-95'
                >
                    <Send size={16} />
                </button>
            </div>

            <p className='text-center text-[10px] font-bold text-[#c5c7d8] mt-2'>
                Tiyú es un asistente de apoyo emocional, no reemplaza atención profesional.
            </p>
        </div>
    );
};