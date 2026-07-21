"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Project = {
  title: string;
  category: string;
  description: string;
  details: string;
  skills: string[];
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
  const scrollPosition = useRef<number | null>(null);
  const pendingCardScroll = useRef<string | null>(null);
  const orderedProjects = expandedProject
    ? [
        ...projects.filter((project) => project.title === expandedProject),
        ...projects.filter((project) => project.title !== expandedProject),
      ]
    : projects;

  useLayoutEffect(() => {
    if (scrollPosition.current !== null) {
      window.scrollTo({ top: scrollPosition.current, behavior: "instant" });
      scrollPosition.current = null;
      return;
    }

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
    <div className="mt-12 grid items-start gap-6 [overflow-anchor:none] md:grid-cols-3">
      {orderedProjects.map((project) => {
        const isExpanded = expandedProject === project.title;
        const cardId = `project-${project.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        const panelId = `${cardId}-details`;

        return (
          <article
            id={cardId}
            key={project.title}
            className={`flex flex-col rounded-2xl border transition-all duration-300 dark:border-white/10 ${
              isExpanded
                ? "border-accent/50 shadow-lg md:col-span-3"
                : "border-black/10 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
            } scroll-mt-24`}
          >
            <button
              type="button"
              onClick={() => {
                scrollPosition.current = window.scrollY;
                setExpandedProject(isExpanded ? null : project.title);
              }}
              className="group w-full cursor-pointer p-6 text-left focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-8"
              aria-expanded={isExpanded}
              aria-controls={panelId}
            >
              <span className="block text-sm font-medium text-accent">
                {project.category}
              </span>
              <span className="mt-2 block text-xl font-semibold">
                {project.title}
              </span>
              <span className="mt-4 block leading-7 text-foreground/70">
                {project.description}
              </span>
              <span className="mt-6 block text-sm font-semibold text-accent">
                {isExpanded ? "Show less" : "View project"}{" "}
                <span
                  aria-hidden="true"
                  className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}
                >
                  →
                </span>
              </span>
            </button>

            <ul
              className="mx-6 mb-6 flex flex-wrap gap-2 sm:mx-8 sm:mb-8"
              aria-label={`${project.title} skills`}
            >
              {project.skills.map((technology) => (
                <li
                  key={technology}
                  className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium"
                >
                  {technology}
                </li>
              ))}
            </ul>

            <section
              id={panelId}
              aria-label={`${project.title} details`}
              aria-hidden={!isExpanded}
              inert={!isExpanded}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                isExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-black/10 p-6 dark:border-white/10 sm:p-8">
                  <p className="max-w-3xl whitespace-pre-line leading-8 text-foreground/75">
                    {project.details}
                  </p>

                  {project.caseStudy && (
                    <div className="mt-10 space-y-12">
                      <div>
                        <h3 className="text-lg font-semibold">The project</h3>
                        <p className="mt-3 max-w-3xl leading-8 text-foreground/75">
                          {project.caseStudy.summary}
                        </p>
                      </div>

                      <dl className="grid gap-4 sm:grid-cols-2">
                        {project.caseStudy.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="rounded-xl border border-accent/30 bg-foreground/[0.02] p-5"
                          >
                            <dd className="text-3xl font-bold tracking-tight text-accent">
                              {metric.value}
                            </dd>
                            <dt className="mt-2 font-semibold">{metric.label}</dt>
                            <dd className="mt-1 text-sm text-foreground/60">
                              {metric.detail}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div>
                        <h3 className="text-lg font-semibold">
                          {project.caseStudy.pipelineTitle ?? "Model pipeline"}
                        </h3>
                        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
                          {project.caseStudy.pipeline.map((step, index) => (
                            <li
                              key={step}
                              className="rounded-xl bg-foreground/5 p-4 text-sm font-medium"
                            >
                              <span className="mr-2 text-accent">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {project.caseStudy.samples.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.caseStudy.samplesTitle ??
                              "Labelled dataset samples"}
                          </h3>
                          <p className="mt-2 text-sm text-foreground/60">
                            {project.caseStudy.samplesDescription ??
                              "Representative 27×27 microscopy images used by the classifier."}
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {project.caseStudy.samples.map((sample) => (
                              <figure
                                key={sample.label}
                                className="overflow-hidden rounded-xl border border-black/10 bg-foreground/[0.02] dark:border-white/10"
                              >
                                <Image
                                  src={sample.image}
                                  alt={sample.label}
                                  width={270}
                                  height={270}
                                  sizes="(min-width: 640px) 20vw, 40vw"
                                  className="aspect-square w-full"
                                />
                                <figcaption className="border-t border-black/10 px-4 py-3 text-sm font-semibold dark:border-white/10">
                                  {sample.label}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.caseStudy.charts.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.caseStudy.chartsTitle ?? "Training results"}
                          </h3>
                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            {project.caseStudy.charts.map((chart) => (
                              <figure
                                key={chart.title}
                                className={`overflow-hidden rounded-xl border border-black/10 dark:border-white/10 ${
                                  chart.featured ? "lg:col-span-2" : ""
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
                                  className="h-auto w-full bg-white"
                                />
                                <figcaption className="border-t border-black/10 px-4 py-3 text-sm font-medium dark:border-white/10">
                                  {chart.title}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border-l-4 border-accent bg-foreground/[0.03] p-5">
                        <h3 className="font-semibold">
                          {project.caseStudy.reflectionTitle ?? "What I learned"}
                        </h3>
                        <p className="mt-2 max-w-3xl leading-7 text-foreground/75">
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
