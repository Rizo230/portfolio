import Image from "next/image";
import { ProjectCard } from "@/components/ProjectGrid";

const project = {
  title: "Autonomous Macadamia Orchard Robot",
  category: "Robotics",
  description:
    "A ROS 2 autonomy system for detecting orchard trees, generating approach waypoints, and running spiral coverage behaviour.",
  skills: ["Python", "ROS 2", "Nav2", "OpenCV", "OMPL"],
  theme: "rust",
} as const;

const missionNodes = [
  {
    value: "7",
    label: "Mission nodes",
    detail:
      "Controller, detection, filtering, memory, planning, navigation, and behaviour",
  },
  {
    value: "0.180s",
    label: "RRTConnect planning",
    detail: "Approximate average path calculation time over five report runs",
  },
  {
    value: "1.047s",
    label: "RRT* planning",
    detail: "Approximate average calculation time for a shorter reported path",
  },
  {
    value: "4",
    label: "Coverage modes",
    detail:
      "Circular and square spirals with direct steering and Nav2 waypoint variants",
  },
];

const autonomyPipeline = [
  "Filter orchard map",
  "Detect tree contours",
  "Smooth tree memory",
  "Plan next waypoint",
  "Navigate with Nav2",
  "Run spiral coverage",
  "Mark tree visited",
  "Return home",
];

const projectVisuals = [
  {
    title: "Three-tier ROS 2 software architecture",
    image: "/projects/macadamia/software-architecture.png",
    width: 1160,
    height: 550,
  },
  {
    title: "Mission flow and state sequencing",
    image: "/projects/macadamia/mission-flow.png",
    width: 1062,
    height: 502,
  },
  {
    title: "Nav2 spiral coverage path planning",
    image: "/projects/macadamia/spiral-nav2-path.png",
    width: 2058,
    height: 1776,
  },
];

export default function AutonomousMacadamiaProject() {
  return (
    <ProjectCard {...project}>
      <p className="portfolio-projects-detail-copy">
        This project was one of my favorite (and most difficult) projects I
        undertook in my time at RMIT. It turns out, creating an autonomous robot
        is much harder than you might think! or at least harder than I expected
        it to be, and I thought it was going to be pretty hard. Creating these
        systems involves many complex subsystems, from computer vision,
        localization, path planning, decision making, control and more, all
        coming together seamlessly, consistently, and in real time for a reliable
        result.
        {"\n\n"}
        In the words of my professor Dr Timothy Wiley, &quot;The real world
        sucks!&quot;. When you stack all these complex systems on top of eachother
        and try to get them running in real life, things inevitably break
        (sometimes not even the things made by students). This complexity and
        difficulty is probably why it was also one of my favorite projects,
        there where so many topics to explore and learn about, and it really
        pushed me as a developer.
      </p>

      <div className="portfolio-projects-case-study">
        <div className="portfolio-projects-case-block portfolio-projects-overview">
          <h3>The project</h3>
          <p>
            I worked on a modular ROS 2 autonomy system built around a
            three-tier architecture. The deliberative layer was handled by an
            orchard control state machine, which controlled the high-level
            mission flow: detect the orchard, choose the next tree, request
            navigation, trigger tree coverage, mark trees as visited, and return
            home once the mission was complete. The sequencing layer was split
            into focused ROS nodes for boundary filtering, tree mapping, tree
            memory, waypoint planning, OMPL path planning, Nav2 path dispatch,
            and spiral coverage behaviour. Each node communicated through
            explicit topics and actions, which made the system easier to test in
            isolation and easier to integrate into a complete multi-tree mission.
          </p>
        </div>

        <dl className="portfolio-projects-metrics portfolio-projects-overview-metrics">
          {missionNodes.map((metric) => (
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
          <h3>Autonomy pipeline</h3>
          <ol className="portfolio-projects-pipeline">
            {autonomyPipeline.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="portfolio-projects-case-block portfolio-projects-charts-block is-wide">
          <h3>Project visuals</h3>
          <div className="portfolio-projects-charts">
            {projectVisuals.map((visual) => (
              <figure key={visual.title} className="is-featured">
                <Image
                  src={visual.image}
                  alt={visual.title}
                  width={visual.width}
                  height={visual.height}
                  sizes="90vw"
                  className="portfolio-projects-chart-image"
                />
                <figcaption>{visual.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="portfolio-projects-reflection">
          <h3>Engineering tradeoffs</h3>
          <p>
            The strongest parts of the project were the deterministic mission
            sequencing and the clear ROS topic boundaries between nodes. The main
            limitations were drift during round spiral behaviour, limited
            recovery when a state failed, and unreliable Nav2 execution for local
            spiral waypoint batches. The next improvements would be explicit
            retry policies, mission-history logging, and a cleaner split between
            tree-centre poses and approach-waypoint poses.
          </p>
        </div>
      </div>
    </ProjectCard>
  );
}
