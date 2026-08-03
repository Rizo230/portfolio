import Image from "next/image";
import { ProjectCard } from "@/components/ProjectGrid";

const project = {
  title: "AI-Powered Cell Identification",
  category: "AI",
  description:
    "A computer-vision project using deep learning to classify isolated cells in microscopy images.",
  skills: ["Python", "TensorFlow / Keras", "CNN Development"],
  theme: "teal",
} as const;

const classifierMetrics = [
  {
    value: "92.47%",
    label: "Cancer classification",
    detail: "Test accuracy - 0.2033 loss",
  },
  {
    value: "78.89%",
    label: "Cell-type classification",
    detail: "Test accuracy - 0.5441 loss",
  },
];

const modelPipeline = [
  "Microscopy image",
  "Data augmentation",
  "CNN feature learning",
  "Cell classification",
];

const datasetSamples = [
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
];

const trainingCharts = [
  {
    title: "Cancer classification training",
    image: "/projects/cell-identification/cancer-training.png",
  },
  {
    title: "Cell-type classification training",
    image: "/projects/cell-identification/type-training.png",
  },
];

export default function CellIdentificationProject() {
  return (
    <ProjectCard {...project}>
      <p className="portfolio-projects-detail-copy">
        This project was my introduction to computer vision and deep learning,
        through hands on experimentation with CNNs. This served as a fantastic
        foundation for my future work in AI, helping me learn the pipeline of
        data collection, data preparation, model training, and evaluation.
      </p>

      <a
        className="portfolio-projects-download"
        href="/projects/cell-identification/Cell_Classifier.ipynb"
        download="Cell_Classifier.ipynb"
      >
        Download project notebook
      </a>

      <div className="portfolio-projects-case-study">
        <div className="portfolio-projects-case-block portfolio-projects-overview">
          <h3>The project</h3>
          <p>
            I built and evaluated convolutional neural networks for two
            supervised learning tasks, identifying whether a cell was cancerous,
            and classifying it as one of four cell types. The models were
            trained on 9,896 labelled 27x27 microscopy images using
            augmentation, class weighting, and early stopping.
          </p>
        </div>

        <dl className="portfolio-projects-metrics portfolio-projects-overview-metrics">
          {classifierMetrics.map((metric) => (
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
          <h3>Model pipeline</h3>
          <ol className="portfolio-projects-pipeline">
            {modelPipeline.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="portfolio-projects-case-block portfolio-projects-samples-block">
          <h3>Labelled dataset samples</h3>
          <p className="portfolio-projects-supporting-copy">
            Representative 27x27 microscopy images used by the classifier.
          </p>
          <div className="portfolio-projects-samples">
            {datasetSamples.map((sample) => (
              <figure key={sample.label}>
                <Image
                  src={sample.image}
                  alt={sample.label}
                  width={270}
                  height={270}
                  sizes="(min-width: 640px) 20vw, 40vw"
                  className="portfolio-projects-sample-image"
                />
                <figcaption>{sample.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="portfolio-projects-case-block portfolio-projects-charts-block">
          <h3>Training results</h3>
          <div className="portfolio-projects-charts">
            {trainingCharts.map((chart) => (
              <figure key={chart.title}>
                <Image
                  src={chart.image}
                  alt={chart.title}
                  width={861}
                  height={448}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="portfolio-projects-chart-image"
                />
                <figcaption>{chart.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="portfolio-projects-reflection">
          <h3>What I learned</h3>
          <p>
            This project proved to be a great introduction to computer vision
            and deep learning and its workflow. It demonstrated that a more
            complex model doesn't automatically mean better results, with a
            simplified ReLU model performing best for cancer classification,
            while PReLU and early stopping produced the strongest balance for
            cell type classification. It also reinforced that these models can
            never be perfect, and high stakes applications like a medical
            classifier should be treated as a screening aid, not a standalone
            diagnostic tool.
          </p>
        </div>
      </div>
    </ProjectCard>
  );
}
