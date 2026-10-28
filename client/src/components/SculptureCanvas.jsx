import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function makeMetal(color, roughness = 0.24) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness });
}

function createSculpture() {
  const sculpture = new THREE.Group();
  const geometries = [];
  const materials = [];

  function addMesh(geometry, material, position, rotation = [0, 0, 0]) {
    geometries.push(geometry);
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    sculpture.add(mesh);
    return mesh;
  }

  const silver = makeMetal('#aeb5ba');
  const lightSilver = makeMetal('#d3d5d3', 0.19);
  const darkSteel = makeMetal('#777f84', 0.2);
  const charcoal = makeMetal('#25282a', 0.3);
  const red = makeMetal('#d43b32', 0.26);
  const rimSilver = makeMetal('#c6c9c8', 0.2);

  addMesh(new THREE.TorusGeometry(1.3, 0.21, 20, 84), silver, [0, 0, 0], [1.12, 0.05, 0.05]);
  addMesh(new THREE.TorusGeometry(0.86, 0.16, 18, 72), darkSteel, [0, 0, 0], [0.92, 0.58, 0.12]);
  addMesh(new THREE.TorusGeometry(0.48, 0.105, 16, 64), lightSilver, [0, 0, 0], [1.45, -0.3, 0.34]);
  addMesh(new THREE.CylinderGeometry(0.3, 0.3, 0.28, 40), charcoal, [0, 0, 0], [Math.PI / 2, 0, 0]);
  addMesh(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 32), red, [0, 0.16, 0], [Math.PI / 2, 0, 0]);
  addMesh(new THREE.IcosahedronGeometry(0.16, 1), red, [1.6, 0.42, -0.2], [0.3, 0.2, 0.3]);
  addMesh(new THREE.IcosahedronGeometry(0.09, 0), rimSilver, [-1.48, -0.55, 0.1], [0.2, 0.4, -0.2]);
  sculpture.rotation.set(0.26, 0.1, -0.22);

  return {
    sculpture,
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    }
  };
}

export default function SculptureCanvas({ reducedMotion }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let disposed = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const sculptureObject = createSculpture();
    scene.add(sculptureObject.sculpture);

    scene.add(new THREE.AmbientLight('#e5e4df', 0.62));
    const keyLight = new THREE.DirectionalLight('#f0eee9', 2.2);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);
    const redLight = new THREE.PointLight('#e23f35', 18, 7);
    redLight.position.set(-3, 1.4, 2);
    scene.add(redLight);
    const fillLight = new THREE.PointLight('#86939b', 9, 6);
    fillLight.position.set(1, -3, -2);
    scene.add(fillLight);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.3));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      canvas.dataset.engine = `three.js r${THREE.REVISION}`;
    } catch (error) {
      sculptureObject.dispose();
      console.error('FLEX GYM 3D visual could not start; using the CSS fallback.', error);
      setFailed(true);
      return undefined;
    }

    let elapsed = 0;
    const resize = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      if (!width || !height || !renderer) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const onPointerMove = (event) => {
      targetPointer.set(
        (event.clientX / window.innerWidth - 0.5) * 0.18,
        (event.clientY / window.innerHeight - 0.5) * 0.12
      );
    };
    const onScroll = () => {
      if (reducedMotion) renderer.render(scene, camera);
    };

    let previousFrame = 0;
    const animate = (time) => {
      if (disposed || !renderer) return;
      const delta = previousFrame ? Math.min((time - previousFrame) / 1000, 0.05) : 0;
      previousFrame = time;
      elapsed += delta;
      pointer.lerp(targetPointer, 1 - Math.exp(-delta * 2.2));
      const scrollProgress = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      sculptureObject.sculpture.rotation.y += delta * 0.12;
      sculptureObject.sculpture.position.y = Math.sin(elapsed * 0.5) * 0.045;
      sculptureObject.sculpture.rotation.x = THREE.MathUtils.damp(sculptureObject.sculpture.rotation.x, 0.26 + pointer.y + scrollProgress * 0.1, 3, delta);
      sculptureObject.sculpture.rotation.z = THREE.MathUtils.damp(sculptureObject.sculpture.rotation.z, -0.22 - pointer.x, 3, delta);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.35, 2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -pointer.y * 0.28, 2, delta);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    resize();
    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      animationFrame = window.requestAnimationFrame(animate);
    }
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', resize, { passive: true });
    } else {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      resizeObserver?.disconnect();
      sculptureObject.dispose();
      scene.clear();
      renderer?.dispose();
    };
  }, [reducedMotion]);

  return failed
    ? <div className="sculpture-fallback" aria-hidden="true"><span className="fallback-ring ring-a" /><span className="fallback-ring ring-b" /><span className="fallback-hub" /></div>
    : <canvas ref={canvasRef} className="sculpture-renderer" aria-label="Animated metallic fitness sculpture" />;
}
