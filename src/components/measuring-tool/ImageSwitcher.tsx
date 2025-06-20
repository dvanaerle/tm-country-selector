"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSwitcherProps {
  src: StaticImageData | string;
  alt: string;
  selectedTab: "height-lower-gutter" | "wall-profile-height";
}

export const ImageSwitcher: React.FC<ImageSwitcherProps> = ({
  src,
  alt,
  selectedTab,
}) => {
  return (
    <div className="relative aspect-16/9">
      <AnimatePresence initial={false}>
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="rounded-t-lg object-cover lg:rounded-lg"
            sizes={`(min-width: 1536px) calc((1536px - 48px - 32px * 11) * (7 / 12) + 32px * 6), (min-width: 1280px) calc((1280px - 48px - 32px * 11) * (7 / 12) + 32px * 6), (min-width: 1024px) calc((1024px - 48px - 32px * 11) * (7 / 12) + 32px * 6), (min-width: 768px) calc(768px - 48px), (min-width: 640px) calc(640px - 48px), calc(100vw - 32px)`}
            placeholder="blur"
            priority
            fetchPriority="high"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
