import type { Metadata } from "next";
import ProfileCardFrame from "@/components/ProfileCardFrame";

export const metadata: Metadata = {
  title: "About | Leo Barnes",
  description: "Learn more about Leo Barnes and his areas of focus.",
};

const interests = [
  "Computer vision",
  "Autonomous systems",
  "Infrastructure",
  "Game experiments",
];

export default function AboutPage() {
  return (
    <main className="portfolio-about flex-1">
      <div className="portfolio-home-glow" aria-hidden="true" />

      <section className="portfolio-about-shell" aria-labelledby="about-heading">
        <ProfileCardFrame className="portfolio-about-card">
          <div className="portfolio-profile-art portfolio-about-art">
            <span>LB</span>
          </div>

          <h2 className="portfolio-about-name">Leo Barnes</h2>

          <p className="portfolio-about-card-copy">
            Computer science student at RMIT working across AI, robotics, and
            software systems.
          </p>

          <dl className="portfolio-about-card-stats">
            <div>
              <dt>Study</dt>
              <dd>RMIT CS</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>AI + robotics</dd>
            </div>
          </dl>
        </ProfileCardFrame>

        <div className="portfolio-about-content">
          <div className="portfolio-about-hero">
            <p className="portfolio-kicker">About</p>
            <h1 id="about-heading" className="portfolio-about-display">
              <span>Builder</span>
              <span>Student</span>
              <span className="portfolio-display-muted">Systems thinker</span>
            </h1>
            <p className="portfolio-lede">
              A more personal page can keep the homepage&apos;s confidence while
              giving the writing room to breathe.
            </p>
          </div>

          <div className="portfolio-about-lower">
            <section className="portfolio-about-statement">
              <p>
                I like projects where software has to meet the real world:
                perception, control, infrastructure, and the messy edges between
                them.
              </p>
            </section>

            <ol className="portfolio-about-interests" aria-label="Current interests">
              {interests.map((interest, index) => (
                <li key={interest}>
                  <span>{interest}</span>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
