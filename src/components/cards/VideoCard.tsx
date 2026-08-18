'use client';

import { useEffect, useRef, useState } from 'react';

// @mui
import { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';

interface VideoCardProps {
  caption: string;
  poster: string;
  videoSrc: string;
  autoPlayOnScroll?: boolean;
  cardProps?: CardProps;
}

/***************************  CARDS - VIDEO  ***************************/

export default function VideoCard({ caption, poster, videoSrc, autoPlayOnScroll = false, cardProps }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6 // Adjust threshold as needed
    };

    // Handle video play/pause based on intersection with the viewport
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoElement && !isPlaying) {
            videoElement
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.error('Autoplay was prevented:', error);
              });
          }
        } else {
          if (videoElement && isPlaying) {
            videoElement.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const videoElement = videoRef.current;

    if (videoElement && autoPlayOnScroll) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [isPlaying, autoPlayOnScroll]);

  return (
    <MainCard {...cardProps} sx={{ p: 2, ...cardProps?.sx }}>
      <Stack sx={{ gap: 1.25 }}>
        <MainCard sx={{ p: 0 }}>
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            style={{ maxHeight: '180px', display: 'flex', objectFit: 'cover' }}
            controls
            preload="metadata"
            poster={poster}
            autoPlay={false}
            loop={false}
            muted={true}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </MainCard>
        <Typography variant="body2">{caption}</Typography>
      </Stack>
    </MainCard>
  );
}
