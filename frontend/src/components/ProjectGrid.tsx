"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ProjectCardTheme = "rust" | "teal" | "dark" | "green" | "blue";

export type ProjectCardSummary = {
  title: string;
  category: string;
  description: string;
  skills: readonly string[];
  theme: ProjectCardTheme;
};

type ProjectGridContextValue = {
  expandedCardId: string | null;
  toggleCard: (cardId: string) => void;
};

const ProjectGridContext = createContext<ProjectGridContextValue | null>(null);

export function projectCardId(title: string) {
  return `project-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export default function ProjectGrid({ children }: { children: ReactNode }) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const pendingCardScroll = useRef<string | null>(null);

  const toggleCard = (cardId: string) => {
    pendingCardScroll.current = cardId;
    setExpandedCardId((currentCardId) =>
      currentCardId === cardId ? null : cardId,
    );
  };

  useLayoutEffect(() => {
    if (pendingCardScroll.current === null) return;

    const target = document.getElementById(pendingCardScroll.current);
    pendingCardScroll.current = null;

    requestAnimationFrame(() => {
      target?.scrollIntoView({ block: "start" });
    });
  }, [expandedCardId]);

  useEffect(() => {
    if (!window.location.hash) return;

    const cardId = decodeURIComponent(window.location.hash.slice(1));
    if (!document.getElementById(cardId)) return;

    pendingCardScroll.current = cardId;
    const frame = requestAnimationFrame(() => {
      setExpandedCardId(cardId);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ProjectGridContext.Provider value={{ expandedCardId, toggleCard }}>
      <div className="portfolio-projects-grid [overflow-anchor:none]">
        {children}
      </div>
    </ProjectGridContext.Provider>
  );
}

export function ProjectCard({
  title,
  category,
  description,
  skills,
  theme,
  children,
}: ProjectCardSummary & { children: ReactNode }) {
  const grid = useContext(ProjectGridContext);

  if (!grid) {
    throw new Error("ProjectCard must be rendered inside ProjectGrid.");
  }

  const cardId = projectCardId(title);
  const panelId = `${cardId}-details`;
  const isExpanded = grid.expandedCardId === cardId;
  const toggleProject = () => grid.toggleCard(cardId);

  return (
    <article
      id={cardId}
      className={`portfolio-projects-card portfolio-projects-card--${theme} ${
        isExpanded ? "is-expanded" : ""
      } scroll-mt-24`}
    >
      <button
        type="button"
        onClick={toggleProject}
        className="portfolio-projects-toggle"
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        <span className="portfolio-projects-category">{category}</span>
        <span className="portfolio-projects-title">{title}</span>
        <span className="portfolio-projects-description">{description}</span>
        <span className="portfolio-projects-action">
          {isExpanded ? "Show less" : "Show more"}
        </span>
        <span
          aria-hidden="true"
          className={`portfolio-card-arrow ${isExpanded ? "is-expanded" : ""}`}
        >
          {"->"}
        </span>
      </button>

      <ul
        className="portfolio-projects-skills"
        onClick={!isExpanded ? toggleProject : undefined}
        aria-label={`${title} skills`}
      >
        {skills.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>

      <section
        id={panelId}
        aria-label={`${title} details`}
        aria-hidden={!isExpanded}
        hidden={!isExpanded}
        inert={!isExpanded}
        className="portfolio-projects-panel"
      >
        <div className="portfolio-projects-panel-inner">
          <div className="portfolio-projects-detail">{children}</div>
        </div>
      </section>
    </article>
  );
}
