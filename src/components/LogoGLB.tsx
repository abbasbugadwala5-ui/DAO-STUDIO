"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const GOLD = "#E8C878";
const EMISSIVE = "#B8975A";

type RefVal<T> = { current: T };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpVec3 = (
  out: THREE.Vector3,
  to: [number, number, number],
  t: number,
) => {
  out.x = lerp(out.x, to[0], t);
  out.y = lerp(out.y, to[1], t);
  out.z = lerp(out.z, to[2], t);
};

// Target poses driving the cinematic scroll-through. Each section claims one
// pose number (see GlobalLogoScene + section ScrollTriggers). The logo lerps
// smoothly between targets, like a single movie shot tracking through.
const POSES = [
  // HERO (poses 0-4)
  { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.0, emissive: 0.75 },
  { pos: [-2.2, 0.4, 0], rot: [0.25, 0.5, -0.1], scale: 1.05, emissive: 0.85 },
  { pos: [2.2, -0.2, 0], rot: [-0.15, -0.55, 0.1], scale: 1.0, emissive: 1.0 },
  { pos: [0.4, -1.0, 0.5], rot: [Math.PI / 2 - 0.35, 0.15, 0], scale: 0.75, emissive: 0.9 },
  { pos: [0, 0.2, 0], rot: [0.1, Math.PI, 0], scale: 0.9, emissive: 0.8 },
  // BELOW HERO (5-8)
  { pos: [3.2, -1.0, -1.5], rot: [-0.25, 1.1, 0.3], scale: 0.7, emissive: 0.7 },
  { pos: [0, 1.2, -2], rot: [Math.PI / 2 - 0.15, Math.PI * 0.3, 0], scale: 0.85, emissive: 0.95 },
  { pos: [-2.6, 0.4, 2], rot: [0.2, -0.6, -0.2], scale: 1.25, emissive: 1.0 },
  { pos: [0, 0, 1.5], rot: [0, Math.PI * 2, 0], scale: 1.4, emissive: 1.15 },
] as const;

export default function LogoGLB({
  progress,
  pose,
  url = "/logo.glb",
}: {
  progress: RefVal<number>;
  pose: RefVal<number>;
  url?: string;
}) {
  const { scene } = useGLTF(url);
  void progress;
  const meshRef = useRef<THREE.Mesh>(null);

  const merged = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    scene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (!m.isMesh || !m.geometry) return;
      m.updateMatrixWorld(true);
      const g = m.geometry.clone();
      g.applyMatrix4(m.matrixWorld);

      const stripped = new THREE.BufferGeometry();
      const posAttr = g.getAttribute("position");
      if (posAttr) stripped.setAttribute("position", posAttr);
      let nrm = g.getAttribute("normal");
      if (!nrm) {
        const tmp = new THREE.BufferGeometry();
        if (posAttr) tmp.setAttribute("position", posAttr);
        tmp.computeVertexNormals();
        nrm = tmp.getAttribute("normal");
      }
      if (nrm) stripped.setAttribute("normal", nrm);
      if (g.index) stripped.setIndex(g.index);
      geometries.push(stripped);
    });

    if (!geometries.length) return new THREE.BufferGeometry();
    const result = mergeGeometries(geometries, false) ?? geometries[0];

    result.computeBoundingBox();
    result.computeBoundingSphere();
    const box = result.boundingBox!;
    const center = box.getCenter(new THREE.Vector3());
    result.translate(-center.x, -center.y, -center.z);

    // Stand upright (ImageToStl exports Z-up; Three.js is Y-up).
    result.rotateX(Math.PI / 2);

    result.computeBoundingBox();
    result.computeBoundingSphere();
    const sphere2 = result.boundingSphere!;
    const k = sphere2.radius > 0 ? 2.3 / sphere2.radius : 1;
    result.scale(k, k, k);
    result.computeBoundingSphere();
    return result;
  }, [scene]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(GOLD),
        metalness: 0.85,
        roughness: 0.22,
        emissive: new THREE.Color(EMISSIVE),
        emissiveIntensity: 0.75,
      }),
    [],
  );

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const time = state.clock.elapsedTime;

    const idx = Math.max(0, Math.min(POSES.length - 1, pose.current));
    const target = POSES[idx];

    const k = 0.06;
    const mx = state.mouse.x * 0.35;
    const my = state.mouse.y * 0.25;
    lerpVec3(
      m.position,
      [target.pos[0] + mx, target.pos[1] + my, target.pos[2]],
      k,
    );
    m.rotation.x = lerp(m.rotation.x, target.rot[0] + my * 0.15, k);
    m.rotation.y = lerp(
      m.rotation.y,
      target.rot[1] + time * 0.3 + mx * 0.2,
      k,
    );
    m.rotation.z = lerp(m.rotation.z, target.rot[2], k);

    const targetScale = target.scale + Math.sin(time * 0.6) * 0.02;
    const s = lerp(m.scale.x, targetScale, k);
    m.scale.set(s, s, s);

    m.position.y += Math.sin(time * 0.6) * 0.05;

    const targetGlow = target.emissive + Math.sin(time * 1.5) * 0.05;
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = lerp(mat.emissiveIntensity, targetGlow, 0.08);
  });

  return <mesh ref={meshRef} geometry={merged} material={material} />;
}

useGLTF.preload("/logo.glb");
