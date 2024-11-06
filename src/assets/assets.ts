// assetManager.ts
import * as THREE from 'three';
import { AssetManifest, Asset, AssetBundle, AssetsInitOptions } from './types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const assets = new Map<string, any>();
let manifestPath: string;
let basePath: string;

export function initAssets(params: AssetsInitOptions) {
    manifestPath = params.manifestPath;
    basePath = params.basePath;
}

export async function loadManifest(): Promise<void> {
    const response = await fetch(`./${basePath}/${manifestPath}`);
    const manifest: AssetManifest = await response.json();

    for (const bundle of manifest.bundles) {
        await loadBundle(bundle);
    }
}

async function loadBundle(bundle: AssetBundle): Promise<void> {
    for (const asset of bundle.assets) {
        await loadAsset(asset);
    }
}

async function loadAsset(asset: Asset): Promise<void> {
    // Select the first `src` path to determine the asset type (for simplicity)
    const path = `./${basePath}/${asset.src[0]}`;
    const assetType = inferAssetType(path);
    const loader = getLoader(assetType);

    const loadedAsset = await loader.loadAsync(path);

    // Store in `assets` map using each alias as a key
    for (const alias of asset.alias) {
        assets.set(alias, loadedAsset);
    }
}

function inferAssetType(path: string): 'texture' | 'gltf' | 'audio' {
    const extension = path.split('.').pop()?.toLowerCase();

    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'webp') {
        return 'texture';
    } else if (extension === 'glb' || extension === 'gltf') {
        return 'gltf';
    } else if (extension === 'mp3' || extension === 'wav' || extension === 'ogg') {
        return 'audio';
    } else {
        throw new Error(`Unknown asset type for path: ${path}`);
    }
}

function getLoader(type: 'texture' | 'gltf' | 'audio'): THREE.Loader {
    switch (type) {
        case 'texture':
            return new THREE.TextureLoader();
        case 'gltf':
            return new GLTFLoader();
        case 'audio':
            return new THREE.AudioLoader();
        default:
            throw new Error(`Unsupported asset type: ${type}`);
    }
}

export function getAsset<T>(name: string): T | undefined {
    return assets.get(name);
}

