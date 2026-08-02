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

const aboutNotebookRows = [
  {
    title: "Origin story",
    summary: "Scratch, RMIT CS, why programming stuck",
    details: [
      "On a cold rainy day in 2016, my year 6 class was stuck inside for lunch. My teacher took this opportunity to introduce the class to Scratch, an online game development platform, and I was hooked for life. From then on, I took every class I could on computers and software and built projects in my spare time. When trying to figure out what I wanted to do with my life, I realized that programming and computer science were passions that had always been with me, leading me to pursue a degree in Computer Science at RMIT.",
      "When I started at RMIT, I really had no idea what I wanted to do. Everything was new and overwhelming, and I barely had a clue what options where even available to me. I tried to take a diverse range of courses that sparked my interest, from AI and robotics to web development and network analytics. Over time, I gradually discovered my main interests in AI and robotics, which helped me focus my studies and projects and made me become the developer i am today.",
    ],
  },
  {
    title: "Working style",
    summary: "How you turn messy real-world systems into software",
    details: [
      "Describe how you approach ambiguous problems: breaking systems into pieces, testing assumptions, and learning from real constraints in robotics, AI, or infrastructure work.",
      "Add another paragraph here when you are ready.",
    ],
  },
  {
    title: "What I want next",
    summary: "Graduate roles, AI, robotics, consulting, systems",
    details: [
      "I graduate at the end of 2026, which means its finally time to start actively persuing graduate roles and oppertunities. I am actively looking for positions and roles that align with my skills and interests in AI and robotics. I am particularly interested in roles that allow me to work on cutting edge technologies, and contribute to the development of new and innovative systems. I am also open to systems engineering roles that allow me to apply my skills in a practical setting.",
    ],
  },
  {
    title: "Outside the terminal",
    summary: "Personal details and conversation starters",
    details: [
      "Add a few human details that feel natural for you: interests, habits, favourite problems to talk about, or what you are learning next.",
      "Add another paragraph here when you are ready.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="portfolio-about flex-1">
      <div className="portfolio-home-glow" aria-hidden="true" />

      <section
        className="portfolio-about-shell"
        aria-labelledby="about-heading"
      >
        <ProfileCardFrame className="portfolio-about-card">
          <div className="portfolio-profile-art portfolio-about-art">
            <span>LB</span>
          </div>

          <h2 className="portfolio-about-name">Leo Barnes</h2>

          <p className="portfolio-about-card-copy">
            Computer science student passionate about AI, robotics, and all
            things software development.
          </p>

          <section
            className="portfolio-about-skills"
            aria-labelledby="about-skills-heading"
          >
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
              Im a final year Computer Science student at RMIT University. I
              started programming when I was 12 on Scratch, and I’ve been hooked
              on all things computers and software since. My current projects
              span AI development, AI safety, consulting, robotics, and systems
              engineering.
            </p>
          </div>

          <div className="portfolio-about-lower">
            <section className="portfolio-about-statement">
              <p>
                As a developer, I found that much of my education taught me
                about different software and systems, but little about how they
                interact with and exist in the real world. That gap is what
                drove me to build hands on projects like my homelab and this
                site itself.
              </p>
            </section>

            <section
              className="portfolio-about-projects-card"
              aria-labelledby="about-projects-heading"
            >
              <p className="portfolio-kicker">Current Projects</p>
              <h2 id="about-projects-heading">
                Current Projects under construction
              </h2>

              <ol className="portfolio-about-interests">
                {currentProjects.map((project, index) => (
                  <li key={project.title} className={project.colorClass}>
                    <Link
                      className="portfolio-about-project-link"
                      href={project.href}
                    >
                      <span className="portfolio-about-project-title">
                        {project.title}
                        <small>{project.tag}</small>
                      </span>
                      <span className="sr-only">View {project.title}</span>
                      <span
                        aria-hidden="true"
                        className="portfolio-card-arrow"
                      />
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section
            className="portfolio-about-notebook"
            aria-label="Expandable about page draft sections"
          >
            <ol className="portfolio-about-notebook-list">
              {aboutNotebookRows.map((row, index) => (
                <li key={row.title}>
                  <details>
                    <summary>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                      <span>{row.title}</span>
                      <p>{row.summary}</p>
                      <small aria-hidden="true" />
                    </summary>
                    <div className="portfolio-about-notebook-detail">
                      {row.details.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>
    </main>
  );
}
