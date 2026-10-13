# 3D asset attribution

The collection contains 14 prehistoric entries: 13 dinosaur entries and Tylosaurus, a marine reptile. All included model files are licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Copyright remains with the credited artists. Retain author credits, source and license links, and modification notices when redistributing these assets.

Files were obtained from the public [Objaverse archive](https://huggingface.co/datasets/allenai/objaverse). Licensing is checked per asset against embedded GLB metadata and the original model records; the archive itself is not a blanket license for its contents. File sizes and hashes below refer to the optimized local files. Retrieval / review date: 2026-10-13.

## Interpretation of the models

- These are artistic reconstructions, not paleontologically reviewed anatomical models. Colors, soft tissues and poses can be speculative. Scientific reference links in the application are separate from the 3D asset copyright sources.
- The Velociraptor model is featherless. Fossil evidence supports feathers; its traditional artistic appearance should not be treated as an accurate statement of current scientific evidence.
- Paluxysaurus preserves the model artist’s original title. It is an older name for material now generally referred to Sauroposeidon.
- Tylosaurus is a mosasaur marine reptile, not a dinosaur.
- Therizinosaurus includes a juvenile in the original composition. That scene does not establish parental care or herd behavior.
- The current Tyrannosaurus is a static, neutral-pose extraction from Dino Fight by Pedro B. Goulart / Pebegou. Its earlier LasquetiSpice asset has been replaced; the old attribution does not apply to the current file.
- Display scale is based on an artistic model’s pose and extent; it is an educational approximation rather than a skeletal measurement.
- No model identified as a ripped movie or game asset was selected. References to Jurassic films or ARK concern taxa and fictional settings, and do not license those franchises’ assets.

## Models

### 三角龙 — Triceratops dinosaur

- Author: wojciechmiedziocha (https://sketchfab.com/wojciechmiedziocha)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/triceratops-dinosaur-87527079bad44917ab1b98a456b46c7e
- File: `public/models/triceratops.glb`
- Size: 4463796 bytes
- SHA-256: `4ba06e329788e30c166b22edb1a92f68c6220aafa891d7fbdaca577e34c49460`
- Changes: Legacy specular/glossiness materials converted to metallic/roughness for Three.js where necessary. Display orientation and scale normalized. Geometry and source image textures retained.

### 霸王龙 — Dino Fight

- Author: Pedro B. Goulart (https://sketchfab.com/Pebegou)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/dino-fight-e06271daec3b431388640435f211f874
- File: `public/models/tyrannosaurus.glb`
- Size: 2361504 bytes
- SHA-256: `63900c26e5201071fbecdb0d7c24a6549e103d80ccf1ff796b7c03575297795b`
- Changes: Extracted Tyrannosaurus hierarchy from original Dino Fight scene; removed Stegosaurus and its animation. Mesh simplification ratio 0.7, error 0.001. Restored neutral skeletal bind pose from original inverse bind matrices using Three SkinnedMesh.pose(). Exported static GLB, without taunt animation, to make standing size comparison consistent. Converted textures to WebP, maximum 2048px; original source/author/license extras preserved

### 甲龙 — Dino - Ankylosaurus

- Author: pikabobalex (https://sketchfab.com/pikabobalex)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/dino-ankylosaurus-55b9adcbcf7846e8a833bfc77eaf3d3f
- File: `public/models/ankylosaurus.glb`
- Size: 4268852 bytes
- SHA-256: `27989f985f9a99171a7fcf2e31fcc1c69f8a1ba63af5d048b03c0b0ce1b4801f`
- Changes: Legacy specular/glossiness materials converted to metallic/roughness for Three.js where necessary. Display orientation and scale normalized. Geometry and source image textures retained.

### 棘龙 — Spinosaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/spinosaurus-4f2332ee93874d59a55fb60ed2873ec2
- File: `public/models/spinosaurus.glb`
- Size: 4733176 bytes
- SHA-256: `9e3face45c42645bf7767cffbc79e3baaca5a0e2d03628a534eb45c61fb0c039`
- Changes: Mesh simplified with glTF Transform 4.5.1 (target ratio 0.25 for Spinosaurus and Deinocheirus, 0.18 for Carcharodontosaurus; error tolerance 0.001). Meshes joined and unused data removed. Textures converted to WebP with maximum dimensions 2048 px. Original embedded author, source and CC BY 4.0 license retained. Runtime display materials, orientation and scale adjusted.

### 恐手龙 — Deinocheirus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/deinocheirus-893d4de08a9e4788938d370b8ad72c17
- File: `public/models/deinocheirus.glb`
- Size: 8361976 bytes
- SHA-256: `c7abda49662d7090fc2ef73a79dec34c51ec5a2b82a718d8c02796826c082a46`
- Changes: Mesh simplified with glTF Transform 4.5.1 (target ratio 0.25 for Spinosaurus and Deinocheirus, 0.18 for Carcharodontosaurus; error tolerance 0.001). Meshes joined and unused data removed. Textures converted to WebP with maximum dimensions 2048 px. Original embedded author, source and CC BY 4.0 license retained. Runtime display materials, orientation and scale adjusted.

### 鲨齿龙 — Carcharodontosaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/carcharodontosaurus-550124bde61b4c988580bf9a0b9053b8
- File: `public/models/carcharodontosaurus.glb`
- Size: 6227540 bytes
- SHA-256: `de243c536ece60cd803d1697660ce77a81997d346b7cdc1747e5978d6148a160`
- Changes: Mesh simplified with glTF Transform 4.5.1 (target ratio 0.25 for Spinosaurus and Deinocheirus, 0.18 for Carcharodontosaurus; error tolerance 0.001). Meshes joined and unused data removed. Textures converted to WebP with maximum dimensions 2048 px. Original embedded author, source and CC BY 4.0 license retained. Runtime display materials, orientation and scale adjusted.

### 镰刀龙 — Therizinosaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/therizinosaurus-1fa8b9e2dd4b40c9b8ffcaead0bd8e66
- File: `public/models/therizinosaurus.glb`
- Size: 10089964 bytes
- SHA-256: `c237788ec919075329cef3933e8640f830e9f63ba5941540395b0b0913c23490`
- Changes: Mesh simplified with glTF Transform 4.5.1 (target ratio 0.30, error tolerance 0.001). Juvenile specimen retained as part of the original composition. Textures converted to WebP, maximum 2048 px. Original embedded author, source and license retained. Runtime orientation and scale adjusted.
- Model note: The original artwork includes an adult and a juvenile; their association is an artistic composition, not evidence for a specific social behavior.

### 高棘龙 — Acrocanthosaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/acrocanthosaurus-06b1114bc5d747aca2664c69444831c8
- File: `public/models/acrocanthosaurus.glb`
- Size: 6076116 bytes
- SHA-256: `a82d9702a209a07fb5f98f20629bacdd14220cf74be86feae8c1b8da343b2648`
- Changes: Removed hard vertex normals to allow welding, joined meshes, simplified geometry and recomputed normals for real-time display. Textures converted to WebP, maximum 2048 px. Original embedded author, source and license retained. Runtime orientation and scale adjusted.

### 帝王角龙 — Regaliceratops

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/regaliceratops-fb292480dc88483f919c3b11637da3da
- File: `public/models/regaliceratops.glb`
- Size: 5744124 bytes
- SHA-256: `92d301a7203f8a91afd46d31c3caee0be54616a6b4738b7c82f9e70da04178e2`
- Changes: Removed hard vertex normals to allow welding, joined meshes, simplified geometry and recomputed normals for real-time display. Textures converted to WebP, maximum 2048 px. Original embedded author, source and license retained. Runtime orientation and scale adjusted.

### 帕卢克西龙（旧名） — Paluxysaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/paluxysaurus-afb6b5c7221b4f43a40762cdd9cdf90c
- File: `public/models/paluxysaurus.glb`
- Size: 6869456 bytes
- SHA-256: `a007808e74c0af0709efcf3803b56e34b8bbe0ce5873dde967969814ca207558`
- Changes: Converted legacy KHR_materials_pbrSpecularGlossiness materials to metallic/roughness for Three.js. Simplified geometry, joined meshes and removed unused data. Textures converted to WebP, maximum 2048 px. Original embedded author, source and license retained. Runtime orientation and scale adjusted.
- Model note: Original model title retained. Paluxysaurus is an older taxonomic name; the relevant material is now generally referred to Sauroposeidon.

### 剑龙 — Stegosaurus

- Author: PAndras (https://sketchfab.com/PusztaiAndras)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/stegosaurus-b2545ed6031e49939b823b1c8435989e
- File: `public/models/stegosaurus.glb`
- Size: 1538888 bytes
- SHA-256: `ae13c8296621b2995b11eb76352f775d5bbfd4f51b9cb6788dba55bd650109a7`
- Changes: Mesh simplification ratio 0.7, error 0.001. Textures converted to WebP, maximum 2048px. Original author/source/license extras preserved

### 牛龙 — CARNOTAURUS DİNOSAUR

- Author: Cenker Turhan (https://sketchfab.com/cenkerturhan1)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/carnotaurus-dinosaur-548c9a0575b14deaae1f12ca9a6c31ca
- File: `public/models/carnotaurus.glb`
- Size: 6049816 bytes
- SHA-256: `67e220ae1ec6b70575d197976d1bb41c8bfd3560424da5f3667f333c97ad31e5`
- Changes: Removed separate rock from scene. Mesh simplification ratio 0.5, error 0.001. Textures converted to WebP, maximum 2048px. Original author/source/license extras preserved

### 迅猛龙 — Velociraptor

- Author: Tomas Ibar (https://sketchfab.com/tomasibar)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/velociraptor-b227da6c817043ab9a249dbbd127db67
- File: `public/models/velociraptor.glb`
- Size: 1431344 bytes
- SHA-256: `3ebe382817a6b55a0e6ea6389b85ff62dcc7cc287418ffac7ddbcad68bc1742d`
- Changes: Mesh simplification ratio 0.7, error 0.001. Textures converted to WebP, maximum 2048px. Original author/source/license extras preserved
- Model note: Traditional featherless artistic reconstruction. Fossil evidence supports feathers in Velociraptor; this model does not represent that evidence.

### 海王龙（非恐龙） — Tylosaurus

- Author: Julian Johnson-Mortimer (https://sketchfab.com/FreddyFoxFreddy)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Source: https://sketchfab.com/3d-models/tylosaurus-17a0332ed82b4383ae9fda9fa32b1080
- File: `public/models/tylosaurus.glb`
- Size: 3593260 bytes
- SHA-256: `e3df14aee53c6c9194e3b335f7fedd3101f67bee51fd75bb946b776bebb497f9`
- Changes: Mesh simplified with glTF Transform 4.5.1 (target ratio 0.65, error tolerance 0.001). Textures converted to WebP, maximum 2048 px. Original embedded author, source and license retained. Runtime orientation and scale adjusted.
- Model note: Tylosaurus is a mosasaur marine reptile, not a dinosaur.

## Forest environment

[Forest Slope](https://polyhaven.com/a/forest_slope) by Andreas Mischok / Poly Haven.
License: [CC0](https://polyhaven.com/license).
Local file: `public/environment/forest_slope_2k.hdr`.
Source: https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr

The modern forest HDRI is a lighting backdrop, not a scientific reconstruction of a Jurassic or Cretaceous habitat.

The machine-readable record is `public/models/credits.json`.
