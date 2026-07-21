import Image from "next/image";
import Link from "next/link";

type HealthResponse = {
  status: string;
};

const projectLinks = [
  {
    label: "Macadamia Challenge",
    value: "Autonomous orchard robot",
    href: "/projects#project-autonomous-macadamia-orchard-robot",
    preferred: false,
  },
  {
    label: "AI Cancer Detection",
    value: "Microscopy cell classifier",
    href: "/projects#project-ai-powered-cell-identification",
    preferred: false,
  },
];

const pageLinks = [
  {
    label: "Projects",
    value: "View all projects",
    href: "/projects",
    preferred: true,
  },
  {
    label: "Contact",
    value: "Get in touch",
    href: "/contact",
    preferred: false,
  },
  {
    label: "About",
    value: "Learn more about me",
    href: "/about",
    preferred: false,
  },
];

const stats = [
  {
    value: "2016",
    label: "Programming Since",
  },
  {
    value: "AI",
    label: "Focus",
  },
  {
    value: "RMIT",
    label: "Computer science final year",
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leo-barnes-081794278/",
    icon: "/social/linkedin.svg",
  },
  {
    label: "GitHub",
    href: "https://github.com/rizo230",
    icon: "/social/github.svg",
  },
];

async function getBackendStatus(): Promise<HealthResponse | null> {
  try {
    const response = await fetch("http://localhost:8090/api/health", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Backend health check failed:", error);
    return null;
  }
}

export default async function Home() {
  const health = await getBackendStatus();

  return (
    <main className="portfolio-home flex-1">
      <div className="portfolio-home-glow" aria-hidden="true" />

      <section className="portfolio-hero" aria-labelledby="home-heading">
        <aside className="portfolio-profile-card">
          <div className="portfolio-profile-art">
            <span>LB</span>
          </div>

          <h2 className="portfolio-profile-name">Leo Barnes</h2>

          <p className="portfolio-profile-copy">
            Computer science student passionate about AI, robotics, and all
            things software development.
          </p>

          <ul className="portfolio-social-list">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio-social-link"
                  aria-label={`${item.label} opens in a new tab`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="portfolio-hero-content">
          <h1 id="home-heading" className="portfolio-display">
            <span>AI</span>
            <span>Robotics</span>
            <span className="portfolio-display-muted">Software</span>
          </h1>

          <p className="portfolio-lede">
            Software, AI, robotics, and infrastructure projects.
          </p>

          <dl className="portfolio-stats">
            {stats.map((item) => (
              <div key={item.label}>
                <dt>{item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="portfolio-project-grid">
            {projectLinks.map((item, index) => (
              <li
                key={item.href}
                className={`portfolio-project-card portfolio-project-card-${
                  index + 1
                }`}
              >
                <a href={item.href}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <span aria-hidden="true" className="portfolio-card-arrow">
                    {"->"}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="portfolio-page-grid">
            {pageLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`portfolio-page-card ${
                    item.preferred ? "is-preferred" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="portfolio-status">
        <p>
          Backend status:{" "}
          <strong>
            {health?.status === "ok" ? "Connected" : "Unavailable"}
          </strong>
        </p>
      </section>
    </main>
  );
}
