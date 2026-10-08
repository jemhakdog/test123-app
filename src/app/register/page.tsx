import Link from "next/link";
import { registerAction } from "@/lib/actions";
import { FormShell, FieldError } from "@/components/forms";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-[18px] py-12">
      <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#3B82F6]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] font-headline">Create your account</h1>
          <p className="mt-1 text-[13px] text-[#6B7280]">Join students & developers trading projects</p>
        </div>

        <FormShell action={registerAction} submitLabel="Create Account">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Alice Johnson"
              required
              minLength={2}
              maxLength={80}
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
            <FieldError fieldErrors={undefined} field="name" />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="alice@university.edu"
              required
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
            <FieldError fieldErrors={undefined} field="email" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              maxLength={256}
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
            <FieldError fieldErrors={undefined} field="password" />
          </div>
        </FormShell>

        <div className="mt-6 flex items-center justify-between border-t border-[#F3F4F6] pt-4 text-xs text-[#6B7280]">
          <span>Already registered?</span>
          <Link href="/login" className="font-semibold text-[#3B82F6] hover:text-[#2563EB] hover:underline">
            Sign in instead →
          </Link>
        </div>
      </div>
    </div>
  );
}

