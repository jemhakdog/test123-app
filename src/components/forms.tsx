"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/actions";

export function SubmitButton({ label, pendingLabel = "Saving…" }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#3B82F6] px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition duration-200 hover:bg-[#2563EB] active:bg-[#2563EB] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function FormError({ state }: { state: ActionResult | null }) {
  if (!state || state.ok) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2] p-4 text-[13px] text-[#EF4444] shadow-sm">
      <svg className="h-5 w-5 shrink-0 text-[#EF4444] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div className="leading-snug font-medium">
        {state.error === "validation_failed" ? "Please fix the errors below." : state.error === "invalid_credentials" ? "Invalid email or password." : state.error === "email_taken" ? "An account with this email already exists." : state.error === "account_suspended" ? "This account has been suspended." : state.error === "cannot_inquire_own" ? "You can't inquire on your own listing." : state.error === "already_reviewed" ? "You've already reviewed this listing." : state.error === "already_flagged" ? "You've already flagged this review." : state.error === "cannot_review_own" ? "You can't review your own listing." : state.error === "cannot_flag_own" ? "You can't flag your own review." : state.error === "current_password_incorrect" ? "Current password is incorrect." : state.error === "listing_not_available" ? "This listing is not available." : state.error === "seller_unavailable" ? "This seller is unavailable." : state.error === "forbidden" ? "You don't have permission to do that." : state.error === "not_found" ? "Not found." : state.error === "cannot_suspend_self" ? "You can't suspend your own account." : state.error === "email_taken" ? "Email already in use." : state.error === "unauthorized" ? "Please log in first." : state.error}
      </div>
    </div>
  );
}

export function FieldError({ fieldErrors, field }: { fieldErrors?: Record<string, string>; field: string }) {
  if (!fieldErrors?.[field]) return null;
  return <p className="mt-1.5 text-[12px] font-medium text-[#EF4444] flex items-center gap-1.5"><span>⚠</span>{fieldErrors[field]}</p>;
}

export function FormShell({ state, action, children, submitLabel }: { state?: ActionResult | null; action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>; children: React.ReactNode; submitLabel: string }) {
  const [formState, formAction] = useActionState(action, state ?? null);
  return (
    <form action={formAction} className="space-y-5">
      <FormError state={formState} />
      {children}
      <SubmitButton label={submitLabel} />
      {formState?.ok && formState.message && (
        <p className="rounded-xl border border-[#34D399]/30 bg-[#34D399]/12 p-3.5 text-[13px] font-medium text-[#059669]" role="status">
          ✓ {formState.message}
        </p>
      )}
    </form>
  );
}

export function SuccessMessage({ state }: { state: ActionResult | null }) {
  if (!state?.ok || !state.message) return null;
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#34D399]/30 bg-[#34D399]/12 p-4 text-[13px] font-medium text-[#059669]" role="status">
      <span>✓</span>
      <p>{state.message}</p>
    </div>
  );
}

