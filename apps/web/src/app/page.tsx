import { PROPOSITIONS, SHIPPED, type Proposition } from '@straightedge/content';

const playable = new Set<number>(SHIPPED);

function status(p: Proposition): 'playable' | 'soon' {
  return playable.has(p.n) ? 'playable' : 'soon';
}

/**
 * A Server Component. It reads the proposition list at build time and ships
 * the rendered markup — this page contains no client JavaScript at all.
 *
 * PHASE 3 — Carlos: this becomes the journey map, and each row links to
 * /book-i/[n]. That route is where generateStaticParams comes in.
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b-2 border-ink pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
          Euclid&rsquo;s Elements &middot; Book I
        </p>
        <h1 className="mt-4 font-display text-6xl font-extrabold tracking-tight">
          Straightedge
        </h1>
        <p className="mt-3 max-w-prose text-lg text-ink-muted">
          Ten propositions. Three tools. No ruler, no protractor, no measuring &mdash;
          only what Euclid&rsquo;s postulates allow.
        </p>
      </header>

      <ol className="mt-10 divide-y divide-rule">
        {PROPOSITIONS.map((p) => (
          <li
            key={p.n}
            data-testid="proposition"
            data-status={status(p)}
            className="flex gap-5 py-5"
          >
            <span className="font-mono text-sm tabular-nums text-ink-faint">
              I.{p.n}
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-bold">
                Proposition {p.n}
              </h2>
              <p className="mt-1 text-ink-muted">{p.plain}</p>
              <p className="mt-2 font-mono text-xs text-ink-faint">
                {p.kind === 'construction' ? 'Build it' : 'Prove it'}
                {p.uses.length > 0 && ` · uses I.${p.uses.join(', I.')}`}
              </p>
            </div>

            <span
              className={`h-fit shrink-0 rounded-sm px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider ${
                status(p) === 'playable'
                  ? 'bg-ultramarine/10 text-ultramarine'
                  : 'bg-rule/40 text-ink-faint'
              }`}
            >
              {status(p) === 'playable' ? 'Playable' : 'Soon'}
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}
