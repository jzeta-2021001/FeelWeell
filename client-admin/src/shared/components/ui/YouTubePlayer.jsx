import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube.js';

export const YouTubePlayer = ({ url, title, className = '' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = getYouTubeVideoId(url);
    const thumbnailUrl = getYouTubeThumbnailUrl(url);

    if (!videoId || !thumbnailUrl) return null;

    return (
        <div className={`relative overflow-hidden bg-black ${className}`}>
            {isPlaying ? (
                <iframe
                    className='w-full h-full border-0'
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                />
            ) : (
                <button
                    type='button'
                    onClick={() => setIsPlaying(true)}
                    className='group w-full h-full border-none bg-transparent cursor-pointer p-0 relative'
                    aria-label={`Reproducir ${title}`}
                >
                    <img src={thumbnailUrl} alt='' className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                    <span className='absolute inset-0 bg-black/25 flex items-center justify-center'>
                        <span className='w-12 h-12 rounded-full bg-[#ff0000] text-white grid place-items-center shadow-lg'>
                            <Play size={24} fill='currentColor' className='ml-0.5' />
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
};
