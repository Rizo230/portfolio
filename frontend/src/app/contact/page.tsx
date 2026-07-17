import type { Metadata } from "next";
import ContactMethods from "@/components/ContactMethods";

export const metadata: Metadata = {
  title: "Contact | Leo Barnes",
  description: "Get in touch with Leo Barnes.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Contact
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        Have a question about me or my projects? Let’s talk!
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
        I’m always happy to have a chat and meet new people to collaborate with.
        Contact me through one of the methods below to schedule a coffee or a
        call, or just send your questions my way.
      </p>

      <section className="mt-12 max-w-2xl rounded-2xl border border-black/10 p-8 dark:border-white/10">
        <h2 className="text-xl font-semibold">Find me at</h2>
        <ContactMethods />
      </section>
    </main>
  );
}
