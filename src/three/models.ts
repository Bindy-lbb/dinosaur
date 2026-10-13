import * as THREE from "three";
import type { Dinosaur } from "../data/dinosaurs";

type Point = [number, number, number];
export interface ModelMotion {
  target: THREE.Object3D;
  axis: "x" | "y" | "z";
  base: number;
  amount: number;
  phase: number;
}
export interface DinosaurModel extends THREE.Group {
  userData: { motions: ModelMotion[]; anchors: Map<string, THREE.Object3D> };
}

// Original geometry: no downloaded meshes, paintings, or copyrighted character references.
function taperedTube(points: Point[], radii: number[], segments = 36) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const frames = curve.computeFrenetFrames(segments, false);
  const sides = 12,
    positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments,
      center = curve.getPointAt(t),
      ri = t * (radii.length - 1);
    const low = Math.min(Math.floor(ri), radii.length - 2);
    const radius = THREE.MathUtils.lerp(radii[low], radii[low + 1], ri - low);
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2;
      const point = center
        .clone()
        .addScaledVector(frames.normals[i], Math.cos(angle) * radius)
        .addScaledVector(frames.binormals[i], Math.sin(angle) * radius);
      positions.push(point.x, point.y, point.z);
      uvs.push(j / sides, t);
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j,
          b = a + sides + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function skinTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#78746a";
  ctx.fillRect(0, 0, 768, 768);
  let seed = 37;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let row = -1; row < 49; row++)
    for (let col = -1; col < 49; col++) {
      const x = col * 16 + (row % 2) * 8 + random() * 5;
      const y = row * 16 + random() * 5;
      const shade = Math.floor(163 + random() * 63);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        6 + random() * 2.3,
        5 + random() * 2.3,
        random() * 0.6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  for (let i = 0; i < 16000; i++) {
    ctx.fillStyle = random() > 0.5 ? "#ffffff18" : "#201c1418";
    ctx.fillRect(
      random() * 768,
      random() * 768,
      1 + random() * 2,
      1 + random() * 2,
    );
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.6, 2.6);
  return texture;
}

export function createDinosaur(dino: Dinosaur): DinosaurModel {
  const root = new THREE.Group() as DinosaurModel,
    body = new THREE.Group();
  root.add(body);
  root.userData = { motions: [], anchors: new Map() };
  const sphere = new THREE.SphereGeometry(1, 48, 32);
  const bump = skinTexture();
  const skin = new THREE.MeshStandardMaterial({
    color: dino.color,
    roughness: 0.96,
    map: bump,
    bumpMap: bump,
    bumpScale: 0.052,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: new THREE.Color(dino.color).multiplyScalar(0.77),
    roughness: 0.93,
    map: bump,
    bumpMap: bump,
    bumpScale: 0.018,
  });
  const belly = new THREE.MeshStandardMaterial({
    color: new THREE.Color(dino.color).lerp(new THREE.Color("#a29a7d"), 0.22),
    roughness: 0.9,
    map: bump,
    bumpMap: bump,
    bumpScale: 0.022,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: "#e2d4b6",
    roughness: 0.68,
  });
  const black = new THREE.MeshStandardMaterial({
    color: "#181e15",
    roughness: 0.3,
  });
  const claw = new THREE.MeshStandardMaterial({
    color: "#746b58",
    roughness: 0.92,
  });
  const amber = new THREE.MeshStandardMaterial({
    color: "#bc8b45",
    roughness: 0.4,
  });
  const part = (
    parent: THREE.Object3D,
    p: Point,
    s: Point,
    material = skin,
    rotation = 0,
  ) => {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(...p);
    mesh.scale.set(...s);
    mesh.rotation.z = rotation;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const tube = (
    parent: THREE.Object3D,
    points: Point[],
    radii: number[],
    material = skin,
  ) => {
    const mesh = new THREE.Mesh(taperedTube(points, radii), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const eye = (
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    size: number,
  ) => {
    size *= 0.64;
    for (const side of [-1, 1]) {
      part(
        parent,
        [x, y, side * z],
        [size * 1.45, size, size * 0.65],
        dark,
        -0.2,
      );
      part(
        parent,
        [x + 0.018, y, side * (z + size * 0.4)],
        [size * 0.8, size * 0.8, size * 0.28],
        amber,
      );
      part(
        parent,
        [x + 0.025, y, side * (z + size * 0.65)],
        [size * 0.38, size * 0.52, size * 0.16],
        black,
      );
      part(
        parent,
        [x + 0.04, y + size * 0.24, side * (z + size * 0.75)],
        [size * 0.1, size * 0.1, size * 0.06],
        ivory,
      );
    }
  };
  const toe = (x: number, z: number, radius: number) => {
    for (let i = -1; i <= 1; i++)
      part(
        body,
        [x, 0.11, z + i * radius * 0.64],
        [radius * 0.26, 0.065, radius * 0.23],
        claw,
      );
  };
  const tail = new THREE.Group();
  body.add(tail);
  root.userData.motions.push({
    target: tail,
    axis: "y",
    base: 0,
    amount: 0.08,
    phase: 0,
  });

  if (dino.id === "triceratops") {
    part(body, [-0.4, 1.35, 0], [1.78, 0.97, 0.82]);
    part(body, [0.08, 0.93, 0], [1.27, 0.53, 0.65], belly);
    part(body, [0.67, 1.47, 0], [0.83, 0.87, 0.74]);
    tube(
      tail,
      [
        [-1.5, 1.4, 0],
        [-2.45, 1.05, 0],
        [-3.3, 0.59, 0.13],
        [-4.1, 0.47, 0.3],
      ],
      [0.5, 0.31, 0.13, 0.012],
    );
    for (const side of [-1, 1]) {
      part(body, [-1.4, 1.05, side * 0.62], [0.53, 0.71, 0.42], skin, -0.25);
      tube(
        body,
        [
          [-1.47, 0.98, side * 0.64],
          [-1.3, 0.55, side * 0.72],
          [-1.5, 0.23, side * 0.79],
        ],
        [0.3, 0.25, 0.21],
      );
      part(body, [-1.4, 0.18, side * 0.8], [0.37, 0.18, 0.28]);
      toe(-1.13, side * 0.8, 0.28);
      part(body, [0.71, 1.04, side * 0.66], [0.45, 0.75, 0.36], skin, 0.2);
      tube(
        body,
        [
          [0.67, 1.02, side * 0.64],
          [0.83, 0.59, side * 0.72],
          [1.12, 0.22, side * 0.78],
        ],
        [0.29, 0.22, 0.19],
      );
      part(body, [1.2, 0.16, side * 0.8], [0.35, 0.16, 0.26]);
      toe(1.45, side * 0.8, 0.25);
    }
    const head = new THREE.Group();
    body.add(head);
    part(head, [1.03, 1.86, 0], [0.14, 1.12, 1.01], dark, 0.25);
    part(head, [1.12, 1.88, 0], [0.16, 0.95, 0.87], skin, 0.25);
    for (let i = 0; i <= 12; i++) {
      const a = 0.16 + (i / 12) * Math.PI;
      const y = 1.85 + Math.sin(a) * 1.09,
        z = Math.cos(a) * 1.0;
      part(
        head,
        [1.02 - (y - 1.85) * 0.23, y, z],
        [0.065, 0.075, 0.065],
        dark,
        a - Math.PI / 2,
      );
    }
    part(head, [1.52, 1.39, 0], [0.79, 0.54, 0.53], skin, -0.18);
    part(head, [2.12, 1.16, 0], [0.66, 0.32, 0.36], skin, -0.16);
    part(head, [2.56, 1.01, 0], [0.23, 0.3, 0.28], dark, -0.4);
    part(head, [2.15, 0.92, 0], [0.48, 0.11, 0.29], dark);
    for (const side of [-1, 1]) {
      tube(
        head,
        [
          [1.65, 1.93, side * 0.37],
          [2.12, 2.22, side * 0.43],
          [2.68, 2.52, side * 0.52],
        ],
        [0.16, 0.11, 0.003],
        ivory,
      );
      part(head, [2.39, 1.31, side * 0.29], [0.045, 0.035, 0.016], black);
    }
    tube(
      head,
      [
        [2.31, 1.38, 0],
        [2.57, 1.65, 0],
        [2.65, 1.94, 0],
      ],
      [0.13, 0.085, 0.002],
      ivory,
    );
    eye(head, 1.76, 1.67, 0.47, 0.083);
    root.userData.motions.push({
      target: head,
      axis: "z",
      base: 0,
      amount: 0.026,
      phase: 1,
    });
  } else if (dino.id === "tyrannosaurus") {
    part(body, [-0.23, 2.48, 0], [1.2, 0.78, 0.57], skin, 0.18);
    part(body, [0.2, 2.13, 0], [0.74, 0.55, 0.48], belly, 0.25);
    tube(
      tail,
      [
        [-1.15, 2.51, 0],
        [-2.12, 2.25, 0],
        [-3.2, 2.08, 0.16],
        [-4.32, 2.14, 0.32],
      ],
      [0.48, 0.32, 0.16, 0.009],
    );
    tube(
      body,
      [
        [0.37, 2.8, 0],
        [0.98, 3.14, 0],
        [1.43, 3.51, 0],
      ],
      [0.55, 0.44, 0.38],
    );
    for (const side of [-1, 1]) {
      part(body, [-0.2, 1.82, side * 0.53], [0.54, 0.82, 0.42], skin, -0.35);
      tube(
        body,
        [
          [0.0, 1.8, side * 0.57],
          [0.38, 1.29, side * 0.64],
          [-0.04, 0.4, side * 0.64],
        ],
        [0.31, 0.2, 0.13],
      );
      part(body, [0.18, 0.18, side * 0.64], [0.48, 0.15, 0.25]);
      for (let j = -1; j <= 1; j++)
        tube(
          body,
          [
            [0.17, 0.16, side * 0.64 + j * 0.1],
            [0.52, 0.1, side * 0.64 + j * 0.17],
            [0.74, 0.095, side * 0.64 + j * 0.19],
          ],
          [0.08, 0.065, 0.01],
          dark,
        );
      tube(
        body,
        [
          [0.68, 2.69, side * 0.45],
          [0.86, 2.27, side * 0.56],
          [1.19, 2.17, side * 0.58],
        ],
        [0.15, 0.08, 0.055],
      );
      for (let j = 0; j < 2; j++)
        tube(
          body,
          [
            [1.17, 2.17, side * (0.55 + j * 0.08)],
            [1.32, 2.09, side * (0.55 + j * 0.1)],
            [1.36, 1.99, side * (0.55 + j * 0.1)],
          ],
          [0.035, 0.025, 0.003],
          ivory,
        );
    }
    const head = new THREE.Group();
    body.add(head);
    part(head, [1.77, 3.57, 0], [0.78, 0.47, 0.49]);
    part(head, [2.18, 3.53, 0], [0.54, 0.3, 0.44]);
    part(head, [2.08, 3.32, 0], [0.63, 0.055, 0.41], black);
    const jaw = new THREE.Group();
    jaw.position.set(1.35, 3.32, 0);
    head.add(jaw);
    part(jaw, [0.67, -0.15, 0], [0.66, 0.17, 0.39], dark);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 9; i++) {
        const tooth = new THREE.Mesh(
          new THREE.ConeGeometry(0.035, 0.15, 8),
          ivory,
        );
        tooth.position.set(1.52 + i * 0.125, 3.3, side * (0.38 - i * 0.008));
        tooth.rotation.z = Math.PI;
        head.add(tooth);
      }
      part(head, [2.44, 3.65, side * 0.33], [0.052, 0.032, 0.018], black);
      part(head, [1.65, 3.94, side * 0.32], [0.24, 0.095, 0.14], dark, 0.1);
    }
    eye(head, 1.85, 3.76, 0.445, 0.083);
    root.userData.motions.push({
      target: jaw,
      axis: "z",
      base: 0,
      amount: 0.08,
      phase: 1.4,
    });
    root.userData.motions.push({
      target: head,
      axis: "z",
      base: 0,
      amount: 0.015,
      phase: 1,
    });
  } else {
    part(body, [-0.3, 1.88, 0], [1.65, 0.92, 0.75], skin, 0.13);
    part(body, [-0.1, 1.48, 0], [1.24, 0.48, 0.58], belly);
    tube(
      tail,
      [
        [-1.65, 1.91, 0],
        [-2.53, 1.34, 0],
        [-3.64, 0.95, 0.22],
        [-4.8, 0.98, 0.36],
      ],
      [0.44, 0.26, 0.13, 0.006],
    );
    for (const side of [-1, 1]) {
      part(body, [-1.33, 1.05, side * 0.53], [0.37, 1.04, 0.32], skin, -0.06);
      part(body, [-1.29, 0.17, side * 0.53], [0.35, 0.17, 0.31]);
      toe(-1.02, side * 0.53, 0.27);
      part(body, [1.01, 1.27, side * 0.54], [0.37, 1.27, 0.32], skin, 0.04);
      part(body, [1.02, 0.17, side * 0.54], [0.36, 0.17, 0.31]);
      toe(1.28, side * 0.54, 0.27);
    }
    const neck = new THREE.Group();
    body.add(neck);
    tube(
      neck,
      [
        [0.82, 2.12, 0],
        [1.34, 3.08, 0],
        [1.53, 4.24, 0],
        [1.57, 5.39, 0],
        [1.95, 5.68, 0],
      ],
      [0.51, 0.4, 0.29, 0.19, 0.15],
      skin,
    );
    part(neck, [1.95, 5.73, 0], [0.38, 0.26, 0.26]);
    part(neck, [2.18, 5.62, 0], [0.3, 0.16, 0.23]);
    part(neck, [2.2, 5.49, 0], [0.28, 0.055, 0.21], dark);
    part(neck, [1.85, 5.93, 0], [0.17, 0.12, 0.2], dark);
    eye(neck, 2.0, 5.79, 0.239, 0.045);
    root.userData.motions.push({
      target: neck,
      axis: "z",
      base: 0,
      amount: 0.013,
      phase: 1.2,
    });
  }

  for (const h of dino.hotspots) {
    const anchor = new THREE.Object3D();
    anchor.position.set(...h.point);
    body.add(anchor);
    root.userData.anchors.set(h.id, anchor);
  }
  const bounds = new THREE.Box3().setFromObject(body),
    size = bounds.getSize(new THREE.Vector3());
  const factor = dino.length / size.x;
  body.scale.setScalar(factor);
  body.position.x = -(bounds.max.x + bounds.min.x) * 0.5 * factor;
  body.position.y = -bounds.min.y * factor;
  root.name = dino.id;
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
    textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
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
}
