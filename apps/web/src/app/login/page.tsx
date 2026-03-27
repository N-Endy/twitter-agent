import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error =
    resolvedSearchParams && typeof resolvedSearchParams.error === "string"
      ? resolvedSearchParams.error
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(188,253,73,0.06),_transparent_40%),linear-gradient(180deg,_#030712_0%,_#020617_100%)] px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <section className="border border-white/10 bg-white/[0.02] p-5 shadow-2xl backdrop-blur-sm sm:p-10">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[var(--accent)]">Nexus Operator Access</p>
          </div>
          <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter text-white sm:text-6xl">Command accountability. Approve with intent.</h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-400 sm:text-lg sm:leading-9">
            Autonomous ingestion with human-in-the-loop validation. The Nexus Operator system preserves brand safety while maintaining high content velocity across the X pipeline.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["Curated Ingest", "28+ candidate drafts generated from verified sources and X-backed intelligence."],
              ["Safety Gate", "Mentions classified and drafted, but live transmission requires explicit operator clearance."],
              ["System Ledger", "Immutable logs for every approval, rejection, and state change within the Nexus cluster."]
            ].map(([title, body]) => (
              <article key={title} className="border border-white/5 bg-white/[0.01] p-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] opacity-80">{title}</h2>
                <p className="mt-3 text-xs leading-6 text-slate-400 uppercase tracking-wide">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-md sm:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Terminal Authentication</p>
          {error ? <p className="mt-6 text-xs font-bold uppercase tracking-widest text-rose-500 underline decoration-2 underline-offset-4">{error}</p> : null}
          <LoginForm />
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-slate-600 leading-5">
              Warning: Unauthorized access to this console is logged. All operations are recorded for audit compliance.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
