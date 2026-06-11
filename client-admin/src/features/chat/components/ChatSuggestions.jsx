import { INITIAL_SUGGESTIONS, CONTEXTUAL_SUGGESTIONS } from '../constants/suggestions.js';

export const ChatSuggestions = ({ lastAITipo, onSelect }) => {
    const suggestions = lastAITipo
        ? (CONTEXTUAL_SUGGESTIONS[lastAITipo] ?? INITIAL_SUGGESTIONS)
        : INITIAL_SUGGESTIONS;

    return (
        <div className='flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide flex-nowrap'>
            {suggestions.map((text) => (
                <button
                    key={text}
                    onClick={() => onSelect(text)}
                    className='flex-shrink-0 px-4 py-2 bg-white border-[1.5px] border-[#e5e7f0] rounded-full text-[13px] font-bold text-[#505570] hover:border-[#8b91ef] hover:text-[#6d72d8] hover:bg-[#edefff] cursor-pointer transition-all whitespace-nowrap'
                >
                    {text}
                </button>
            ))}
        </div>
    );
};