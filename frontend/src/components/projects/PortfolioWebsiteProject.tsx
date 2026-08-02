import { ProjectCard } from "@/components/ProjectGrid";

const project = {
  title: "Portfolio Website",
  category: "Full Stack",
  description:
    "The full-stack portfolio site you are reading now, built to showcase projects, contact workflows, and future interactive demos.",
  skills: ["Next.js", "TypeScript", "Go", "Tailwind CSS", "REST APIs"],
  theme: "blue",
} as const;

const siteMetrics = [
  {
    value: "4",
    label: "Core routes",
    detail: "Home, about, projects, and contact",
  },
  {
    value: "2",
    label: "Runtime layers",
    detail: "Next.js frontend and Go API",
  },
  {
    value: "5",
    label: "Project modules",
    detail: "Each project can now own its expanded layout and content",
  },
  {
    value: "100%",
    label: "Responsive target",
    detail: "Desktop and mobile layouts designed from the same component set",
  },
];

const siteArchitecture = [
  "Define project shell",
  "Write project components",
  "Expand custom sections",
  "Handle contact flow",
  "Check API health",
  "Prepare deployment",
];

export default function PortfolioWebsiteProject() {
  return (
    <ProjectCard {...project}>
      <p className="portfolio-projects-detail-copy">
        This portfolio is a full-stack personal site built with a Next.js
        frontend and a Go REST API. The frontend focuses on a responsive project
        showcase with animated route transitions, expandable case-study cards, a
        contact page, and a design system that can grow as new work is added.
        The backend currently provides health and contact endpoints, with the
        structure in place for self-hosted deployment and future live project
        integrations.
        {"\n\n"}I built it as both a portfolio and a practical engineering platform:
        something polished enough to represent my work, but simple enough to
        keep extending with demos, infrastructure experiments, and deeper
        technical writeups.
      </p>

      <div className="portfolio-projects-case-study">
        <div className="portfolio-projects-case-block portfolio-projects-overview">
          <h3>The project</h3>
          <p>
            The site is organized as a small full-stack application with a typed
            Next.js frontend, reusable portfolio shell components, project-owned
            content components, and a Go backend for API-backed features. The
            project cards are expandable, but each project can now decide its own
            expanded layout without requiring a separate route.
          </p>
        </div>

        <dl className="portfolio-projects-metrics portfolio-projects-overview-metrics">
          {siteMetrics.map((metric) => (
            <div key={metric.label}>
              <dd className="portfolio-projects-metric-value">
                {metric.value}
              </dd>
              <dt>{metric.label}</dt>
              <dd className="portfolio-projects-metric-detail">
                {metric.detail}
              </dd>
            </div>
          ))}
        </dl>

        <div className="portfolio-projects-case-block portfolio-projects-pipeline-block">
          <h3>Site architecture</h3>
          <ol className="portfolio-projects-pipeline">
            {siteArchitecture.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="portfolio-projects-reflection">
          <h3>Why it matters</h3>
          <p>
            The site gives me a controlled place to turn project work into
            readable case studies and interactive demos. The next improvements
            are adding richer media for each card and connecting the deployment
            path to my home lab.
          </p>
        </div>
      </div>
    </ProjectCard>
  );
}
