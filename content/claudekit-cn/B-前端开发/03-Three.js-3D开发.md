> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：前端开发

# Three.js 3D 开发

使用 Three.js 构建高性能 3D Web 应用——一个跨浏览器的 WebGL/WebGPU 库。

## 适用场景

- 3D 场景、模型、动画或可视化
- WebGL/WebGPU 渲染与图形编程
- 交互式 3D 体验（游戏、配置器、数据可视化）
- 相机控制、光照、材质或着色器（Shader）
- 加载 3D 资源（GLTF、FBX、OBJ）或纹理
- 后处理效果（泛光 Bloom、景深 DOF、环境光遮蔽 SSAO）
- 物理仿真、VR/XR 体验或空间音频
- 性能优化（实例化、LOD、视锥体剔除）

## 渐进式学习路径

### 第1级：入门基础
- 基础知识 - 场景设置、基本几何体、材质、光照、渲染循环

### 第2级：常见任务
- **资源加载**：GLTF、FBX、OBJ、纹理加载器
- **纹理**：类型、映射、环绕、过滤
- **相机**：透视相机（Perspective）、正交相机（Orthographic）、控制器
- **光照**：类型、阴影、辅助工具
- **动画**：动画片段（Clip）、混合器（Mixer）、关键帧
- **数学**：向量（Vector）、矩阵（Matrix）、四元数（Quaternion）、曲线
- **几何体**：内置形状、BufferGeometry、自定义几何体、实例化
- **材质**：PBR、基础、Phong、Lambert、物理、卡通、法线、深度、原始、着色器材质

### 第3级：交互与效果
- **交互**：射线投射（Raycasting）、拾取、变换
- **后处理**：渲染通道（Pass）、泛光（Bloom）、SSAO、SSR
- **控制器插件**：轨道控制器（Orbit）、变换控制器（Transform）、第一人称控制器

### 第4级：高级渲染
- **高级材质**：PBR、自定义着色器
- **性能优化**：实例化（Instancing）、LOD、批处理（Batching）、剔除（Culling）
- **节点材质（TSL）**：着色器图、计算着色器

### 第5级：专业领域
- **物理引擎**：Ammo、Rapier、Jolt、VR/XR
- **高级加载器**：SVG、VRML、领域特定格式
- **WebGPU**：现代后端、计算着色器
- **着色器**：GLSL、ShaderMaterial、Uniforms、自定义效果

---

## 快速开始模式

```javascript
// 1. 场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. 添加物体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 3. 添加光照
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 4. 动画循环
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

---

## 基础知识详解

### 场景（Scene）

所有 3D 物体、光照和相机的容器。

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // 纯色背景
scene.background = texture;                    // 天空盒纹理
scene.background = cubeTexture;                // 立方体贴图
scene.environment = envMap;                    // PBR 环境贴图
scene.fog = new THREE.Fog(0xffffff, 1, 100);   // 线性雾
scene.fog = new THREE.FogExp2(0xffffff, 0.02); // 指数雾
```

### 相机（Camera）

#### 透视相机（PerspectiveCamera）- 最常用，模拟人眼

```javascript
// PerspectiveCamera(视场角, 宽高比, 近裁剪面, 远裁剪面)
const camera = new THREE.PerspectiveCamera(
  75,                                          // 视场角（度）
  window.innerWidth / window.innerHeight,      // 宽高比
  0.1,                                         // 近裁剪面
  1000,                                        // 远裁剪面
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix(); // 修改 fov、aspect、near、far 后需调用
```

#### 正交相机（OrthographicCamera）- 无透视畸变，适合 2D/等距视图

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

#### 立方体相机（CubeCamera）- 渲染环境贴图用于反射

```javascript
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

// 用于反射
material.envMap = cubeRenderTarget.texture;

// 每帧更新（消耗大！）
cubeCamera.position.copy(reflectiveMesh.position);
cubeCamera.update(renderer, scene);
```

### WebGL 渲染器

```javascript
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'), // 可选的已有 canvas
  antialias: true,                           // 抗锯齿
  alpha: true,                               // 透明背景
  powerPreference: 'high-performance',       // GPU 偏好
  preserveDrawingBuffer: true,               // 用于截图
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// 色彩空间（Three.js r152+）
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### Object3D

所有 3D 对象的基类。Mesh、Group、Light、Camera 都继承自 Object3D。

```javascript
const obj = new THREE.Object3D();

// 变换
obj.position.set(x, y, z);
obj.rotation.set(x, y, z);    // 欧拉角（弧度）
obj.quaternion.set(x, y, z, w); // 四元数旋转
obj.scale.set(x, y, z);

// 本地 vs 世界变换
obj.getWorldPosition(targetVector);
obj.getWorldQuaternion(targetQuaternion);
obj.getWorldDirection(targetVector);

// 层级关系
obj.add(child);
obj.remove(child);
obj.parent;
obj.children;

// 可见性
obj.visible = false;

// 层（用于选择性渲染/射线投射）
obj.layers.set(1);
obj.layers.enable(2);

// 遍历层级
obj.traverse((child) => {
  if (child.isMesh) child.material.color.set(0xff0000);
});
```

### 网格（Mesh）

组合几何体和材质。

```javascript
const mesh = new THREE.Mesh(geometry, material);

// 多材质（每个几何体组一个）
const mesh = new THREE.Mesh(geometry, [material1, material2]);

// 常用属性
mesh.castShadow = true;    // 投射阴影
mesh.receiveShadow = true; // 接收阴影
mesh.frustumCulled = true; // 默认：超出视锥体则跳过渲染
mesh.renderOrder = 10;     // 数值越大越晚渲染
```

### 坐标系

Three.js 使用**右手坐标系**：
- **+X** 指向右
- **+Y** 指向上
- **+Z** 指向观察者（屏幕外）

```javascript
// 坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); // 红=X, 绿=Y, 蓝=Z
```

---

## 数学工具

### Vector3

```javascript
const v = new THREE.Vector3(x, y, z);

// 操作（原地修改）
v.add(v2);
v.sub(v2);
v.multiplyScalar(2);
v.normalize();
v.lerp(target, alpha);

// 计算（返回新值）
v.length();
v.lengthSq();          // 比 length() 快
v.distanceTo(v2);
v.dot(v2);
v.cross(v2);

// 变换
v.applyMatrix4(matrix);
v.applyQuaternion(q);
v.project(camera);     // 世界坐标 -> NDC
v.unproject(camera);   // NDC -> 世界坐标
```

### 四元数（Quaternion）

```javascript
const q = new THREE.Quaternion();
q.setFromEuler(euler);
q.setFromAxisAngle(axis, angle);
q.setFromRotationMatrix(matrix);

q.multiply(q2);
q.slerp(target, t);    // 球面插值
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

## 常见模式

### 正确的资源清理

```javascript
function dispose() {
  // 释放几何体
  mesh.geometry.dispose();

  // 释放材质
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((m) => m.dispose());
  } else {
    mesh.material.dispose();
  }

  // 释放纹理
  texture.dispose();

  // 从场景移除
  scene.remove(mesh);

  // 释放渲染器
  renderer.dispose();
}
```

### 使用时钟控制动画

```javascript
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();       // 上一帧以来的时间（秒）
  const elapsed = clock.getElapsedTime(); // 总经过时间（秒）

  mesh.rotation.y += delta * 0.5; // 无论帧率如何，速度保持一致

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

### 响应式画布

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

### 加载管理器

```javascript
const manager = new THREE.LoadingManager();

manager.onStart = (url, loaded, total) => console.log('开始加载');
manager.onLoad = () => console.log('全部加载完成');
manager.onProgress = (url, loaded, total) => console.log(`${loaded}/${total}`);
manager.onError = (url) => console.error(`加载失败: ${url}`);

const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
```

---

## 性能优化

### 实例化渲染（Instancing）

高效渲染大量相同几何体的副本：

```javascript
// 不需要创建 10,000 个独立的网格
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 10000);

// 为每个实例设置变换
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

### 细节层次（LOD）

根据距离切换不同精度的模型：

```javascript
const lod = new THREE.LOD();

// 高精度（近距离）
const geometryHigh = new THREE.IcosahedronGeometry(10, 4);
lod.addLevel(new THREE.Mesh(geometryHigh, material), 0);

// 中精度
const geometryMed = new THREE.IcosahedronGeometry(10, 2);
lod.addLevel(new THREE.Mesh(geometryMed, material), 50);

// 低精度（远距离）
const geometryLow = new THREE.IcosahedronGeometry(10, 0);
lod.addLevel(new THREE.Mesh(geometryLow, material), 100);

scene.add(lod);
```

### 视锥体剔除（Frustum Culling）

自动功能——相机视野外的物体不会被渲染。默认开启。

```javascript
// 强制禁用特定物体的剔除
object.frustumCulled = false;

// 手动测试是否在视野内
const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4();
matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(matrix);

if (frustum.intersectsObject(object)) {
  // 物体在视野内
}
```

### 几何体优化

```javascript
// 合并几何体（减少绘制调用）
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [geom1, geom2, geom3];
const mergedGeometry = mergeGeometries(geometries);
const mesh = new THREE.Mesh(mergedGeometry, material);

// 释放旧几何体
geometries.forEach(g => g.dispose());
```

### 纹理优化

```javascript
// 使用适当的尺寸（2的幂次方）
// 512x512, 1024x1024, 2048x2048

// 使用 Mipmap（默认自动生成）
texture.generateMipmaps = true;

// 适当的过滤方式
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// 各向异性过滤（平衡质量与性能）
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// 释放不用的纹理
texture.dispose();
```

### 阴影优化

```javascript
// 降低阴影贴图分辨率
light.shadow.mapSize.width = 1024;   // 而非 2048
light.shadow.mapSize.height = 1024;

// 限制阴影相机视锥体
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;

// 减少投射阴影的物体
object.castShadow = false;    // 远处/小物体不需要
object.receiveShadow = false; // 不需要接收阴影的物体

// 使用更高效的阴影类型
renderer.shadowMap.type = THREE.PCFShadowMap; // 而非 PCFSoftShadowMap
```

### 材质共享

```javascript
// 多个网格共享材质（减少内存）
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
const mesh3 = new THREE.Mesh(geometry3, sharedMaterial);
```

### 对象池

```javascript
// 复用对象，而非频繁创建/销毁
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

### 性能监控

```javascript
// FPS 计数器
const stats = new Stats();
document.body.appendChild(stats.dom);

// 渲染器信息
console.log(renderer.info);
// 显示：几何体数、纹理数、着色器程序数、绘制调用数、三角形数、点数、线数
```

### 通用最佳实践

- 限制绘制调用（合并几何体、使用实例化）
- 减少多边形数量（LOD、简化）
- 优化纹理（压缩、适当尺寸）
- 共享材质和几何体
- 使用视锥体剔除
- 限制光源数量（最多 3-5 个）
- 尽量避免透明材质
- 频繁创建/销毁的对象使用对象池
- 使用浏览器 DevTools 进行性能分析
- 在目标设备上测试

---

## 外部资源

- 官方文档：https://threejs.org/docs/
- 示例：https://threejs.org/examples/
- 编辑器：https://threejs.org/editor/
- Discord：https://discord.gg/56GBJwAnUS
