import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactMethods from "@/components/ContactMethods";

export const metadata: Metadata = {
  title: "Contact | Leo Barnes",
  description: "Get in touch with Leo Barnes.",
};

export default function ContactPage() {
  return (
    <main className="portfolio-contact flex-1">
      <div className="portfolio-home-glow" aria-hidden="true" />

      <section
        className="portfolio-contact-shell"
        aria-labelledby="contact-heading"
      >
        <div className="portfolio-contact-hero">
          <p className="portfolio-kicker">Contact</p>
          <h1 id="contact-heading" className="portfolio-contact-display">
            <span>Have a question?</span>
            <span className="portfolio-display-muted">Let’s talk!</span>
          </h1>
          <p className="portfolio-lede">
            I’m always happy to have a chat and meet new people to collaborate
            with. Contact me through one of the methods below to schedule a
            coffee or a call, or just send your questions my way.
          </p>
        </div>

        <div className="portfolio-contact-layout">
          <section className="portfolio-contact-panel">
            <h2 className="portfolio-contact-section-title">Send a message</h2>
            <ContactForm />
          </section>

          <aside className="portfolio-contact-card">
            <div className="portfolio-profile-art portfolio-contact-art">
              <span>LB</span>
            </div>
            <h2 className="portfolio-contact-card-title">Find me at</h2>
            <ContactMethods />
          </aside>
        </div>
      </section>
    </main>
  );
}
