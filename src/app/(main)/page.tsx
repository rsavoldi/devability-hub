
import { RoadmapDisplay } from "@/components/roadmap/RoadmapDisplay";

export default function HomePage() {
  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Trilhas de Conhecimento <span role="img" aria-label="trilhas">🗺️</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Navegue pelas trilhas e expanda seus conhecimentos sobre desenvolvimento e inclusão.
        </p>
      </header>
      <RoadmapDisplay />
    </div>
  );
}

    