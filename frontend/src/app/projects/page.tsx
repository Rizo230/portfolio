import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Leo Barnes",
  description: "Selected software, AI, robotics, and infrastructure projects.",
};

const projects = [
  {
    title: "Macadamia Challenge",
    category: "Robotics",
    description: "",
    skills: ["Python", "ROS", "Systems Architecture Design"],
  },
  {
    title: "AI-Powered Cell Identification",
    category: "AI",
    description: "",
    skills: ["Python", "PyTorch", "CNN Development"],
  },
  {
    title: "Home Lab",
    category: "Infrastructure",
    description: "",
    skills: [],
  },
  {
    title: "Pokemon: AR TCG",
    category: "Games Design",
    description: "",
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
        A sample of my favourite and best software projects across uni and my
        experiments at home, showing off everything from autonomous robots and
        computer vision, to mixed reality game design and homelabbing.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col rounded-2xl border border-black/10 p-6 dark:border-white/10"
          >
            <p className="text-sm font-medium text-accent">
              {project.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{project.title}</h2>
            <p className="mt-4 flex-1 leading-7 text-foreground/70">
              {project.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="skills">
              {project.skills.map((technology) => (
                <li
                  key={technology}
                  className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}
