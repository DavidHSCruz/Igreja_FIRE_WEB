interface YoutubeVideoProps {
    embedID: string
}

export const YoutubeVideo = ({embedID}: YoutubeVideoProps) => {
  return (
    <iframe
        className="w-full h-full"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${embedID}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
    ></iframe>
  )
}
