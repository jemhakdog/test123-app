"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { flagReviewAction } from "@/lib/actions";
import { FormError } from "./forms";

function FlagSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626] active:scale-98 disabled:opacity-40 transition duration-200"
    >
      {pending ? "Flagging…" : "Flag review"}
    </button>
  );
}

export default function FlagButton({ reviewId, listingId }: { reviewId: number; listingId: number }) {
  const [dismissed, setDismissed] = useState(true);
  const [state, formAction] = useActionState(flagReviewAction.bind(null, reviewId), null);

  const open = !dismissed && !state?.ok;

  return (
    <>
      <button
        type="button"
        onClick={() => setDismissed(false)}
        className="min-h-[36px] px-2 py-1 text-xs font-semibold text-[#9CA3AF] hover:text-[#EF4444] transition"
        title="Flag this review for moderation"
      >
        Flag
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setDismissed(true)}>
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.18)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-xl font-bold text-[#111827] font-headline">Flag this review</h3>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="review_id" value={reviewId} />
              <input type="hidden" name="listing_id" value={listingId} />
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#111827]">
                  Reason for report
                </label>
                <textarea
                  name="reason"
                  required
                  minLength={1}
                  maxLength={500}
                  rows={3}
                  placeholder="Why is this review inappropriate?"
                  className="w-full min-h-[80px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12 transition duration-200"
                />
              </div>
              <FormError state={state} />
              {state?.ok && <p className="text-sm font-medium text-[#059669]">{(state as {message?: string}).message}</p>}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:bg-[#F3F4F6] transition"
                >
                  Cancel
                </button>
                <FlagSubmit />
              </div>
            </form>
          </div>
        </div>
      )}
      {state?.ok && !open && (
        <p className="mt-2 text-xs font-medium text-[#059669]" role="status">
          {state.message}
        </p>
      )}
    </>
  );
}

