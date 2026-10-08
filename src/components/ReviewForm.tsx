"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createReviewAction } from "@/lib/actions";
import { FormError } from "./forms";

function ReviewSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-98 disabled:opacity-40 transition duration-200"
    >
      {pending ? "Posting…" : "Post review"}
    </button>
  );
}

export default function ReviewForm({ listingId }: { listingId: number }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, formAction] = useActionState(createReviewAction, null);

  return (
    <form action={formAction} className="mb-6 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-[18px]">
      <input type="hidden" name="listing_id" value={listingId} />
      <div className="mb-3">
        <span className="mb-1.5 block text-[13px] font-medium text-[#111827]">Your rating</span>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className={`flex h-9 w-9 items-center justify-center text-2xl transition-transform active:scale-110 ${(hover || rating) >= n ? "text-[#FBBF24]" : "text-[#D1D5DB]"}`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
        {state?.ok === false && state.fieldErrors?.rating && <p className="mt-1 text-xs font-medium text-[#EF4444]">⚠ {state.fieldErrors.rating}</p>}
      </div>
      <textarea
        name="comment"
        required
        minLength={1}
        maxLength={2000}
        rows={3}
        placeholder="What did you think of this project?"
        className="mb-3.5 w-full min-h-[80px] rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12 transition duration-200"
      />
      <FormError state={state} />
      {state?.ok && <p className="mb-3 text-sm font-medium text-[#059669]">{state.message}</p>}
      <ReviewSubmit />
    </form>
  );
}

