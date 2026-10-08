"use client";

import { useState } from "react";
import type { ListingImage } from "@/lib/types";

interface Props {
  images: ListingImage[];
  title: string;
}

export default function ScreenshotGallery({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-8 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-2xl text-[#3B82F6]">
          🖼️
        </div>
        <p className="text-sm font-semibold text-[#111827] font-headline">No screenshots uploaded</p>
        <p className="text-xs text-[#6B7280] mt-0.5">The seller hasn't attached system previews for this listing yet.</p>
      </div>
    );
  }

  const current = images[selectedIndex] || images[0];

  function nextImage() {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }

  function prevImage() {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div className="space-y-3">
      {/* Main Showcase Image */}
      <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#0F172A] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-video w-full flex items-center justify-center bg-[#0F172A]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image_url}
            alt={current.caption || `${title} - Screenshot ${selectedIndex + 1}`}
            className="h-full w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
            onClick={() => setIsFullscreen(true)}
          />
        </div>

        {/* Counter Badge */}
        <div className="absolute top-3.5 right-3.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white pointer-events-none shadow-sm">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          aria-label="View Fullscreen"
          className="absolute top-3.5 left-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Navigation Arrows (if > 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-lg backdrop-blur-md opacity-80 hover:opacity-100 hover:bg-white active:scale-95 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-lg backdrop-blur-md opacity-80 hover:opacity-100 hover:bg-white active:scale-95 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Caption Overlay */}
        {current.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-8 text-white">
            <p className="text-sm font-medium leading-snug drop-shadow-sm">{current.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`group relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                selectedIndex === idx
                  ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/30 scale-[1.02]"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.caption || `Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.caption || title}
              className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            {current.caption && (
              <p className="mt-4 text-center text-sm font-medium text-white/90 max-w-xl">{current.caption}</p>
            )}
            <p className="mt-2 text-xs text-white/50">
              {selectedIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
