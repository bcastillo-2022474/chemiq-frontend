const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Necesitarás una API key de YouTube

export const getVideoId = (url) => {
  try {
    // Primero intentamos con la lógica de URL parsing (más precisa)
    const urlObj = new URL(url);
    let videoId = "";

    // YouTube Shorts: youtube.com/shorts/ID
    if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1].split("?")[0];
    }
    // URL estándar: youtube.com/watch?v=ID
    else if (urlObj.searchParams.has("v")) {
      videoId = urlObj.searchParams.get("v");
    }
    // URL corta: youtu.be/ID
    else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1).split("?")[0];
    }
    // Si falla el parsing, usamos la regex como respaldo
    else {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      videoId = match && match[2].length === 11 ? match[2] : "";
    }

    if (!videoId) {
      console.warn(`No se pudo extraer el videoId de la URL: ${url}`);
    }
    return videoId || null;
  } catch (error) {
    console.error("Error al parsear la URL de YouTube:", error, "URL:", url);
    return null;
  }
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
