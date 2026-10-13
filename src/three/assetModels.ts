import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Dinosaur } from "../data/dinosaurs";

export interface LoadedDinosaur {
  root: THREE.Group;
  mixer?: THREE.AnimationMixer;
  anchors: Map<string, THREE.Object3D>;
}

const buffers = new Map<string, Promise<ArrayBuffer>>();

export async function loadDinosaur(dino: Dinosaur): Promise<LoadedDinosaur> {
  const url = `/models/${dino.id}.glb`;
  if (!buffers.has(url)) {
    buffers.set(
      url,
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Model HTTP ${response.status}`);
          return response.arrayBuffer();
        })
        .catch((error) => {
          buffers.delete(url);
          throw error;
        }),
    );
  }
  const gltf = await new GLTFLoader().parseAsync(await buffers.get(url)!, "");
  const root = new THREE.Group();
  const oriented = new THREE.Group();
  oriented.add(gltf.scene);
  // Asset transforms stay outside the authored hierarchy so animation tracks
  // cannot reset the centering, orientation or scale.
  oriented.rotation.y = dino.asset.rotationY;
  let mixer: THREE.AnimationMixer | undefined;
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    const clip =
      gltf.animations.find((c) => c.name === "idle") ?? gltf.animations[0];
    mixer.clipAction(clip).play();
    mixer.update(0);
  }
  oriented.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(oriented, true);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  oriented.position.set(-center.x, -box.min.y, -center.z);
  const scaled = new THREE.Group();
  scaled.add(oriented);
  scaled.scale.setScalar(dino.length / size.x);
  root.add(scaled);
  root.name = dino.id;
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.7;
          material.metalness = 0;
          material.roughness = Math.max(material.roughness, 0.76);
          if (material.map) material.map.anisotropy = 8;
        }
      }
    }
  });
  root.updateMatrixWorld(true);
  const fitted = new THREE.Box3()
    .setFromObject(root, true)
    .getSize(new THREE.Vector3());
  const anchors = new Map<string, THREE.Object3D>();
  for (const hotspot of dino.hotspots) {
    const anchor = new THREE.Object3D();
    anchor.position.set(
      hotspot.point[0] * fitted.x,
      hotspot.point[1] * fitted.y,
      hotspot.point[2] * fitted.z,
    );
    root.add(anchor);
    anchors.set(hotspot.id, anchor);
  }
  return { root, mixer, anchors };
}
