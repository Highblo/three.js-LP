import * as THREE from "three";
import GUI from "lil-gui";

const canvas = document.querySelector(".webgl");

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//ジオメトリ
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 60);
const octahedronGeometry = new THREE.OctahedronGeometry();
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16);
const icosahedronGeometry = new THREE.IcosahedronGeometry();

//マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

//メッシュ
const torus = new THREE.Mesh(torusGeometry, material);
const octahedron = new THREE.Mesh(octahedronGeometry, material);
const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
scene.add(torus, octahedron, torusKnot, icosahedron);

//メッシュの位置
torus.position.set(2, 0, 0);
octahedron.position.set(-1, 0, 0);
torusKnot.position.set(2, 0, -6);
icosahedron.position.set(5, 0, 3);

//UIデバッグ
const gui = new GUI();
gui.addColor(material, "color");
gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);

//ライト
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//ブラウザのリサイズ
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//メッシュを配列に入れる
const meshes = [torus, octahedron, torusKnot, icosahedron];

const clock = new THREE.Clock();

//ホイール
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0002;
  console.log(speed);
});

const wheelRot = () => {
  rotation += speed;
  speed *= 0.93;
  torus.position.x = 2 + 3.8 * Math.cos(rotation);
  torus.position.z = -3 + 3.8 * Math.sin(rotation);
  octahedron.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  octahedron.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  torusKnot.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  torusKnot.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  icosahedron.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  icosahedron.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));
  window.requestAnimationFrame(wheelRot);
};
wheelRot();

//アニメーション
const animate = () => {
  renderer.render(scene, camera);
  let getDeltaTime = clock.getDelta();
  meshes.forEach((mesh) => {
    mesh.rotation.x += 0.2 * getDeltaTime;
    mesh.rotation.y += 0.2 * getDeltaTime;
  });
  window.requestAnimationFrame(animate);
};
animate();
