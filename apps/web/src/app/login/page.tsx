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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_35%),linear-gradient(180deg,_#08101c_0%,_#050b14_100%)] px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur sm:rounded-[32px] sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Launch Console</p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Run the account like a newsroom, not a toy bot.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Research gets ingested, ideas get scored, drafts get reviewed, posts get scheduled, mentions get triaged,
            and every risky branch stays human-controlled.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Weekly batches", "28 candidate drafts generated from curated sources and selected X inputs."],
              ["Reply safety", "Mentions are classified and drafted, but replies only send after explicit approval."],
              ["Audit trail", "Every approval, rejection, schedule change, and incident is logged."]
            ].map(([title, body]) => (
              <article key={title} className="rounded-[20px] border border-white/10 bg-slate-950/30 p-4 sm:rounded-[24px] sm:p-5">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur sm:rounded-[32px] sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operator Sign In</p>
          {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
