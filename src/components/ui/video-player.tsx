"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import PlayCircleFill from "/public/icons/MingCute/play_circle_fill.svg";
import { useLocale } from "next-intl";

interface VideoPlayerProps {
  videoUrls: {
    [locale: string]: string;
    fallback: string;
  };
  overlayImage: string | StaticImageData;
  title: string;
  alt: string;
  priority?: boolean;
  fetchPriority?: "low" | "auto" | "high";
  className?: string;
  sizes?: string;
  placeholder?: "blur" | "empty" | `data:image/${string}`;
}

export default function VideoPlayer({
  videoUrls,
  overlayImage,
  title,
  alt,
  priority = false,
  fetchPriority = "auto",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "blur",
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const locale = useLocale();

  const selectedVideoUrl = videoUrls[locale] || videoUrls.fallback;

  function addAutoplayParam(url: string) {
    const hasQuery = url.includes("?");
    const hasAutoplay = url.includes("autoplay=1");
    if (hasAutoplay) return url;
    return url + (hasQuery ? "&" : "?") + "autoplay=1";
  }

  return (
    <div
      className={`relative aspect-16/9 w-full cursor-pointer overflow-hidden ${className}`}
    >
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video about ${title}`}
          className="absolute inset-0 z-20 flex items-center justify-center"
          type="button"
        >
          <div className="absolute inset-0 -z-10">
            <Image
              src={overlayImage}
              alt={alt}
              priority={priority}
              fetchPriority={fetchPriority}
              sizes={sizes}
              placeholder={placeholder}
            />
          </div>

          <div className="relative">
            <PlayCircleFill
              className="size-16 text-white sm:size-24"
              aria-hidden="true"
            />
          </div>
        </button>
      )}

      {isPlaying && (
        <iframe
          className="h-full w-full"
          src={addAutoplayParam(selectedVideoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        />
      )}
    </div>
  );
}
