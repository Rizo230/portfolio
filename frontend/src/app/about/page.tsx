import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Leo Barnes",
  description: "Learn more about Leo Barnes and his areas of focus.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        About
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        Placeholder.
      </h1>

      <div className="mt-10 grid gap-10 text-lg leading-8 text-foreground/70 md:grid-cols-2">
        <div className="space-y-5">
          <p>Description of current computer science interests.</p>
          <p>More personal reflection on computer science and development.</p>
          <p>Personality, hobbies, etc.</p>
        </div>

        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-semibold text-foreground">Current interests</h2>
          <ul className="mt-4 space-y-3">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
