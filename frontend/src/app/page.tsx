type HealthResponse = {
  status: string;
};

async function getBackendStatus(): Promise<HealthResponse | null> {
  try {
    const response = await fetch("http://localhost:8080/api/health", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getBackendStatus();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20">
      <section>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Leo Barnes
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          Software, AI, robotics, and infrastructure projects.
        </p>
      </section>

      <section className="mt-16 border-t border-black/10 pt-8 dark:border-white/10">
        <p>
          Backend status:{" "}
          <strong>
            {health?.status === "ok" ? "Connected" : "Unavailable"}
          </strong>
        </p>
      </section>
    </main>
  );
}
