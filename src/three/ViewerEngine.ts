import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createHuman, createCar, disposeObject } from "./models";
import { loadDinosaur } from "./assetModels";
import type { LoadedDinosaur } from "./assetModels";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
import { DINOSAURS, getDinosaur } from "../data/dinosaurs";
import type { DemoMode, SpeciesId, ViewPreset } from "../data/dinosaurs";

export interface ProjectedPoint {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}
export interface ContentOptions {
  species: SpeciesId;
  mode: DemoMode;
  comparisons: SpeciesId[];
  human: boolean;
  vehicle: boolean;
  file: File | null;
}

export class ViewerEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private perspective = new THREE.PerspectiveCamera(36, 1, 0.1, 300);
  private orthographic = new THREE.OrthographicCamera(
    -15,
    15,
    10,
    -10,
    0.1,
    300,
  );
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera =
    this.perspective;
  private controls: OrbitControls;
  private content = new THREE.Group();
  private resizeObserver: ResizeObserver;
  private models: LoadedDinosaur[] = [];
  private skybox: GroundedSkybox | null = null;
  private environment: THREE.Texture | null = null;
  private envTarget: THREE.WebGLRenderTarget | null = null;
  private naturalLight = true;
  private anchors = new Map<string, THREE.Object3D>();
  private mode: DemoMode = "museum";
  private autoRotate = false;
  private animate = false;
  private dirty = true;
  private stopped = false;
  private width = 1;
  private height = 1;
  private compareWidth = 26;
  private generation = 0;
  private bounds = new THREE.Box3();
  private target = new THREE.Vector3();
  private homePosition = new THREE.Vector3();
  private elapsed = 0;
  private previousTime = 0;
  private readonly light: THREE.DirectionalLight;

  constructor(
    private canvas: HTMLCanvasElement,
    private onProject: (points: ProjectedPoint[]) => void,
    private onImport: (
      state: "loading" | "ready" | "error",
      message?: string,
    ) => void,
    private onAsset: (state: "loading" | "ready" | "error") => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.scene.add(new THREE.HemisphereLight("#fff9eb", "#455340", 0.7));
    this.light = new THREE.DirectionalLight("#fff4da", 2.6);
    this.light.position.set(8, 15, 10);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(2048, 2048);
    this.light.shadow.bias = -0.001;
    this.light.shadow.normalBias = 0.035;
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = 80;
    this.scene.add(this.light, this.light.target);
    const rim = new THREE.DirectionalLight("#d5e3d8", 0.75);
    rim.position.set(-8, 8, -8);
    this.scene.add(rim);
    this.scene.add(this.content);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.minPolarAngle = 0.12;
    this.controls.enablePan = false;
    this.controls.addEventListener("change", this.markDirty);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(canvas.parentElement!);
    this.resize();
    this.renderer.setAnimationLoop(this.tick);
    void this.loadEnvironment();
  }

  private async loadEnvironment() {
    try {
      const texture = await new HDRLoader().loadAsync(
        `${import.meta.env.BASE_URL}environment/forest_slope_2k.hdr`,
      );
      if (this.stopped) {
        texture.dispose();
        return;
      }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.environment = texture;
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.envTarget = pmrem.fromEquirectangular(texture);
      pmrem.dispose();
      this.scene.environment = this.envTarget.texture;
      this.scene.environmentIntensity = 0.65;
      this.skybox = new GroundedSkybox(texture, 10, 120, 64);
      this.skybox.position.y = 10;
      this.skybox.rotation.y = 1.7;
      this.scene.add(this.skybox);
      this.setNaturalLight(this.naturalLight);
    } catch {
      // Local HDRI failure leaves the directional-light studio usable.
      this.canvas.dataset.environment = "studio-fallback";
    }
  }

  setNaturalLight(enabled: boolean) {
    this.naturalLight = enabled;
    if (this.skybox) this.skybox.visible = enabled && this.mode !== "compare";
    this.canvas.dataset.environment = this.skybox?.visible
      ? "forest"
      : "studio";
    this.dirty = true;
  }

  private markDirty = () => {
    this.dirty = true;
  };

  private resize = () => {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.renderer.setSize(this.width, this.height, false);
    this.perspective.aspect = this.width / this.height;
    this.perspective.updateProjectionMatrix();
    this.updateOrtho();
    if (!this.bounds.isEmpty()) this.setView("reset");
    this.dirty = true;
  };

  private updateOrtho() {
    const width = Math.max(
      this.compareWidth * 1.12,
      (12 * this.width) / this.height,
    );
    const vertical = (width * this.height) / this.width;
    this.orthographic.left = -width / 2;
    this.orthographic.right = width / 2;
    this.orthographic.top = vertical / 2;
    this.orthographic.bottom = -vertical / 2;
    this.orthographic.updateProjectionMatrix();
  }

  setPlayback(autoRotate: boolean, animate: boolean) {
    this.autoRotate = autoRotate;
    this.animate = animate;
    this.dirty = true;
  }

  async setContent(options: ContentOptions) {
    const generation = ++this.generation;
    this.mode = options.mode;
    this.setNaturalLight(this.naturalLight);
    this.clearContent();
    this.bounds.makeEmpty();
    this.canvas.dataset.ready = "false";
    this.onAsset("loading");
    this.controls.reset();
    this.controls.autoRotate = false;
    this.camera =
      options.mode === "compare" ? this.orthographic : this.perspective;
    this.controls.object = this.camera;
    this.controls.enableRotate = options.mode !== "compare";
    this.controls.enablePan = options.mode === "compare";
    this.controls.mouseButtons.LEFT =
      options.mode === "compare" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    this.controls.touches.ONE =
      options.mode === "compare" ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 80;
    this.controls.minZoom = 0.65;
    this.controls.maxZoom = 2.5;
    if (options.file && options.mode === "museum") {
      this.onImport("loading");
      try {
        const buffer = await options.file.arrayBuffer();
        const gltf = await new GLTFLoader().parseAsync(buffer, "");
        if (this.stopped || generation !== this.generation) {
          disposeObject(gltf.scene);
          return;
        }
        const box = new THREE.Box3().setFromObject(gltf.scene),
          size = box.getSize(new THREE.Vector3());
        if (box.isEmpty() || Math.max(size.x, size.y, size.z) === 0) {
          disposeObject(gltf.scene);
          throw new Error("empty");
        }
        this.clearContent();
        const model = new THREE.Group(),
          centered = new THREE.Group();
        centered.add(gltf.scene);
        const factor = 9 / Math.max(size.x, size.y, size.z);
        centered.position.set(
          -(box.min.x + box.max.x) * 0.5,
          -box.min.y,
          -(box.min.z + box.max.z) * 0.5,
        );
        model.add(centered);
        model.scale.setScalar(factor);
        this.content.add(model);
        gltf.scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        this.addFloor();
        this.bounds.setFromObject(model);
        this.setView("reset");
        this.setDiagnostics();
        this.onImport("ready");
        this.onAsset("ready");
      } catch {
        if (!this.stopped && generation === this.generation)
          this.onImport(
            "error",
            "无法读取这个模型。请使用包含贴图的有效 GLB 文件。",
          );
      }
      return;
    }
    const selected =
      options.mode === "compare"
        ? DINOSAURS.filter((d) => options.comparisons.includes(d.id))
        : [getDinosaur(options.species)];
    const results = await Promise.allSettled(selected.map(loadDinosaur));
    const loaded = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    if (
      this.stopped ||
      generation !== this.generation ||
      loaded.length !== selected.length
    ) {
      loaded.forEach((model) => {
        model.mixer?.stopAllAction();
        disposeObject(model.root);
      });
      if (!this.stopped && generation === this.generation)
        this.onAsset("error");
      return;
    }
    if (options.mode === "compare") {
      const total =
        selected.reduce((sum, d) => sum + d.length + 2, 0) +
        (options.human ? 2 : 0) +
        (options.vehicle ? 6.5 : 0);
      let x = -total / 2;
      if (options.human) {
        const human = createHuman();
        human.position.x = x + 0.8;
        this.content.add(human);
        const anchor = new THREE.Object3D();
        anchor.position.set(x + 0.8, 2.15, 0);
        this.content.add(anchor);
        this.anchors.set("human", anchor);
        x += 2;
      }
      if (options.vehicle) {
        const car = createCar();
        car.position.x = x + 2.25;
        this.content.add(car);
        const anchor = new THREE.Object3D();
        anchor.position.set(x + 2.25, 2, 0);
        this.content.add(anchor);
        this.anchors.set("vehicle", anchor);
        x += 6.5;
      }
      for (const [index, dino] of selected.entries()) {
        const entry = loaded[index],
          model = entry.root;
        model.position.x = x + dino.length / 2;
        this.content.add(model);
        this.models.push(entry);
        const b = new THREE.Box3().setFromObject(model),
          anchor = new THREE.Object3D();
        anchor.position.set(model.position.x, b.max.y + 0.5, 0);
        this.content.add(anchor);
        this.anchors.set(dino.id, anchor);
        x += dino.length + 2;
      }
      const grid = new THREE.GridHelper(
        Math.ceil(total + 10),
        Math.ceil(total + 10),
        "#a8b2a0",
        "#d7dacb",
      );
      grid.position.y = -0.02;
      const mats = Array.isArray(grid.material)
        ? grid.material
        : [grid.material];
      mats.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.45;
      });
      this.content.add(grid);
      this.compareWidth = total + 1;
      this.updateOrtho();
      this.bounds.setFromObject(this.content);
      this.bounds.min.y = 0;
      this.addFloor();
      this.setShadowArea(total / 2 + 5);
    } else {
      const dino = getDinosaur(options.species),
        entry = loaded[0],
        model = entry.root;
      this.content.add(model);
      this.models = [entry];
      for (const [id, anchor] of entry.anchors) this.anchors.set(id, anchor);
      this.addFloor();
      this.bounds.setFromObject(model);
      this.setShadowArea(dino.length + 2);
    }
    this.setView("reset");
    this.setDiagnostics();
    this.onAsset("ready");
    this.dirty = true;
  }

  private setDiagnostics() {
    let count = 0;
    this.content.traverse((o) => {
      if (o instanceof THREE.Mesh) count++;
    });
    this.canvas.dataset.meshCount = String(count);
    this.canvas.dataset.ready = "true";
    this.canvas.dataset.mode = this.mode;
    this.canvas.dataset.modelBounds = JSON.stringify(
      this.bounds.getSize(new THREE.Vector3()).toArray(),
    );
    this.canvas.dataset.models = this.models.map((m) => m.root.name).join(",");
  }

  private clearContent() {
    this.models.forEach((model) => {
      model.mixer?.stopAllAction();
      if (model.mixer) model.mixer.uncacheRoot(model.mixer.getRoot());
    });
    disposeObject(this.content);
    this.content.clear();
    this.models = [];
    this.anchors.clear();
  }

  captureComparison() {
    if (this.mode !== "compare" || this.canvas.dataset.ready !== "true")
      throw new Error("Comparison not ready");
    // A dedicated camera keeps downloads sharp and consistently framed on phones.
    const width = 1600,
      height = 600;
    const modelHeight = Math.max(
      ...this.models.map(
        (model) => new THREE.Box3().setFromObject(model.root).max.y,
      ),
    );
    const spanY = Math.max(
      (this.compareWidth * 1.12 * height) / width,
      modelHeight + 3,
    );
    const spanX = (spanY * width) / height;
    const camera = new THREE.OrthographicCamera(
      -spanX / 2,
      spanX / 2,
      spanY / 2,
      -spanY / 2,
      0.1,
      300,
    );
    camera.position.set(0, modelHeight * 0.42 + 3, 45);
    camera.lookAt(0, modelHeight * 0.42, 0);
    camera.updateMatrixWorld();
    const ratio = this.renderer.getPixelRatio();
    const size = this.renderer.getSize(new THREE.Vector2());
    try {
      this.renderer.setPixelRatio(1);
      this.renderer.setSize(width, height, false);
      this.renderer.render(this.scene, camera);
      const url = this.canvas.toDataURL("image/png");
      const points = [...this.anchors].map(([id, node]) => {
        const p = node.getWorldPosition(new THREE.Vector3()).project(camera);
        return { id, x: ((p.x + 1) * width) / 2, y: ((1 - p.y) * height) / 2 };
      });
      return { url, points };
    } finally {
      this.renderer.setPixelRatio(ratio);
      this.renderer.setSize(size.x, size.y, false);
      this.renderer.render(this.scene, this.camera);
    }
  }

  private setShadowArea(size: number) {
    const c = this.light.shadow.camera;
    c.left = -size;
    c.right = size;
    c.top = size;
    c.bottom = -size;
    c.updateProjectionMatrix();
  }

  private addFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      new THREE.ShadowMaterial({ color: "#141b12", opacity: 0.4 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    this.content.add(floor);
  }

  setView(preset: ViewPreset) {
    if (this.bounds.isEmpty()) return;
    const size = this.bounds.getSize(new THREE.Vector3()),
      center = this.bounds.getCenter(new THREE.Vector3());
    this.target.copy(center);
    if (this.mode === "compare") {
      const mobileOffset =
        this.width < 600
          ? (this.orthographic.top - this.orthographic.bottom) * 0.1
          : 0;
      this.target.set(0, Math.min(size.y * 0.43, 4.7) + mobileOffset, 0);
      this.camera.position.copy(this.target).add(new THREE.Vector3(0, 3, 45));
      this.camera.zoom = 1;
    } else {
      const vfov = THREE.MathUtils.degToRad(this.perspective.fov),
        hfov = 2 * Math.atan((Math.tan(vfov / 2) * this.width) / this.height);
      const distance =
        Math.max(
          size.y / (2 * Math.tan(vfov / 2)),
          size.x / (2 * Math.tan(hfov / 2)),
        ) *
          1.35 +
        size.z * 0.45;
      const direction =
        preset === "front"
          ? new THREE.Vector3(1, 0.2, 0.08)
          : preset === "side"
            ? new THREE.Vector3(0, 0.17, 1)
            : new THREE.Vector3(0.46, 0.26, 1);
      this.camera.position
        .copy(this.target)
        .add(direction.normalize().multiplyScalar(distance));
      this.camera.zoom = 1;
      this.controls.minDistance = distance * 0.35;
      this.controls.maxDistance = distance * 2.8;
    }
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(this.target);
    this.controls.update();
    this.controls.saveState();
    this.homePosition.copy(this.camera.position);
    this.dirty = true;
  }

  refreshLabels() {
    // React can mount label elements after the last static frame was projected.
    this.dirty = true;
  }

  focusHotspot(id: string | null) {
    if (this.mode !== "explore" || !id) return;
    const anchor = this.anchors.get(id);
    if (!anchor) return;
    const point = anchor.getWorldPosition(new THREE.Vector3());
    this.controls.target.copy(this.target).lerp(point, 0.34);
    this.camera.position
      .copy(this.homePosition)
      .addScaledVector(point.clone().sub(this.target), 0.22);
    this.controls.update();
    this.dirty = true;
  }

  private tick = (time: number) => {
    if (this.stopped || document.hidden) {
      this.previousTime = time;
      return;
    }
    const delta = Math.min((time - this.previousTime) / 1000, 0.05);
    this.previousTime = time;
    if (this.animate) this.elapsed += delta;
    this.controls.autoRotate = this.autoRotate && this.mode !== "compare";
    this.controls.autoRotateSpeed = 0.6;
    const changed = this.controls.update(delta);
    if (this.animate) {
      for (const model of this.models) model.mixer?.update(delta);
    }
    if (this.dirty || changed || this.animate || this.controls.autoRotate) {
      this.renderer.render(this.scene, this.camera);
      this.dirty = false;
      const points: ProjectedPoint[] = [];
      for (const [id, node] of this.anchors) {
        const p = node
          .getWorldPosition(new THREE.Vector3())
          .project(this.camera);
        points.push({
          id,
          x: (p.x * 0.5 + 0.5) * this.width,
          y: (-p.y * 0.5 + 0.5) * this.height,
          visible:
            p.z > -1 && p.z < 1 && Math.abs(p.x) < 0.95 && Math.abs(p.y) < 0.94,
        });
      }
      this.onProject(points);
    }
  };

  dispose() {
    this.stopped = true;
    this.generation++;
    this.resizeObserver.disconnect();
    this.renderer.setAnimationLoop(null);
    this.controls.removeEventListener("change", this.markDirty);
    this.controls.dispose();
    this.clearContent();
    disposeObject(this.scene);
    this.environment?.dispose();
    this.envTarget?.dispose();
    this.renderer.dispose();
  }
}
