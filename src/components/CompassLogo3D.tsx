"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import LogoGLB from "./LogoGLB";
import GLBErrorBoundary from "./GLBErrorBoundary";

type RefVal<T> = { current: T };

const GOLD = "#B8975A";
const EMISSIVE = "#D4B97C";

type Progress = { current: number }; // 0 = assembled, 1 = fully broken apart

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function GoldMaterial(props: { emissiveIntensity?: number }) {
  return (
    <meshStandardMaterial
      color={GOLD}
      metalness={0.85}
      roughness={0.15}
      emissive={EMISSIVE}
      emissiveIntensity={props.emissiveIntensity ?? 0.2}
    />
  );
}

function ProceduralCompass({ progress }: { progress: Progress }) {
  const outerArc = useRef<THREE.Mesh>(null);
  const midArc = useRef<THREE.Mesh>(null);
  const innerArc = useRef<THREE.Mesh>(null);
  const diamond = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Mesh>(null);
  const dot = useRef<THREE.Mesh>(null);
  const barsGroup = useRef<THREE.Group>(null);
  const rootGroup = useRef<THREE.Group>(null);

  const bars = useMemo(() => {
    const N = 40;
    const span = 4.0;
    const step = span / (N - 1);
    const start = -span / 2;
    // Deterministic heights (no Math.random) so the look is stable.
    const heights = Array.from({ length: N }, (_, i) =>
      0.3 + ((i * 31) % 14) / 10,
    );
    return Array.from({ length: N }, (_, i) => {
      const x = start + i * step;
      const explodeX = x * 3 + (i - N / 2) * 0.05;
      const explodeY = (((i * 17) % 20) - 10) / 10;
      return { x, scaleY: heights[i], explodeX, explodeY };
    });
  }, []);

  useFrame((state) => {
    const t = ease(progress.current);
    const time = state.clock.elapsedTime;

    const idleRotY = (1 - t) * Math.sin(time * 0.6) * 0.15;
    const idleRotX = (1 - t) * Math.sin(time * 0.5) * 0.05;
    if (rootGroup.current) {
      rootGroup.current.rotation.y = idleRotY;
      rootGroup.current.rotation.x = idleRotX;
    }

    if (outerArc.current) {
      outerArc.current.position.x = lerp(0, -3.2, t);
      outerArc.current.position.y = lerp(0, 1.4, t);
      outerArc.current.rotation.z = lerp(Math.PI, Math.PI - 0.6, t);
    }
    if (midArc.current) {
      midArc.current.position.x = lerp(0, 3.2, t);
      midArc.current.position.y = lerp(0, 1.6, t);
      midArc.current.rotation.z = lerp(Math.PI, Math.PI + 0.7, t);
    }
    if (innerArc.current) {
      innerArc.current.position.y = lerp(0, -2.4, t);
      innerArc.current.rotation.z = lerp(Math.PI, Math.PI + 1.2, t);
    }
    if (diamond.current) {
      diamond.current.position.y = lerp(3.05, 5.2, t);
      diamond.current.rotation.y = time * 0.8;
    }
    if (needle.current) {
      needle.current.scale.y = lerp(1, 0.05, t);
    }
    if (barsGroup.current) {
      barsGroup.current.children.forEach((bar, i) => {
        const def = bars[i];
        bar.position.x = lerp(def.x, def.explodeX, t);
        bar.position.y = lerp(-0.5, -0.5 + def.explodeY, t);
        (bar as THREE.Mesh).rotation.z = lerp(0, (i - 20) * 0.05, t);
      });
    }
  });

  return (
    <group ref={rootGroup}>
      <mesh ref={outerArc} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[2.4, 0.035, 16, 64, Math.PI]} />
        <GoldMaterial />
      </mesh>
      <mesh ref={midArc} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[1.7, 0.04, 16, 64, Math.PI]} />
        <GoldMaterial />
      </mesh>
      <mesh ref={innerArc} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[1.0, 0.045, 16, 64, Math.PI]} />
        <GoldMaterial />
      </mesh>
      <mesh ref={diamond} position={[0, 3.05, 0]} scale={[0.12, 0.25, 0.12]}>
        <octahedronGeometry args={[1]} />
        <GoldMaterial emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={needle} position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
        <GoldMaterial />
      </mesh>
      <mesh ref={dot} position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <GoldMaterial emissiveIntensity={0.5} />
      </mesh>
      <group ref={barsGroup}>
        {bars.map((bar, i) => (
          <mesh key={i} position={[bar.x, -0.5, 0]} scale={[1, bar.scaleY, 1]}>
            <boxGeometry args={[0.06, 0.18, 0.03]} />
            <GoldMaterial emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * GridFloor — a wireframe gold grid that lays flat on the floor of the scene.
 * Smoothly fades in/out + tilts based on `pose`. Only visible in the flat /
 * "Actionable" pose (3), where it gives the camera a perspective floor like
 * the SOLAIS reference screenshot.
 */
function GridFloor({ pose }: { pose: RefVal<number> }) {
  const ref = useRef<THREE.GridHelper>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);

  useFrame(() => {
    if (!ref.current) return;
    // Pose 3 is the "actionable" / tilted state — show grid there.
    const want = pose.current === 3 ? 1 : 0;
    const mat =
      materialRef.current ?? (ref.current.material as THREE.LineBasicMaterial);
    materialRef.current = mat;
    mat.transparent = true;
    mat.opacity = mat.opacity + (want - mat.opacity) * 0.06;
  });

  return (
    <gridHelper
      ref={ref}
      args={[30, 28, "#B8975A", "#8a6a3a"]}
      position={[0, -2.6, 0]}
    />
  );
}

export default function CompassLogo3D({
  className = "",
  scrollProgress = 0,
  pose = 0,
}: {
  className?: string;
  scrollProgress?: number;
  pose?: number;
}) {
  const progressRef = useRef({ current: scrollProgress });
  progressRef.current.current = scrollProgress;
  const poseRef = useRef({ current: pose });
  poseRef.current.current = pose;

  // The procedural compass is the universal fallback: shown while the GLB is
  // loading (Suspense) AND if the GLB fetch fails (ErrorBoundary).
  const fallback = <ProceduralCompass progress={progressRef.current} />;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.2, 8], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* SOLAIS-style metallic lighting: warm key, cool gold fill,
            rim light, ground bounce. No external HDR — keeps build fast. */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color={"#fff5e0"} />
        <directionalLight position={[-5, 2, -3]} intensity={0.8} color={"#D4A853"} />
        <directionalLight position={[0, -4, 2]} intensity={0.5} color={"#7a5a2a"} />
        <pointLight position={[0, 2, 5]} intensity={1.0} color={"#E8C878"} />
        <pointLight position={[-3, -1, 2]} intensity={0.5} color={"#8a6a3a"} />

        <GridFloor pose={poseRef.current} />

        <GLBErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <LogoGLB progress={progressRef.current} pose={poseRef.current} />
          </Suspense>
        </GLBErrorBoundary>
      </Canvas>
    </div>
  );
}
