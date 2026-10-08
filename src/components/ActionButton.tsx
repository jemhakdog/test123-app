"use client";

// Client wrapper that binds leading args to a server action so it matches
// React's (prev, formData) form-action signature.
import { useFormStatus } from "react-dom";

export function ActionButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-98 disabled:opacity-40 transition duration-200"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

