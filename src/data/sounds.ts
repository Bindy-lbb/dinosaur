import type { SpeciesId } from "./dinosaurs";

export const SOUND_SOURCES = {
  roar: {
    file: "/audio/deep-roar.wav",
    title: "CC0 Deep Monster Roar",
    author: "trazzz123",
    url: "https://opengameart.org/content/cc0-deep-monster-roar",
  },
  rasp: {
    file: "/audio/raspy-call.wav",
    title: "Small Dino Raspy Calls",
    author: "CaveboyTup",
    url: "https://opengameart.org/content/small-dino-raspy-calls",
  },
  forest: {
    file: "/audio/forest-ambience.wav",
    title: "Forest Ambience",
    author: "TinyWorlds",
    url: "https://opengameart.org/node/23888",
  },
  ocean: {
    file: "/audio/water-waves.wav",
    title: "Water Waves",
    author: "transitking / qubodup",
    url: "https://opengameart.org/content/water-waves",
  },
};

// Sound-design choices, not evidence of the animals' actual vocal anatomy.
export const SPECIES_SOUNDS: Record<
  SpeciesId,
  { sample: "roar" | "rasp"; rate: number; gain: number; label: string }
> = {
  triceratops: { sample: "rasp", rate: 0.64, gain: 0.85, label: "低鸣" },
  tyrannosaurus: { sample: "roar", rate: 0.82, gain: 0.8, label: "咆哮" },
  ankylosaurus: { sample: "rasp", rate: 0.58, gain: 0.8, label: "低吼" },
  spinosaurus: { sample: "roar", rate: 0.95, gain: 0.8, label: "咆哮" },
  deinocheirus: { sample: "rasp", rate: 0.74, gain: 0.8, label: "低鸣" },
  carcharodontosaurus: { sample: "roar", rate: 0.89, gain: 0.8, label: "咆哮" },
  therizinosaurus: { sample: "rasp", rate: 0.8, gain: 0.8, label: "短鸣" },
  acrocanthosaurus: { sample: "roar", rate: 1.02, gain: 0.75, label: "咆哮" },
  regaliceratops: { sample: "rasp", rate: 0.72, gain: 0.85, label: "低鸣" },
  paluxysaurus: { sample: "roar", rate: 0.65, gain: 0.55, label: "低鸣" },
  stegosaurus: { sample: "rasp", rate: 0.67, gain: 0.8, label: "低吼" },
  carnotaurus: { sample: "roar", rate: 1.13, gain: 0.75, label: "咆哮" },
  velociraptor: { sample: "rasp", rate: 1.22, gain: 0.8, label: "短鸣" },
  tylosaurus: { sample: "roar", rate: 0.76, gain: 0.6, label: "低鸣" },
};
