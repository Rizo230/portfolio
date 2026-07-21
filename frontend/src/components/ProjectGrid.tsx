"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Project = {
  title: string;
  category: string;
  description: string;
  details: string;
  skills: string[];
  download?: {
    label: string;
    href: string;
    filename?: string;
  };
  caseStudy?: {
    summary: string;
    metrics: { value: string; label: string; detail: string }[];
    pipelineTitle?: string;
    pipeline: string[];
    samplesTitle?: string;
    samplesDescription?: string;
    samples: { label: string; image: string }[];
    chartsTitle?: string;
    charts: {
      title: string;
      image: string;
      width?: number;
      height?: number;
      featured?: boolean;
    }[];
    reflectionTitle?: string;
    reflection: string;
  };
};

function projectCardId(title: string) {
  return `project-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const pendingCardScroll = useRef<string | null>(null);
  const orderedProjects = expandedProject
    ? [
        ...projects.filter((project) => project.title === expandedProject),
        ...projects.filter((project) => project.title !== expandedProject),
      ]
    : projects;

  useLayoutEffect(() => {
    if (pendingCardScroll.current === null) return;

    const target = document.getElementById(pendingCardScroll.current);
    pendingCardScroll.current = null;

    requestAnimationFrame(() => {
      target?.scrollIntoView({ block: "start" });
    });
  }, [expandedProject]);

  useEffect(() => {
    if (!window.location.hash) return;

    const cardId = decodeURIComponent(window.location.hash.slice(1));
    const linkedProject = projects.find(
      (project) => projectCardId(project.title) === cardId,
    );
    if (!linkedProject) return;

    pendingCardScroll.current = cardId;
    const frame = requestAnimationFrame(() => {
      setExpandedProject(linkedProject.title);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [projects]);

  return (
    <div className="portfolio-projects-grid [overflow-anchor:none]">
      {orderedProjects.map((project) => {
        const isExpanded = expandedProject === project.title;
        const cardId = projectCardId(project.title);
        const panelId = `${cardId}-details`;
        const projectIndex = projects.findIndex(
          (item) => item.title === project.title,
        );

        return (
          <article
            id={cardId}
            key={project.title}
            className={`portfolio-projects-card portfolio-projects-card-${
              projectIndex + 1
            } ${isExpanded ? "is-expanded" : ""} scroll-mt-24`}
          >
            <button
              type="button"
              onClick={() => {
                pendingCardScroll.current = cardId;
                setExpandedProject(isExpanded ? null : project.title);
              }}
              className="portfolio-projects-toggle"
              aria-expanded={isExpanded}
              aria-controls={panelId}
            >
              <span className="portfolio-projects-category">
                {project.category}
              </span>
              <span className="portfolio-projects-title">{project.title}</span>
              <span className="portfolio-projects-description">
                {project.description}
              </span>
              <span className="portfolio-projects-action">
                {isExpanded ? "Show less" : "Show more"}
              </span>
              <span
                aria-hidden="true"
                className={`portfolio-card-arrow ${
                  isExpanded ? "is-expanded" : ""
                }`}
              >
                {"->"}
              </span>
            </button>

            <ul
              className="portfolio-projects-skills"
              aria-label={`${project.title} skills`}
            >
              {project.skills.map((technology) => (
                <li key={technology}>
                  {technology}
                </li>
              ))}
            </ul>

            <section
              id={panelId}
              aria-label={`${project.title} details`}
              aria-hidden={!isExpanded}
              hidden={!isExpanded}
              inert={!isExpanded}
              className="portfolio-projects-panel"
            >
              <div className="portfolio-projects-panel-inner">
                <div className="portfolio-projects-detail">
                  <p className="portfolio-projects-detail-copy">
                    {project.details}
                  </p>

                  {project.download && (
                    <a
                      className="portfolio-projects-download"
                      href={project.download.href}
                      download={project.download.filename}
                    >
                      {project.download.label}
                      <span aria-hidden="true">↓</span>
                    </a>
                  )}

                  {project.caseStudy && (
                    <div className="portfolio-projects-case-study">
                      <div className="portfolio-projects-case-block portfolio-projects-overview">
                        <h3>The project</h3>
                        <p>
                          {project.caseStudy.summary}
                        </p>
                      </div>

                      <dl className="portfolio-projects-metrics portfolio-projects-overview-metrics">
                        {project.caseStudy.metrics.map((metric) => (
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
                        <h3>
                          {project.caseStudy.pipelineTitle ?? "Model pipeline"}
                        </h3>
                        <ol className="portfolio-projects-pipeline">
                          {project.caseStudy.pipeline.map((step, index) => (
                            <li key={step}>
                              <span>
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {project.caseStudy.samples.length > 0 && (
                        <div className="portfolio-projects-case-block portfolio-projects-samples-block">
                          <h3>
                            {project.caseStudy.samplesTitle ??
                              "Labelled dataset samples"}
                          </h3>
                          <p className="portfolio-projects-supporting-copy">
                            {project.caseStudy.samplesDescription ??
                              "Representative 27×27 microscopy images used by the classifier."}
                          </p>
                          <div className="portfolio-projects-samples">
                            {project.caseStudy.samples.map((sample) => (
                              <figure key={sample.label}>
                                <Image
                                  src={sample.image}
                                  alt={sample.label}
                                  width={270}
                                  height={270}
                                  sizes="(min-width: 640px) 20vw, 40vw"
                                  className="portfolio-projects-sample-image"
                                />
                                <figcaption>
                                  {sample.label}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.caseStudy.charts.length > 0 && (
                        <div
                          className={`portfolio-projects-case-block portfolio-projects-charts-block ${
                            project.caseStudy.samples.length === 0
                              ? "is-wide"
                              : ""
                          }`}
                        >
                          <h3>
                            {project.caseStudy.chartsTitle ?? "Training results"}
                          </h3>
                          <div className="portfolio-projects-charts">
                            {project.caseStudy.charts.map((chart) => (
                              <figure
                                key={chart.title}
                                className={`${
                                  chart.featured ? "is-featured" : ""
                                }`}
                              >
                                <Image
                                  src={chart.image}
                                  alt={chart.title}
                                  width={chart.width ?? 861}
                                  height={chart.height ?? 448}
                                  sizes={
                                    chart.featured
                                      ? "90vw"
                                      : "(min-width: 1024px) 45vw, 90vw"
                                  }
                                  className="portfolio-projects-chart-image"
                                />
                                <figcaption>
                                  {chart.title}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="portfolio-projects-reflection">
                        <h3>
                          {project.caseStudy.reflectionTitle ?? "What I learned"}
                        </h3>
                        <p>
                          {project.caseStudy.reflection}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </article>
        );
      })}
    </div>
  );
}
