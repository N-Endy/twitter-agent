import Link from "next/link";

import { AppShell } from "@/components/dashboard";
import { SignOutButton } from "@/components/sign-out-button";
import { requireSession } from "@/lib/guards";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <AppShell
      title="Operator Console"
      subtitle="Keep the content engine moving while preserving human control over anything that can create brand or policy risk."
      actions={
        <>
          <Link
            href="/api/auth/x/start"
            className="inline-flex w-full justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20 sm:w-auto"
          >
            Connect X account
          </Link>
          <SignOutButton email={session.user.email} />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
