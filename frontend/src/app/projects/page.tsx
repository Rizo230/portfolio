import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import AutonomousMacadamiaProject from "@/components/projects/AutonomousMacadamiaProject";
import CellIdentificationProject from "@/components/projects/CellIdentificationProject";
import HomeLabProject from "@/components/projects/HomeLabProject";
import PokemonArTcgProject from "@/components/projects/PokemonArTcgProject";
import PortfolioWebsiteProject from "@/components/projects/PortfolioWebsiteProject";

export const metadata: Metadata = {
  title: "Projects | Leo Barnes",
  description: "Selected software, AI, robotics, and infrastructure projects.",
};

export default function ProjectsPage() {
  return (
    <main className="portfolio-projects flex-1">
      <div className="portfolio-home-glow" aria-hidden="true" />

      <section
        className="portfolio-projects-shell"
        aria-labelledby="projects-heading"
      >
        <div className="portfolio-projects-hero">
          <p className="portfolio-kicker">Projects</p>
          <h1 id="projects-heading" className="portfolio-projects-display">
            <span>My favorite </span>
            <span className="portfolio-display-muted">projects</span>
          </h1>
          <p className="portfolio-lede">
            A few of my favourite and best software projects across uni and my
            experiments at home, showing off everything from autonomous robots
            and computer vision, to mixed reality game design and homelabbing.
          </p>
        </div>

        <ProjectGrid>
          <AutonomousMacadamiaProject />
          <CellIdentificationProject />
          <HomeLabProject />
          <PokemonArTcgProject />
          <PortfolioWebsiteProject />
        </ProjectGrid>
      </section>
    </main>
  );
}
