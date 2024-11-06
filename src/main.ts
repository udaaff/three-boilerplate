import { DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, Texture, WebGLRenderer } from "three";

import { getAsset, initAssets, loadBundles } from "./assets/assets";

document.addEventListener("DOMContentLoaded", async () => {
    await main();
});

async function main() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    document.body.appendChild(renderer.domElement);

    await initAssets({
        manifestPath: "assets-manifest.json",
        basePath: "assets"
    });
    await loadBundles("common");

    const texture = getAsset<Texture>("three-js-icon.png");
    const material = new MeshBasicMaterial({
        map: texture, transparent: true, side: DoubleSide
    });
    const geometry = new PlaneGeometry(2, 2);
    const plane = new Mesh(geometry, material);
    scene.add(plane);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    function animate() {
        requestAnimationFrame(animate);
        plane.rotateX(0.01);
        plane.rotateY(0.01);
        plane.rotateZ(0.01);
        renderer.render(scene, camera);
    }
    animate();
}