import type { Metadata } from "next";
import Link from "next/link";
import ProfileCardFrame from "@/components/ProfileCardFrame";

export const metadata: Metadata = {
  title: "About | Leo Barnes",
  description: "Learn more about Leo Barnes and his areas of focus.",
};

const currentProjects = [
  {
    title: "Portfolio site",
    tag: "Personal",
    href: "/projects#project-portfolio-website",
    colorClass: "portfolio-about-project-portfolio",
  },
  {
    title: "Homelab",
    tag: "Personal",
    href: "/projects#project-home-lab",
    colorClass: "portfolio-about-project-homelab",
  },
];

const profileSkills = [
  {
    detail: "bachelors",
    title: "RMIT CS",
  },
  {
    detail: "development",
    title: "AI",
  },
  {
    detail: "ros",
    title: "ROBOTICS",
  },
  {
    detail: "cnns",
    title: "COMPUTER VISSION",
  },
  {
    detail: "development",
    title: "PYTHON",
  },
  {
    detail: "systems",
    title: "AUTONOMOUS",
  },
  {
    detail: "infrastructure",
    title: "DOCKER + LINUX",
  },
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
            Computer science student passionate about AI, robotics, and all
            things software development.
          </p>

          <section className="portfolio-about-skills" aria-labelledby="about-skills-heading">
            <h3 id="about-skills-heading">Skills</h3>
            <dl>
              {profileSkills.map((skill) => (
                <div key={`${skill.title}-${skill.detail}`}>
                  <dt>{skill.title}</dt>
                  <dd>{skill.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        </ProfileCardFrame>

        <div className="portfolio-about-content">
          <div className="portfolio-about-hero">
            <p className="portfolio-kicker">About</p>
            <h1 id="about-heading" className="portfolio-about-display">
              <span>Hi, I&apos;m</span>
              <span className="portfolio-display-muted">Leo Barnes</span>
            </h1>
            <p className="portfolio-lede">
              Im a final year Computer Science student at RMIT University. I started programming when I was 12 on Scratch, and I’ve been hooked on all things computers and software since. My current projects span AI development, AI safety, consulting, robotics, and systems engineering.
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

            <section className="portfolio-about-projects-card" aria-labelledby="about-projects-heading">
              <p className="portfolio-kicker">Current Projects</p>
              <h2 id="about-projects-heading">Current Projects under construction</h2>

              <ol className="portfolio-about-interests">
                {currentProjects.map((project, index) => (
                  <li key={project.title} className={project.colorClass}>
                    <span>
                      {project.title}
                      <small>{project.tag}</small>
                    </span>
                    <Link
                      className="portfolio-about-project-view"
                      href={project.href}
                    >
                      View
                    </Link>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
