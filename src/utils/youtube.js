const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Necesitarás una API key de YouTube

export const getVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const { snippet, contentDetails, statistics } = video;
      
      // Convertir duración de ISO 8601 a formato legible
      const duration = contentDetails.duration
        .replace('PT', '')
        .replace('H', ':')
        .replace('M', ':')
        .replace('S', '')
        .split(':')
        .map(unit => unit.padStart(2, '0'))
        .join(':');

      return {
        title: snippet.title,
        description: snippet.description,
        publishedAt: snippet.publishedAt,
        thumbnailUrl: snippet.thumbnails.high.url,
        duration,
        viewCount: parseInt(statistics.viewCount).toLocaleString(),
        likeCount: parseInt(statistics.likeCount).toLocaleString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};
