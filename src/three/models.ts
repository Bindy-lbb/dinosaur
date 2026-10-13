import * as THREE from "three";
type Point = [number, number, number];

// A generic, unbranded 4.5 m car for scale; intentionally a neutral reference.
export function createCar() {
  const root = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({
    color: "#819095",
    roughness: 0.8,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: "#354a50",
    roughness: 0.4,
  });
  const tyre = new THREE.MeshStandardMaterial({
    color: "#303736",
    roughness: 0.95,
  });
  const box = (size: Point, at: Point, material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...at);
    mesh.castShadow = true;
    root.add(mesh);
  };
  box([4.5, 0.58, 1.78], [0, 0.68, 0], body);
  box([2.35, 0.54, 1.56], [-0.17, 1.24, 0], glass);
  for (const x of [-1.38, 1.38])
    for (const z of [-0.83, 0.83]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.23, 24),
        tyre,
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.36, z);
      wheel.castShadow = true;
      root.add(wheel);
    }
  return root;
}

export function createHuman(height = 1.7) {
  const root = new THREE.Group(),
    material = new THREE.MeshStandardMaterial({
      color: "#c29a4b",
      roughness: 0.8,
    });
  const ellipsoid = (p: Point, s: Point) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), material);
    mesh.position.set(...p);
    mesh.scale.set(...s);
    mesh.castShadow = true;
    root.add(mesh);
  };
  ellipsoid([0, 1.55, 0], [0.11, 0.15, 0.1]);
  ellipsoid([0, 1.19, 0], [0.17, 0.25, 0.09]);
  ellipsoid([0, 0.92, 0], [0.14, 0.14, 0.095]);
  for (const side of [-1, 1]) {
    ellipsoid([side * 0.09, 0.48, 0], [0.062, 0.44, 0.063]);
    ellipsoid([side * 0.09, 0.055, 0.04], [0.07, 0.05, 0.13]);
    ellipsoid([side * 0.21, 1.03, 0], [0.045, 0.3, 0.045]);
  }
  const bounds = new THREE.Box3().setFromObject(root);
  root.scale.setScalar(height / (bounds.max.y - bounds.min.y));
  root.position.y = -bounds.min.y * root.scale.y;
  return root;
}

export function disposeObject(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>(),
    textures = new Set<THREE.Texture>(),
    skeletons = new Set<THREE.Skeleton>();
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
      geometries.add(object.geometry);
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      list.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value instanceof THREE.Texture) textures.add(value);
        });
      });
    } else if (object instanceof THREE.Line) {
      geometries.add(object.geometry);
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      list.forEach((m) => materials.add(m));
    }
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
  skeletons.forEach((s) => s.dispose());
}
