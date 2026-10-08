"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/lib/types";

export default function SearchControls({
  categories,
  current,
  total,
}: {
  categories: Category[];
  current: { q?: string; category?: string; tag?: string; sort?: string };
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="mb-8 rounded-2xl border border-[#E5E7EB] bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            type="search"
            defaultValue={current.q ?? ""}
            placeholder="Search projects, technologies, or keywords…"
            className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>
        <select
          value={current.category ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
          className="min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[14px] font-medium text-[#4B5563] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={current.sort ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
          className="min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[14px] font-medium text-[#4B5563] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      {current.tag && (
        <div className="mt-4 flex items-center gap-2 border-t border-[#F3F4F6] pt-3 text-[13px] text-[#6B7280]">
          <span>Filtering by tag:</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]/60 px-3 py-1 font-semibold text-[#3B82F6] min-h-[36px]">
            #{current.tag}
            <button
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition"
              onClick={() => setParam("tag", "")}
              aria-label="Remove tag filter"
            >
              ✕
            </button>
          </span>
          <span className="text-[#9CA3AF]">({total} matching project{total === 1 ? "" : "s"})</span>
        </div>
      )}
    </div>
  );
}

