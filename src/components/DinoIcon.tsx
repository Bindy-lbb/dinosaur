import type { SpeciesId } from "../data/dinosaurs";

const paths: Record<SpeciesId, string> = {
  triceratops:
    "M3 38c10-1 17-7 22-15 5-8 18-10 28-5l9 5 1-14 5 9 9-9-4 15 12-8-7 13 12 1-7 8-12 2-1 12h-7l-2-10-9-2-2 12h-7l-1-12-13-1-5 10h-7l1-12c-8 2-15 2-19-1z",
  tyrannosaurus:
    "M2 44c17-4 20-16 29-23 8-6 19-4 24-11l7-8 15 2 8 7-2 9-17-1-7 8 3 7-5 1-3-6-8 7-2 10 9 2 1 4H41l-3-8 1-8-6 4-4 8 5 2v4H21l2-10 4-8C18 43 9 47 2 44z",
  brachiosaurus:
    "M3 42c10-2 20-9 26-15 5-4 15-3 23-3 7-5 9-15 11-25 1-7 4-10 9-9l6 5-1 6-5-1c-2 9-1 20-7 29l-1 15h-6l-1-13-9 1-1 13h-6l-2-12-9-1-4 12h-6l1-13c-6 5-14 8-18 6z",
};
export default function DinoIcon({
  species,
  className = "",
}: {
  species: SpeciesId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 -12 90 72"
      className={`dino-icon ${className}`}
      aria-hidden="true"
    >
      <path d={paths[species]} fill="currentColor" />
    </svg>
  );
}
