import { BookOpen } from 'lucide-react';
import { CATEGORY_STYLES, TYPE_STYLES } from '../constants/constants.js';

export const ContentCard = ({ content, onEdit, onDelete, canManage }) => {
    const categoryStyle = CATEGORY_STYLES[content.category] || { cls: 'bg-fw-purple-bg text-fw-purple' };
    const typeStyle = TYPE_STYLES[content.type] || { cls: 'bg-fw-purple-bg text-fw-purple' };

    const normalizeUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
};

    const handleLinkClick = (e, url) => {
        e.preventDefault();
        window.open(normalizeUrl(url), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className='bg-white border border-[#e5e7f0] rounded-[16px] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(90,85,140,0.08)] transition-shadow'>
            <div className='w-full h-40 bg-fw-purple-bg/40 flex items-center justify-center overflow-hidden'>
                {content.photoUrl ? (
                    <img src={content.photoUrl} alt={content.title} className='w-full h-full object-cover' />
                ) : (
                    <BookOpen size={32} className='text-fw-purple-light' />
                )}
            </div>

            <div className='flex flex-col gap-2.5 p-4 flex-1'>
                <h3 className='m-0 text-[15px] font-black text-[#2f3348] leading-tight'>{content.title}</h3>
                <div className='flex gap-2 flex-wrap'>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${typeStyle.cls}`}>
                        {content.type}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${categoryStyle.cls}`}>
                        {content.category}
                    </span>
                </div>

                <p className='m-0 text-[13px] text-fw-gray font-semibold leading-relaxed line-clamp-3'>
                    {content.description}
                </p>

                {content.url && (
                    <a
                        href={normalizeUrl(content.url)}
                        onClick={(e) => handleLinkClick(e, content.url)}
                        rel='noopener noreferrer'
                        className='mt-1 text-[13px] font-extrabold text-fw-purple hover:text-fw-purple-light transition-colors underline-offset-2 underline'
                    >
                        Ver recurso
                    </a>
                )}

                {content.body && (
                    <div className='mt-1 rounded-xl p-3 bg-fw-purple-bg/30'>
                        <span className='block text-xs font-black uppercase tracking-wide text-fw-purple mb-1'>
                            Contenido
                        </span>
                        <p className='m-0 text-[13px] text-fw-gray font-semibold leading-relaxed line-clamp-4'>
                            {content.body}
                        </p>
                    </div>
                )}
            </div>

            {
                canManage && (
                    <div className='flex gap-2 px-4 pb-4'>
                        <button
                            onClick={() => onEdit(content)}
                            className='flex-1 h-9 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-fw-purple-bg text-fw-purple hover:bg-fw-purple hover:text-white transition-colors'
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(content)}
                            className='flex-1 h-9 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-fw-pink/10 text-fw-pink hover:bg-fw-pink hover:text-white transition-colors'
                        >
                            Eliminar
                        </button>
                    </div>
                )
            }
        </div >
    );
};