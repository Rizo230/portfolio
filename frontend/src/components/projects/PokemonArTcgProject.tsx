import { ProjectCard } from "@/components/ProjectGrid";

const project = {
  title: "Pokemon: AR TCG",
  category: "Games Design",
  description:
    "A mixed-reality trading card game prototype that brings physical Pokemon cards into an interactive digital world.",
  skills: ["MR development", "Deprecated Software", "Development Hell"],
  theme: "green",
} as const;

export default function PokemonArTcgProject() {
  return (
    <ProjectCard {...project}>
      <p className="portfolio-projects-detail-copy">
        Pokemon: AR TCG was a mixed-reality game design experiment focused on
        connecting familiar physical cards with animated digital interactions.
        The prototype investigated card recognition, spatial interfaces, player
        feedback, and the constraints of evolving AR tooling. This sample
        description can be replaced with a development retrospective and
        gameplay footage.
      </p>
    </ProjectCard>
  );
}
