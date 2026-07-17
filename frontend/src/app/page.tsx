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
    <main>
      <h1>Leo Barnes</h1>
      <p>Software, AI, robotics and infrastructure projects.</p>

      <p>
        Backend status:{" "}
        <strong>{health?.status === "ok" ? "Connected" : "Unavailable"}</strong>
      </p>
    </main>
  );
}
