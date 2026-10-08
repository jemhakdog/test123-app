"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions";
import { FormError, FieldError, SubmitButton } from "@/components/forms";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useActionState(updateProfileAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <FormError state={state} />
      {state?.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-[#34D399]/30 bg-[#34D399]/12 p-4 text-[13px] font-semibold text-[#059669]" role="status">
          <span>✓</span>
          <p>{state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
          Display Name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={name}
          className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        />
        <FieldError fieldErrors={state?.ok === false ? state.fieldErrors : undefined} field="name" />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[#111827]">Email Address (Locked)</label>
        <input
          value={email}
          disabled
          className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2.5 text-[15px] text-[#6B7280] cursor-not-allowed opacity-75"
        />
        <p className="mt-1 text-[12px] text-[#9CA3AF]">Email cannot be changed after registration.</p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 space-y-4">
        <div>
          <h4 className="text-[14px] font-bold text-[#111827] font-headline">Security & Password</h4>
          <p className="text-[12px] text-[#6B7280]">Leave blank if you don&apos;t want to change your password.</p>
        </div>
        
        <div className="space-y-3.5">
          <div>
            <label htmlFor="current_password" className="mb-1 block text-[13px] font-medium text-[#4B5563]">
              Current Password
            </label>
            <input
              id="current_password"
              name="current_password"
              type="password"
              placeholder="••••••••"
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
            <FieldError fieldErrors={state?.ok === false ? state.fieldErrors : undefined} field="current_password" />
          </div>

          <div>
            <label htmlFor="new_password" className="mb-1 block text-[13px] font-medium text-[#4B5563]">
              New Password
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              minLength={8}
              maxLength={256}
              placeholder="Minimum 8 characters"
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
            <FieldError fieldErrors={state?.ok === false ? state.fieldErrors : undefined} field="new_password" />
          </div>
        </div>
      </div>

      <SubmitButton label="Save Changes" />
    </form>
  );
}

