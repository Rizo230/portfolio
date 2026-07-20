import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects | Leo Barnes",
  description: "Selected software, AI, robotics, and infrastructure projects.",
};

const projects = [
  {
    title: "Macadamia Challenge",
    category: "Robotics",
    description:
      "An autonomous robotics system built to navigate, identify, and interact with objects in a competition environment.",
    details:
      "The Macadamia Challenge brought together perception, planning, and control in one autonomous robot. Our team designed a modular ROS architecture, integrated sensor data, and iterated on navigation behaviours through simulation and physical testing. This sample description can be replaced with details about the challenge, my contribution, and the final results.",
    skills: ["Python", "ROS", "Systems Architecture Design"],
  },
  {
    title: "AI-Powered Cell Identification",
    category: "AI",
    description:
      "A computer-vision project using deep learning to classify isolated cells in microscopy images.",
    details:
      "This project was my introduction to computer vision and deep learning, through hands on experimentation with CNNs. This served as a fantastic foundation for my future work in AI, helping me learn the pipeline of data collection, data preparation, model training, and evaluation.",
    skills: ["Python", "TensorFlow / Keras", "CNN Development"],
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
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Projects
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
        Selected uni work and home experiments.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
        A few of my favourite and best software projects across uni and my
        experiments at home, showing off everything from autonomous robots and
        computer vision, to mixed reality game design and homelabbing.
      </p>

      <ProjectGrid projects={projects} />
    </main>
  );
}
