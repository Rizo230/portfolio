import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects | Leo Barnes",
  description: "Selected software, AI, robotics, and infrastructure projects.",
};

const projects = [
  {
    title: "Autonomous Macadamia Orchard Robot",
    category: "Robotics",
    description:
      "A ROS 2 autonomy system for detecting orchard trees, generating approach waypoints, and running spiral coverage behaviour.",
    details:
      "This project was one of my favorite (and most difficult) projects I undertook in my time at RMIT. It turns out, creating an autonomous robot is much harder than you might think! or at least harder than I expected it to be, and I thought it was going to be pretty hard. Creating these systems involves many complex subsystems, from computer vision, localization, path planning, decision making, control and more, all coming together seamlessly, consistently, and in real time for a reliable result.\n\nIn the words of my professor Dr Timothy Wiley, 'The real world sucks!'. When you stack all these complex systems on top of eachother and try to get them running in real life, things inevitably break (sometimes not even the things made by students). This complexity and difficulty is probably why it was also one of my favorite projects, there where so many topics to explore and learn about, and it really pushed me as a developer.",
    skills: ["Python", "ROS 2", "Nav2", "OpenCV", "OMPL"],
    caseStudy: {
      summary:
        "I worked on a modular ROS 2 autonomy system built around a three-tier architecture. The deliberative layer was handled by an orchard control state machine, which controlled the high-level mission flow: detect the orchard, choose the next tree, request navigation, trigger tree coverage, mark trees as visited, and return home once the mission was complete. The sequencing layer was split into focused ROS nodes for boundary filtering, tree mapping, tree memory, waypoint planning, OMPL path planning, Nav2 path dispatch, and spiral coverage behaviour. Each node communicated through explicit topics and actions, which made the system easier to test in isolation and easier to integrate into a complete multi-tree mission. The reactive layer relied on slam_toolbox and Nav2 for localisation, occupancy-grid updates, obstacle-aware movement, and low-level actuation. On top of that stack, the system used occupancy-grid tree detection, configurable orchard boundaries, smoothed tree estimates, nearest-unvisited-tree selection, approach waypoint generation, Nav2 action clients, and circular or square spiral behaviours to service detected macadamia trees.",
      metrics: [
        {
          value: "7",
          label: "Mission nodes",
          detail:
            "Controller, detection, filtering, memory, planning, navigation, and behaviour",
        },
        {
          value: "0.180s",
          label: "RRTConnect planning",
          detail:
            "Approximate average path calculation time over five report runs",
        },
        {
          value: "1.047s",
          label: "RRT* planning",
          detail:
            "Approximate average calculation time for a shorter reported path",
        },
        {
          value: "4",
          label: "Coverage modes",
          detail:
            "Circular and square spirals with direct steering and Nav2 waypoint variants",
        },
      ],
      pipelineTitle: "Autonomy pipeline",
      pipeline: [
        "Filter orchard map",
        "Detect tree contours",
        "Smooth tree memory",
        "Plan next waypoint",
        "Navigate with Nav2",
        "Run spiral coverage",
        "Mark tree visited",
        "Return home",
      ],
      samples: [],
      chartsTitle: "Project visuals",
      charts: [
        {
          title: "Three-tier ROS 2 software architecture",
          image: "/projects/macadamia/software-architecture.png",
          width: 1160,
          height: 550,
          featured: true,
        },
        {
          title: "Mission flow and state sequencing",
          image: "/projects/macadamia/mission-flow.png",
          width: 1062,
          height: 502,
          featured: true,
        },
        {
          title: "Nav2 spiral coverage path planning",
          image: "/projects/macadamia/spiral-nav2-path.png",
          width: 2058,
          height: 1776,
          featured: true,
        },
      ],
      reflectionTitle: "Engineering tradeoffs",
      reflection:
        "The strongest parts of the project were the deterministic mission sequencing and the clear ROS topic boundaries between nodes. The main limitations were drift during round spiral behaviour, limited recovery when a state failed, and unreliable Nav2 execution for local spiral waypoint batches. The next improvements would be explicit retry policies, mission-history logging, and a cleaner split between tree-centre poses and approach-waypoint poses.",
    },
  },
  {
    title: "AI-Powered Cell Identification",
    category: "AI",
    description:
      "A computer-vision project using deep learning to classify isolated cells in microscopy images.",
    details:
      "This project was my introduction to computer vision and deep learning, through hands on experimentation with CNNs. This served as a fantastic foundation for my future work in AI, helping me learn the pipeline of data collection, data preparation, model training, and evaluation.",
    skills: ["Python", "TensorFlow / Keras", "CNN Development"],
    download: {
      label: "Download project notebook",
      href: "/projects/cell-identification/Cell_Classifier.ipynb",
      filename: "Cell_Classifier.ipynb",
    },
    caseStudy: {
      summary:
        "I built and evaluated convolutional neural networks for two supervised-learning tasks: identifying whether an isolated cell was cancerous and classifying it as one of four cell types. The models were trained on 9,896 labelled 27×27 microscopy images using augmentation, class weighting, and early stopping.",
      metrics: [
        {
          value: "92.47%",
          label: "Cancer classification",
          detail: "Test accuracy · 0.2033 loss",
        },
        {
          value: "78.89%",
          label: "Cell-type classification",
          detail: "Test accuracy · 0.5441 loss",
        },
      ],
      pipeline: [
        "Microscopy image",
        "Data augmentation",
        "CNN feature learning",
        "Cell classification",
      ],
      samples: [
        {
          label: "Fibroblast",
          image: "/projects/cell-identification/fibroblast.png",
        },
        {
          label: "Inflammatory",
          image: "/projects/cell-identification/inflammatory.png",
        },
        {
          label: "Epithelial",
          image: "/projects/cell-identification/epithelial.png",
        },
        {
          label: "Other",
          image: "/projects/cell-identification/other.png",
        },
      ],
      charts: [
        {
          title: "Cancer classification training",
          image: "/projects/cell-identification/cancer-training.png",
        },
        {
          title: "Cell-type classification training",
          image: "/projects/cell-identification/type-training.png",
        },
      ],
      reflection:
        "The project showed me that model complexity does not automatically improve results. A simplified ReLU model performed best for cancer classification, while PReLU and early stopping produced the strongest balance for cell-type classification. It also reinforced that a medical classifier should be treated as a screening aid, not a standalone diagnostic tool.",
    },
  },
  {
    title: "Home Lab",
    category: "Infrastructure",
    description:
      "A self-hosted environment for learning infrastructure, running services, and experimenting with automation.",
    details:
      "My home lab is an evolving environment for hosting personal services and testing infrastructure ideas safely. It includes containerised workloads, networking, monitoring, backups, and automated deployment experiments. This sample description can later include hardware specifications, architecture diagrams, and the services currently running.",
    skills: ["Linux", "Docker", "Networking"],
  },
  {
    title: "Pokemon: AR TCG",
    category: "Games Design",
    description:
      "A mixed-reality trading card game prototype that brings physical Pokémon cards into an interactive digital world.",
    details:
      "Pokémon: AR TCG was a mixed-reality game design experiment focused on connecting familiar physical cards with animated digital interactions. The prototype investigated card recognition, spatial interfaces, player feedback, and the constraints of evolving AR tooling. This sample description can be replaced with a development retrospective and gameplay footage.",
    skills: ["MR development", "Deprecated Software", "Development Hell"],
  },
  {
    title: "Portfolio Website",
    category: "Full Stack",
    description:
      "The full-stack portfolio site you are reading now, built to showcase projects, contact workflows, and future interactive demos.",
    details:
      "This portfolio is a full-stack personal site built with a Next.js frontend and a Go REST API. The frontend focuses on a responsive project showcase with animated route transitions, expandable case-study cards, a contact page, and a design system that can grow as new work is added. The backend currently provides health and contact endpoints, with the structure in place for self-hosted deployment and future live project integrations.\n\nI built it as both a portfolio and a practical engineering platform: something polished enough to represent my work, but simple enough to keep extending with demos, infrastructure experiments, and deeper technical writeups.",
    skills: ["Next.js", "TypeScript", "Go", "Tailwind CSS", "REST APIs"],
    caseStudy: {
      summary:
        "The site is organized as a small full-stack application with a typed Next.js frontend, reusable portfolio components, and a Go backend for API-backed features. The project cards are data-driven, expandable, and support richer case-study content without requiring a separate route for every project.",
      metrics: [
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
          value: "1",
          label: "Reusable showcase",
          detail: "Shared project grid component for compact and expanded cards",
        },
        {
          value: "100%",
          label: "Responsive target",
          detail: "Desktop and mobile layouts designed from the same component set",
        },
      ],
      pipelineTitle: "Site architecture",
      pipeline: [
        "Define project content",
        "Render typed cards",
        "Expand case studies",
        "Handle contact flow",
        "Check API health",
        "Prepare deployment",
      ],
      samples: [],
      chartsTitle: "Implementation focus",
      charts: [],
      reflectionTitle: "Why it matters",
      reflection:
        "The site gives me a controlled place to turn project work into readable case studies and interactive demos. The next improvements are moving project content into a content layer, adding richer media for each card, and connecting the deployment path to my home lab.",
    },
  },
];

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

        <ProjectGrid projects={projects} />
      </section>
    </main>
  );
}
