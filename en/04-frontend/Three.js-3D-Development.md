> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Frontend Development

---
name: threejs-3d-development
description: Use when building 3D scenes, models, animations, or visualizations with Three.js. Covers WebGL/WebGPU rendering, camera controls, lighting, materials, shaders, asset loading, post-processing, physics, and performance optimization.
---

# Three.js 3D Development

## Overview

Build high-performance 3D web applications using Three.js -- a cross-browser WebGL/WebGPU library. Covers the full spectrum from basic scene setup to advanced rendering, performance optimization, and specialized features like physics and VR/XR.

## When to Use

- 3D scenes, models, animations, or visualizations
- WebGL/WebGPU rendering and graphics programming
- Interactive 3D experiences (games, configurators, data visualization)
- Camera controls, lighting, materials, or shaders
- Loading 3D assets (GLTF, FBX, OBJ) or textures
- Post-processing effects (Bloom, DOF, SSAO)
- Physics simulation, VR/XR experiences, or spatial audio
- Performance optimization (instancing, LOD, frustum culling)

## Progressive Learning Path

### Level 1: Getting Started
- Fundamentals - Scene setup, basic geometry, materials, lighting, render loop

### Level 2: Common Tasks
- **Asset Loading**: GLTF, FBX, OBJ, texture loaders
- **Textures**: Types, mapping, wrapping, filtering
- **Cameras**: Perspective, Orthographic, controllers
- **Lighting**: Types, shadows, helpers
- **Animation**: Clips, Mixers, keyframes
- **Math**: Vector, Matrix, Quaternion, Curves
- **Geometry**: Built-in shapes, BufferGeometry, custom geometry, instancing
- **Materials**: PBR, Basic, Phong, Lambert, Physical, Toon, Normal, Depth, Raw, Shader

### Level 3: Interaction & Effects
- **Interaction**: Raycasting, picking, transforms
- **Post-Processing**: Render passes, Bloom, SSAO, SSR
- **Controller Add-ons**: Orbit, Transform, First Person

### Level 4: Advanced Rendering
- **Advanced Materials**: PBR, custom shaders
- **Performance**: Instancing, LOD, Batching, Culling
- **Node Materials (TSL)**: Shader graphs, compute shaders

### Level 5: Specialized Domains
- **Physics**: Ammo, Rapier, Jolt, VR/XR
- **Advanced Loaders**: SVG, VRML, domain-specific formats
- **WebGPU**: Modern backend, compute shaders
- **Shaders**: GLSL, ShaderMaterial, Uniforms, custom effects

---

## Quick Start Pattern

```javascript
// 1. Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Add Objects
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 3. Add Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 4. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

---

## Fundamentals

### Scene

Container for all 3D objects, lights, and cameras.

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Solid color
scene.background = texture;                    // Skybox texture
scene.background = cubeTexture;                // Cube map
scene.environment = envMap;                    // PBR environment map
scene.fog = new THREE.Fog(0xffffff, 1, 100);   // Linear fog
scene.fog = new THREE.FogExp2(0xffffff, 0.02); // Exponential fog
```

### Camera

#### PerspectiveCamera - Most common, simulates human eye

```javascript
// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
  75,                                          // Field of view (degrees)
  window.innerWidth / window.innerHeight,      // Aspect ratio
  0.1,                                         // Near clipping plane
  1000,                                        // Far clipping plane
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix(); // Required after changing fov, aspect, near, far
```

#### OrthographicCamera - No perspective distortion, for 2D/isometric views

```javascript
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000,
);
```

#### CubeCamera - Renders environment maps for reflections

```javascript
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

// Use for reflections
material.envMap = cubeRenderTarget.texture;

// Update each frame (expensive!)
cubeCamera.position.copy(reflectiveMesh.position);
cubeCamera.update(renderer, scene);
```

### WebGL Renderer

```javascript
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'), // Optional existing canvas
  antialias: true,                           // Anti-aliasing
  alpha: true,                               // Transparent background
  powerPreference: 'high-performance',       // GPU preference
  preserveDrawingBuffer: true,               // For screenshots
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Color space (Three.js r152+)
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### Object3D

Base class for all 3D objects. Mesh, Group, Light, Camera all inherit from Object3D.

```javascript
const obj = new THREE.Object3D();

// Transforms
obj.position.set(x, y, z);
obj.rotation.set(x, y, z);    // Euler angles (radians)
obj.quaternion.set(x, y, z, w); // Quaternion rotation
obj.scale.set(x, y, z);

// Local vs world transforms
obj.getWorldPosition(targetVector);
obj.getWorldQuaternion(targetQuaternion);
obj.getWorldDirection(targetVector);

// Hierarchy
obj.add(child);
obj.remove(child);
obj.parent;
obj.children;

// Visibility
obj.visible = false;

// Layers (for selective rendering/raycasting)
obj.layers.set(1);
obj.layers.enable(2);

// Traverse hierarchy
obj.traverse((child) => {
  if (child.isMesh) child.material.color.set(0xff0000);
});
```

### Mesh

Combines geometry and material.

```javascript
const mesh = new THREE.Mesh(geometry, material);

// Multi-material (one per geometry group)
const mesh = new THREE.Mesh(geometry, [material1, material2]);

// Common properties
mesh.castShadow = true;    // Cast shadows
mesh.receiveShadow = true; // Receive shadows
mesh.frustumCulled = true; // Default: skip rendering outside camera view
mesh.renderOrder = 10;     // Higher renders later
```

### Coordinate System

Three.js uses a **right-hand coordinate system**:
- **+X** points right
- **+Y** points up
- **+Z** points toward the viewer (out of screen)

```javascript
// Axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); // Red=X, Green=Y, Blue=Z
```

---

## Math Utilities

### Vector3

```javascript
const v = new THREE.Vector3(x, y, z);

// Operations (in-place)
v.add(v2);
v.sub(v2);
v.multiplyScalar(2);
v.normalize();
v.lerp(target, alpha);

// Computations (return values)
v.length();
v.lengthSq();          // Faster than length()
v.distanceTo(v2);
v.dot(v2);
v.cross(v2);

// Transforms
v.applyMatrix4(matrix);
v.applyQuaternion(q);
v.project(camera);     // World -> NDC
v.unproject(camera);   // NDC -> World
```

### Quaternion

```javascript
const q = new THREE.Quaternion();
q.setFromEuler(euler);
q.setFromAxisAngle(axis, angle);
q.setFromRotationMatrix(matrix);

q.multiply(q2);
q.slerp(target, t);    // Spherical interpolation
q.normalize();
q.invert();
```

### MathUtils

```javascript
THREE.MathUtils.clamp(value, min, max);
THREE.MathUtils.lerp(start, end, alpha);
THREE.MathUtils.mapLinear(value, inMin, inMax, outMin, outMax);
THREE.MathUtils.degToRad(degrees);
THREE.MathUtils.radToDeg(radians);
THREE.MathUtils.randFloat(min, max);
THREE.MathUtils.smoothstep(x, min, max);
```

---

## Common Patterns

### Proper Resource Disposal

```javascript
function dispose() {
  // Dispose geometry
  mesh.geometry.dispose();

  // Dispose material
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((m) => m.dispose());
  } else {
    mesh.material.dispose();
  }

  // Dispose textures
  texture.dispose();

  // Remove from scene
  scene.remove(mesh);

  // Dispose renderer
  renderer.dispose();
}
```

### Clock-Based Animation

```javascript
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();       // Time since last frame (seconds)
  const elapsed = clock.getElapsedTime(); // Total elapsed time (seconds)

  mesh.rotation.y += delta * 0.5; // Consistent speed regardless of frame rate

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

### Responsive Canvas

```javascript
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);
```

### Loading Manager

```javascript
const manager = new THREE.LoadingManager();

manager.onStart = (url, loaded, total) => console.log('Loading started');
manager.onLoad = () => console.log('All assets loaded');
manager.onProgress = (url, loaded, total) => console.log(`${loaded}/${total}`);
manager.onError = (url) => console.error(`Failed to load: ${url}`);

const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
```

---

## Performance Optimization

### Instanced Rendering

Efficiently render many copies of the same geometry:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 10000);

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const rotation = new THREE.Euler();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3(1, 1, 1);

for (let i = 0; i < 10000; i++) {
  position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  quaternion.setFromEuler(rotation);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(i, matrix);
}

mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);
```

### Level of Detail (LOD)

Switch model detail based on camera distance:

```javascript
const lod = new THREE.LOD();

// High detail (close)
const geometryHigh = new THREE.IcosahedronGeometry(10, 4);
lod.addLevel(new THREE.Mesh(geometryHigh, material), 0);

// Medium detail
const geometryMed = new THREE.IcosahedronGeometry(10, 2);
lod.addLevel(new THREE.Mesh(geometryMed, material), 50);

// Low detail (far)
const geometryLow = new THREE.IcosahedronGeometry(10, 0);
lod.addLevel(new THREE.Mesh(geometryLow, material), 100);

scene.add(lod);
```

### Frustum Culling

Automatic feature -- objects outside camera view are not rendered. Enabled by default.

```javascript
// Force disable culling for specific objects
object.frustumCulled = false;

// Manual visibility test
const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4();
matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(matrix);

if (frustum.intersectsObject(object)) {
  // Object is in view
}
```

### Geometry Optimization

```javascript
// Merge geometries (reduces draw calls)
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [geom1, geom2, geom3];
const mergedGeometry = mergeGeometries(geometries);
const mesh = new THREE.Mesh(mergedGeometry, material);

// Dispose old geometries
geometries.forEach(g => g.dispose());
```

### Texture Optimization

```javascript
// Use appropriate sizes (powers of 2)
// 512x512, 1024x1024, 2048x2048

// Mipmaps (auto-generated by default)
texture.generateMipmaps = true;

// Appropriate filtering
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// Anisotropic filtering (quality vs performance tradeoff)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Dispose unused textures
texture.dispose();
```

### Shadow Optimization

```javascript
// Lower shadow map resolution
light.shadow.mapSize.width = 1024;   // Instead of 2048
light.shadow.mapSize.height = 1024;

// Constrain shadow camera frustum
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;

// Reduce shadow-casting objects
object.castShadow = false;    // Far/small objects don't need it
object.receiveShadow = false; // Objects that don't need shadow reception

// Use more efficient shadow type
renderer.shadowMap.type = THREE.PCFShadowMap; // Instead of PCFSoftShadowMap
```

### Material Sharing

```javascript
// Share materials across meshes (reduces memory)
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
const mesh3 = new THREE.Mesh(geometry3, sharedMaterial);
```

### Object Pooling

```javascript
// Reuse objects instead of frequent create/destroy
class ObjectPool {
  constructor(factory, initialSize) {
    this.factory = factory;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  get() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }

  release(obj) {
    this.pool.push(obj);
  }
}

const bulletPool = new ObjectPool(() => {
  return new THREE.Mesh(bulletGeometry, bulletMaterial);
}, 100);
```

### Performance Monitoring

```javascript
// FPS counter
const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer info
console.log(renderer.info);
// Shows: geometry count, texture count, shader programs, draw calls, triangles, points, lines
```

### General Best Practices

- Limit draw calls (merge geometry, use instancing)
- Reduce polygon counts (LOD, simplification)
- Optimize textures (compression, appropriate sizes)
- Share materials and geometries
- Use frustum culling
- Limit light sources (3-5 max)
- Avoid transparency when possible
- Use object pooling for frequent create/destroy
- Profile with browser DevTools
- Test on target devices

---

## External Resources

- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Editor: https://threejs.org/editor/
- Discord: https://discord.gg/56GBJwAnUS
