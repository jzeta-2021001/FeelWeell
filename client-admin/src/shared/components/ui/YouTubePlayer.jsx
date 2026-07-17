import { useEffect, useRef, useState } from 'react';
import { Maximize, Minimize, Play, X } from 'lucide-react';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube.js';

export const YouTubePlayer = ({ url, title, className = '' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLandscape, setIsLandscape] = useState(() => window.matchMedia('(orientation: landscape)').matches);
    const playerRef = useRef(null);
    const videoId = getYouTubeVideoId(url);
    const thumbnailUrl = getYouTubeThumbnailUrl(url);

    useEffect(() => {
        const media = window.matchMedia('(orientation: landscape)');
        const updateOrientation = () => setIsLandscape(media.matches);
        media.addEventListener('change', updateOrientation);
        return () => media.removeEventListener('change', updateOrientation);
    }, []);

    useEffect(() => {
        if (!isExpanded || !isLandscape || !playerRef.current || document.fullscreenElement) return;
        playerRef.current.requestFullscreen?.().catch(() => {
            // Algunos navegadores requieren otra interacción del usuario para pantalla completa.
        });
    }, [isExpanded, isLandscape]);

    const handleExpand = async () => {
        setIsPlaying(true);
        setIsExpanded(true);
        if (isLandscape && playerRef.current) {
            try {
                await playerRef.current.requestFullscreen();
            } catch {
                // En orientación horizontal sigue disponible como reproductor ampliado.
            }
        }
    };

    const handleCloseExpanded = async () => {
        setIsExpanded(false);
        if (document.fullscreenElement) await document.exitFullscreen?.();
    };

    if (!videoId || !thumbnailUrl) return null;

    return (
        <div
            ref={playerRef}
            className={`relative overflow-hidden bg-black ${isExpanded && !isLandscape ? 'fixed bottom-4 right-4 z-50 rounded-2xl shadow-2xl ring-1 ring-white/30' : ''} ${className}`}
            style={isExpanded && !isLandscape ? { width: 'min(88vw, 360px)', height: 'auto', aspectRatio: '16 / 9' } : undefined}
        >
            {isPlaying ? (
                <>
                    <iframe
                        className='w-full h-full border-0'
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&fs=0`}
                        title={title}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    />
                    {isExpanded && !isLandscape && (
                        <button type='button' onClick={handleCloseExpanded} aria-label='Cerrar reproductor flotante'
                            className='absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full border-none bg-black/60 text-white cursor-pointer'>
                            <X size={16} />
                        </button>
                    )}
                    <button type='button' onClick={isExpanded ? handleCloseExpanded : handleExpand} aria-label={isExpanded ? 'Reducir video' : 'Ampliar video'}
                        className='absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border-none bg-black/60 text-white cursor-pointer hover:bg-black/80'>
                        {isExpanded ? <Minimize size={15} /> : <Maximize size={15} />}
                    </button>
                </>
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
            {!isPlaying && (
                <button type='button' onClick={handleExpand} aria-label='Ampliar video'
                    className='absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border-none bg-black/60 text-white cursor-pointer hover:bg-black/80'>
                    <Maximize size={15} />
                </button>
            )}
        </div>
    );
};
