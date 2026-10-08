import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { FormShell } from "@/components/forms";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-[18px] py-12">
      <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#3B82F6]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] font-headline">Welcome back</h1>
          <p className="mt-1 text-[13px] text-[#6B7280]">Sign in to your CapstoneMarket account</p>
        </div>

        <FormShell action={loginAction} submitLabel="Sign In">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
            />
          </div>
        </FormShell>

        <div className="mt-6 flex items-center justify-between border-t border-[#F3F4F6] pt-4 text-xs text-[#6B7280]">
          <span>Don&apos;t have an account?</span>
          <Link href="/register" className="font-semibold text-[#3B82F6] hover:text-[#2563EB] hover:underline">
            Create account →
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-[#BFDBFE]/60 bg-[#EFF6FF] p-3.5 text-xs text-[#4B5563]">
          <p className="font-bold text-[#1E40AF] mb-1.5 flex items-center gap-1.5">
            <span>💡</span> Quick Demo Credentials:
          </p>
          <div className="space-y-1 font-mono text-[12px] text-[#1E3A8A]">
            <div><span className="font-bold text-[#2563EB]">Admin:</span> admin@capstone.test / admin123</div>
            <div><span className="font-bold text-[#2563EB]">User:</span> alice@capstone.test / password123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

