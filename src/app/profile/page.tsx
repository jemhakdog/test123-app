import { requireUser } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg items-center justify-center px-[18px] py-12">
      <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] font-headline">Account Profile</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">Manage your public information and security settings</p>
        </div>
        <ProfileForm name={user.name} email={user.email} />
      </div>
    </div>
  );
}

