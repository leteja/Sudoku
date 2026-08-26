const RULES = [
  'Užpildyk visą 9×9 lentą skaičiais nuo 1 iki 9.',
  'Kiekvienoje eilutėje, stulpelyje ir 3×3 kvadrate skaičius gali kartotis tik vieną kartą.',
  'Pilkai pažymėti skaičiai duoti iš pradžių — jų keisti negalima.',
  '„Užrašai“ — maži skaičiai kampe (galimi variantai). „Atsakymas“ — didelis galutinis skaičius.',
  'Neteisingas atsakymas atima širdutę. Praradus 3 širdutes — žaidimas baigtas.',
  'Paspaudęs skaičių mygtuką pamatysi visus tokius pat skaičius lentoje.',
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
        Kaip žaisti
      </h2>
      <ol className="mt-3 list-decimal space-y-2.5 pl-5 font-ui text-sm leading-relaxed text-[var(--muted)]">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </section>
  )
}
