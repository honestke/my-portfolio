"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { contentAssetUrl } from "@/lib/supabase/storage";

export function MasonryGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? images[activeIndex] : null;

  function show(delta: number) {
    if (activeIndex === null) return;
    const next = (activeIndex + delta + images.length) % images.length;
    setActiveIndex(next);
  }

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((image, index) => {
          const url = contentAssetUrl(image.image_path);
          if (!url) return null;
          return (
            <motion.button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
              className="mb-4 block w-full overflow-hidden rounded-xl"
            >
              <Image
                src={url}
                alt={image.title ?? "Gallery image"}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-6 top-6 text-neutral-400 hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                show(-1);
              }}
              className="absolute left-4 text-neutral-400 hover:text-white sm:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[80vh] max-w-3xl"
            >
              <Image
                src={contentAssetUrl(active.image_path)!}
                alt={active.title ?? "Gallery image"}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
              />
              {(active.title || active.description) && (
                <div className="mt-3 text-center">
                  {active.title && <p className="text-sm font-medium text-white">{active.title}</p>}
                  {active.description && (
                    <p className="mt-1 text-xs text-neutral-400">{active.description}</p>
                  )}
                </div>
              )}
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                show(1);
              }}
              className="absolute right-4 text-neutral-400 hover:text-white sm:right-8"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
