"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createInquiryAction } from "@/lib/actions";
import { FormError } from "./forms";

function InquirySubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-98 disabled:opacity-40 transition duration-200"
    >
      {pending ? "Sending…" : "Send inquiry"}
    </button>
  );
}

export default function InquiryModal({ listingId }: { listingId: number }) {
  const [dismissed, setDismissed] = useState(true);
  const [state, formAction] = useActionState(createInquiryAction, null);

  const open = !dismissed && !state?.ok;

  return (
    <>
      <button
        onClick={() => {
          setDismissed(false);
        }}
        className="w-full min-h-[48px] rounded-xl bg-[#3B82F6] px-5 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-98 transition duration-200"
      >
        Request purchase
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setDismissed(true)}>
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.18)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-xl font-bold text-[#111827] font-headline">Request purchase</h3>
            <p className="mb-4 text-[13px] text-[#4B5563]">Message the seller to arrange price and delivery.</p>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="listing_id" value={listingId} />
              <div>
                <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={1}
                  maxLength={2000}
                  rows={4}
                  placeholder="Hi! I'm interested in this project. Is it still available?"
                  className="w-full min-h-[100px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12 transition duration-200"
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
                <InquirySubmit />
              </div>
            </form>
          </div>
        </div>
      )}
      {state?.ok && !open && (
        <p className="mt-2 text-center text-sm font-medium text-[#059669]" role="status">
          {state.message}
        </p>
      )}
    </>
  );
}

