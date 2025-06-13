"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import PlayCircleFill from "/public/icons/MingCute/play_circle_fill.svg";
import { useLocale, useTranslations } from "next-intl";

interface VideoProps {
  /** Een object met video-URL's per taal, plus een fallback. */
  videoUrls: { [locale: string]: string; fallback: string };
  /** De afbeelding die als overlay/thumbnail wordt getoond. */
  overlayImage: string | StaticImageData;
  /** De titel van de video, gebruikt in de `iframe` en `aria-label`. */
  title: string;
  /** De alt-tekst voor de overlay-afbeelding. */
  alt: string;
  priority?: boolean;
  fetchPriority?: "low" | "auto" | "high";
  className?: string;
  sizes?: string;
  placeholder?: "blur" | "empty" | `data:image/${string}`;
}

/**
 * Een performance-vriendelijke video-component.
 * Rendert een `iframe` pas nadat de gebruiker op de afspeelknop klikt.
 */
export default function Video({
  videoUrls,
  overlayImage,
  title,
  alt,
  priority = false,
  fetchPriority = "auto",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "blur",
  className,
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Video");

  // Selecteert de juiste video-URL op basis van de taal, met een fallback.
  const selectedVideoUrl = videoUrls[locale] || videoUrls.fallback;

  /** Voegt de autoplay parameter toe aan de URL om de video direct te starten. */
  function addAutoplayParam(url: string) {
    if (url.includes("autoplay=1")) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}autoplay=1`;
  }

  // Als de video speelt, render de iframe.
  if (isPlaying) {
    return (
      <div
        className={`relative aspect-16/9 w-full overflow-hidden ${className}`}
      >
        <iframe
          className="size-full"
          src={addAutoplayParam(selectedVideoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        />
      </div>
    );
  }

  // Anders, toon de thumbnail met afspeelknop.
  return (
    <div
      className={`relative aspect-16/9 w-full cursor-pointer overflow-hidden ${className}`}
    >
      <button
        onClick={() => setIsPlaying(true)}
        aria-label={t("playVideoAriaLabel", { title })}
        className="group absolute inset-0 z-20 flex size-full items-center justify-center"
        type="button"
      >
        <Image
          src={overlayImage}
          alt={alt}
          priority={priority}
          fetchPriority={fetchPriority}
          sizes={sizes}
          placeholder={placeholder}
          fill
          className="object-cover"
        />
        <div className="relative z-10 flex size-full items-center justify-center">
          <PlayCircleFill
            className="size-16 rounded-full text-white transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white/50 group-focus-visible:outline-none sm:size-24"
            aria-hidden="true"
          />
        </div>
      </button>
    </div>
  );
}
