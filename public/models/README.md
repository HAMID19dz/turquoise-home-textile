# Turquoise 3D Model Guidelines & Specifications

This directory (`public/models/`) is designated for production 3D assets in `.glb` or `.gltf` format.

When custom showroom `.glb` models are added here (e.g. `leather-armchair.glb`), `<ProductViewer />` automatically detects and renders the authentic high-definition 3D mesh instead of the procedural builder.

---

## 1. Coordinate System & Scale Conventions

- **Units:** Real-world **Meters** ($1.0 \text{ unit} = 1.0 \text{ meter} = 100 \text{ cm}$).
  *Example:* An armchair $90\text{ cm}$ wide must measure $0.90$ units wide in Blender / 3ds Max.
- **Orientation:**
  - $+Y$: Up
  - $+Z$: Front (facing camera)
  - $+X$: Right
- **Origin Pivot Point:** Centered at the **bottom ground contact plane** ($x=0, y=0, z=0$).
  *Important:* Do not place the pivot at the geometry centroid, because the furniture must rest seamlessly upon the marble showroom floor without sinking or floating.

---

## 2. Triangle Budget & Topology

- **Furniture Pieces (Armchairs, Sofas, Tables):** 15,000 to 45,000 triangles.
- **Curtains & Drapes:** 20,000 to 50,000 triangles.
- **Draw Calls:** Limit to 1–3 materials per model. Bake multiple textures into single atlas where possible.

---

## 3. PBR Material Setup (glTF 2.0 Standard)

- **Workflow:** Metallic-Roughness PBR.
- **Textures:**
  - Base Color / Albedo: sRGB
  - Metallic (B channel) & Roughness (G channel): Linear
  - Normal Map: Tangent-space OpenGL (+Y)
- **Texture Resolutions:** $2048 \times 2048$ max for main upholstery; $1024 \times 1024$ for metal legs/accents.
- **Compression:** Compress with Draco or Meshopt:
  ```bash
  gltf-transform optimize model.glb model-opt.glb --compress draco --texture-compress webp
  ```

---

## 4. Local Testing with Drag & Drop

You can test any `.glb` or `.gltf` model locally by clicking the **"Upload / Drop GLB"** button directly inside the `<ProductViewer />` modal in the browser. The model will load instantly in memory via `URL.createObjectURL` without touching the server.
