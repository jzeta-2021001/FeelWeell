export const getYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.replace(/^www\./, '');

        if (hostname === 'youtu.be') return parsedUrl.pathname.split('/').filter(Boolean)[0] || null;
        if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') return null;

        if (parsedUrl.pathname === '/watch') return parsedUrl.searchParams.get('v');
        if (/^\/(embed|shorts)\//.test(parsedUrl.pathname)) return parsedUrl.pathname.split('/')[2] || null;
    } catch {
        return null;
    }

    return null;
};

export const getYouTubeThumbnailUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
};
