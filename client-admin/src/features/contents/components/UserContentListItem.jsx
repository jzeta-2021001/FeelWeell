import { BookOpen } from 'lucide-react';
import { TYPE_STYLES, TYPE_ICONS } from '../constants/constants.js';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const UserContentListItem = ({ content, isSelected, onSelect }) => {
    const typeStyle = TYPE_STYLES[content.type] ?? { cls: 'bg-fw-purple-bg text-fw-purple' };
    const TypeIcon = TYPE_ICONS[content.type] ?? BookOpen;

    return (
        <button
            onClick={() => onSelect(content._id)}
            className={`w-full flex gap-4 p-3.5 rounded-2xl border-[1.5px] cursor-pointer text-left transition-colors mb-1 ${isSelected ? 'bg-white border-fw-purple-light shadow-[0_6px_20px_rgba(109,114,216,0.10)]' : 'bg-transparent border-transparent hover:bg-white hover:border-[#e5e7f0]'}`}
        >
            <div className='w-[76px] h-[76px] rounded-2xl shrink-0 overflow-hidden bg-fw-purple-bg/50 flex items-center justify-center'>
                {content.photoUrl ? (
                    <img src={content.photoUrl} alt={content.title} className='w-full h-full object-cover' />
                ) : (
                    <TypeIcon size={26} className='text-fw-purple-light opacity-70' />
                )}
            </div>

            <div className='flex-1 min-w-0 flex flex-col gap-1.5 justify-center'>
                <div className='flex items-center gap-2'>
                    <span className={`inline-flex items-center gap-1 text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full ${typeStyle.cls}`}>
                        <TypeIcon size={10} /> {content.type}
                    </span>
                    <span className='text-[11px] font-bold text-[#aeb2cc]'>{formatDate(content.createdAt)}</span>
                </div>
                <h4 className='m-0 text-[15px] font-black text-[#2f3348] leading-snug line-clamp-1'>{content.title}</h4>
                <p className='m-0 text-[12.5px] text-fw-gray font-semibold leading-relaxed line-clamp-2'>{content.description}</p>
            </div>
        </button>
    );
};