import { ProjectCard } from "@/components/ProjectGrid";

const project = {
  title: "Home Lab",
  category: "Infrastructure",
  description:
    "A self-hosted environment for learning infrastructure, running services, and experimenting with automation.",
  skills: ["Linux", "Docker", "Networking"],
  theme: "dark",
} as const;

export default function HomeLabProject() {
  return (
    <ProjectCard {...project}>
      <p className="portfolio-projects-detail-copy">
        My home lab is an evolving environment for hosting personal services and
        testing infrastructure ideas safely. It includes containerised workloads,
        networking, monitoring, backups, and automated deployment experiments.
        This sample description can later include hardware specifications,
        architecture diagrams, and the services currently running.
      </p>
    </ProjectCard>
  );
}
