export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export function StatusBadge({ status }: { status: string }) {
  // TouchFlow Status Chips: Semantic color at 12% opacity fill, semantic text, pill-shaped, 6px 14px padding
  const styles: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    pending: { bg: "bg-[#FBBF24]/12", text: "text-[#D97706]", dot: "bg-[#FBBF24]", border: "border-[#FBBF24]/30" },
    approved: { bg: "bg-[#34D399]/12", text: "text-[#059669]", dot: "bg-[#34D399]", border: "border-[#34D399]/30" },
    rejected: { bg: "bg-[#EF4444]/12", text: "text-[#DC2626]", dot: "bg-[#EF4444]", border: "border-[#EF4444]/30" },
    sold: { bg: "bg-[#3B82F6]/12", text: "text-[#2563EB]", dot: "bg-[#3B82F6]", border: "border-[#3B82F6]/30" },
    deleted: { bg: "bg-[#6B7280]/12", text: "text-[#4B5563]", dot: "bg-[#9CA3AF]", border: "border-[#6B7280]/30" },
  };
  const config = styles[status] ?? { bg: "bg-slate-100", text: "text-[#4B5563]", dot: "bg-[#9CA3AF]", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-[14px] py-[6px] text-xs font-semibold capitalize min-h-[32px] sm:min-h-[36px] ${config.bg} ${config.text} ${config.border}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

export function Stars({ rating, size = "text-sm" }: { rating: number; size?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${size} text-[#FBBF24]`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(Math.round(rating))}
      <span className="text-[#E5E7EB]">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

