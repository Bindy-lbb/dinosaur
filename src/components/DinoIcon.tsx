import type { SpeciesId } from "../data/dinosaurs";

const paths: Partial<Record<SpeciesId, string>> = {
  triceratops:
    "M3 38c10-1 17-7 22-15 5-8 18-10 28-5l9 5 1-14 5 9 9-9-4 15 12-8-7 13 12 1-7 8-12 2-1 12h-7l-2-10-9-2-2 12h-7l-1-12-13-1-5 10h-7l1-12c-8 2-15 2-19-1z",
  tyrannosaurus:
    "M2 44c17-4 20-16 29-23 8-6 19-4 24-11l7-8 15 2 8 7-2 9-17-1-7 8 3 7-5 1-3-6-8 7-2 10 9 2 1 4H41l-3-8 1-8-6 4-4 8 5 2v4H21l2-10 4-8C18 43 9 47 2 44z",
  ankylosaurus:
    "M2 34l8-5 7 3 7-7 3-9 7 3 5-8 6 6 7-4 4 6 8-2 4 8 7 2 10 7-4 7-12 1-4 9h-7l-1-10-23-1-3 11h-7l-1-12-9-5-7 4z",
  spinosaurus:
    "M2 39l19-7 9-12 4-19 6 5 7-8 5 10 5-2 4 15 5 2 9-4 15 2-1 5-22 4-8 6-2 7 6 5h-9l-4-8-8-1-3 13h-9l3-17-10 4L2 45z",
  deinocheirus:
    "M2 34l24-8 8-17 10-2 12 12 5-8 2-11 8-3 5 7 10 1-1 6-14 3-1 14-9 9-7-2-7 4-1 11 9 3H41l-3-13-7-3-3 12 5 4H22l4-17z",
  carcharodontosaurus:
    "M1 42l23-14 9-10 14-2 12-9 15-7 13 7-1 10-18 1-9 9 4 6-6 1-5-4-7 5-2 12 10 3H40l-3-8 1-10-7 5-4 10 6 4H20l4-15z",
  stegosaurus: "M3 39l18-9 3-14 7 5 4-13 8 7 9-10 7 15 9-3 4 10 13 8-3 6-14 1-2 10h-7l-2-12-19-1-3 13h-7l-1-13-12-1-8 4z",
  paluxysaurus: "M1 38l23-10 14-3 19 4 8-10 2-23 5-7 9 1 6 6-2 5-10-1-1 24-8 13-2 18h-7l-1-17-14-2-3 19h-7l-1-20-14-1z",
  tylosaurus: "M2 32l20-7 18-5 22 3 13-3 12 7-1 7-21 1-9 12-5-2 2-12-19 2-12 9-4-3 4-10-15 1-5-15 8 5z",
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
      <path d={paths[species] ?? (species === "regaliceratops" ? paths.triceratops : species === "therizinosaurus" ? paths.deinocheirus : paths.tyrannosaurus)} fill="currentColor" />
    </svg>
  );
}
