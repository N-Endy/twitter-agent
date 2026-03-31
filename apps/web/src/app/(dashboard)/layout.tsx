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
      actions={
        <>
          <span className="inline-flex w-full items-center justify-center border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:w-auto">
            {session.user.email}
          </span>
          <a
            href="/api/auth/x/start"
            className="inline-flex w-full justify-center border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20 sm:w-auto"
          >
            Connect X account
          </a>
          <SignOutButton />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
