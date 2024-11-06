import { DoubleSide, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, Texture, WebGLRenderer } from "three";

import { getAsset, initAssets, loadBundles } from "./assets/assets";

document.addEventListener("DOMContentLoaded", async () => {
    await main();
});

function createLogo(): Mesh {
    return new Mesh(
        new PlaneGeometry(2, 2),
        new MeshBasicMaterial({
            map: getAsset<Texture>("three-js-icon.png"),
            transparent: true,
            side: DoubleSide
        })
    )
}

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

    const group = new Group();
    scene.add(group);

    // for (let i = 0; i < 20; ++i) {
    //     const logo = createLogo();
    //     logo.position.set(
    //         -5 + 10 * Math.random(),
    //         -5 + 10 * Math.random(),
    //         -5 + 10 * Math.random()
    //     );
    //     group.add(logo);
    // }
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
        renderer.render(scene, camera);
    }
    animate();
}