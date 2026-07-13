import { BookOpen, ExternalLink } from 'lucide-react';
import { CATEGORY_STYLES, TYPE_STYLES, TYPE_ICONS } from '../constants/constants.js';
import { YouTubePlayer } from '../../../shared/components/ui/YouTubePlayer.jsx';
import { getYouTubeVideoId } from '../../../shared/utils/youtube.js';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const normalizeUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

export const UserContentDetailBody = ({ content }) => {
    const categoryStyle = CATEGORY_STYLES[content.category] ?? { cls: 'bg-fw-purple-bg text-fw-purple' };
    const typeStyle = TYPE_STYLES[content.type] ?? { cls: 'bg-fw-purple-bg text-fw-purple' };
    const TypeIcon = TYPE_ICONS[content.type] ?? BookOpen;
    const isYouTubeVideo = content.type === 'VIDEO' && getYouTubeVideoId(content.url);

    const handleLinkClick = (e) => {
        e.preventDefault();
        window.open(normalizeUrl(content.url), '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <div className='relative w-full aspect-video shrink-0 overflow-hidden bg-fw-purple-bg/50 flex items-center justify-center'>
                {isYouTubeVideo ? (
                    <YouTubePlayer url={content.url} title={content.title} className='w-full h-full' />
                ) : content.photoUrl ? (
                    <img src={content.photoUrl} alt={content.title} className='w-full h-full object-cover' />
                ) : (
                    <TypeIcon size={56} className='text-fw-purple-light opacity-50' />
                )}
                <div className='absolute bottom-0 left-0 right-0 p-4' style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent)' }}>
                    <span className={`inline-flex items-center gap-1 text-[10.5px] font-extrabold px-2.5 py-1 rounded-full bg-white/90 ${typeStyle.cls.split(' ')[1] ?? 'text-fw-purple'}`}>
                        <TypeIcon size={11} /> {content.type}
                    </span>
                </div>
            </div>

            <div className='flex flex-col gap-4 p-6 overflow-y-auto flex-1'>
                <div>
                    <div className='flex gap-2 mb-2.5 flex-wrap'>
                        <span className={`text-[11.5px] font-extrabold px-3 py-1 rounded-full ${categoryStyle.cls}`}>
                            {content.category}
                        </span>
                        <span className='text-[11.5px] font-extrabold px-3 py-1 rounded-full bg-[#f1f2f8] text-fw-gray'>
                            {formatDate(content.createdAt)}
                        </span>
                    </div>
                    <h2 className='m-0 text-xl font-black text-[#2f3348] leading-tight'>{content.title}</h2>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-[11px] font-extrabold uppercase tracking-wide text-fw-purple-light'>Descripción</span>
                    <p className='m-0 text-[13.5px] text-[#4a4f6b] font-medium leading-relaxed'>{content.description}</p>
                </div>

                {content.body && (
                    <div className='flex flex-col gap-2'>
                        <span className='text-[11px] font-extrabold uppercase tracking-wide text-fw-purple-light'>Contenido</span>
                        <div className='bg-fw-purple-bg rounded-2xl p-4'>
                            <p className='m-0 text-[13px] text-[#4a4f6b] font-medium leading-relaxed whitespace-pre-line'>{content.body}</p>
                        </div>
                    </div>
                )}

                {content.url && (
                    <a
                        href={normalizeUrl(content.url)}
                        onClick={handleLinkClick}
                        rel='noopener noreferrer'
                        className='flex items-center justify-between gap-2.5 bg-white border-[1.5px] border-[#e5e7f0] rounded-2xl px-4 py-3.5 no-underline hover:border-fw-purple-light transition-colors'
                    >
                        <span className='text-[13px] font-extrabold text-fw-purple'>{isYouTubeVideo ? 'Ver en YouTube' : 'Ver recurso original'}</span>
                        <ExternalLink size={15} className='text-fw-purple shrink-0' />
                    </a>
                )}
            </div>
        </>
    );
};
