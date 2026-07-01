"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function MoldCore() {
  const group = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#dbeafe",
        metalness: 0.48,
        roughness: 0.24,
        transmission: 0.18,
        thickness: 0.45,
        clearcoat: 0.9,
        clearcoatRoughness: 0.18
      }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.28;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.55}>
        <mesh material={material} castShadow receiveShadow>
          <boxGeometry args={[1.55, 1.05, 0.42, 4, 4, 4]} />
        </mesh>
        <mesh position={[0.03, 0, 0.27]}>
          <torusGeometry args={[0.62, 0.055, 32, 96]} />
          <meshStandardMaterial color="#1b9dff" metalness={0.35} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0, 0.33]}>
          <torusGeometry args={[0.34, 0.035, 32, 96]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.55} roughness={0.16} />
        </mesh>
        <mesh position={[0.7, 0.54, 0.1]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[-0.72, -0.48, 0.12]}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshStandardMaterial color="#43d5ff" emissive="#43d5ff" emissiveIntensity={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitRings() {
  const outer = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!outer.current) return;
    outer.current.rotation.z = state.clock.elapsedTime * 0.16;
    outer.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={outer}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation={[Math.PI / (index + 2), Math.PI / (index + 3), index * 0.8]}>
          <torusGeometry args={[1.28 + index * 0.18, 0.008, 12, 160]} />
          <meshBasicMaterial color={index === 1 ? "#c9a86a" : "#1b9dff"} transparent opacity={index === 1 ? 0.34 : 0.42} />
        </mesh>
      ))}
    </group>
  );
}

export function ManufacturingScene() {
  return (
    <div className="h-full min-h-[420px] w-full">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 42 }} shadows>
        <ambientLight intensity={1.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <pointLight position={[-2, 1.5, 2]} intensity={1.4} color="#43d5ff" />
        <OrbitRings />
        <MoldCore />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
