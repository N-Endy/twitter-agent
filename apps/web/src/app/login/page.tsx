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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_35%),linear-gradient(180deg,_#08101c_0%,_#050b14_100%)] px-6 py-12 text-slate-100">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Launch Console</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Run the account like a newsroom, not a toy bot.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Research gets ingested, ideas get scored, drafts get reviewed, posts get scheduled, mentions get triaged,
            and every risky branch stays human-controlled.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Weekly batches", "28 candidate drafts generated from curated sources and selected X inputs."],
              ["Reply safety", "Mentions are classified and drafted, but replies only send after explicit approval."],
              ["Audit trail", "Every approval, rejection, schedule change, and incident is logged."]
            ].map(([title, body]) => (
              <article key={title} className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operator Sign In</p>
          {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
