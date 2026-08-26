const RULES = [
  'Eilutėje ir stulpelyje tas pats skaičius gali būti tik vieną kartą.',
  'Kiekviename 3×3 kvadrate kiekvienas skaičius (1–9) gali būti tik vieną kartą.',
  'Kai kurie skaičiai jau duoti — jie lieka vietoje ir padeda rasti kitus.',
  'Žaidimas baigtas, kai visa lenta užpildyta teisingai, be pasikartojimų.',
]

export function Rules() {
  return (
    <section
      className="rules-card w-full rounded-2xl bg-[var(--surface)] px-4 py-4 ring-1 ring-[var(--ring)] sm:px-5 sm:py-5"
      aria-labelledby="rules-heading"
      onClick={(event) => event.stopPropagation()}
    >
      <h2
        id="rules-heading"
        className="font-ui text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink)]"
      >
        Sudoku taisyklės
      </h2>
      <ol className="mt-3 list-decimal space-y-2.5 pl-5 font-ui text-sm leading-relaxed text-[var(--muted)]">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </section>
  )
}
