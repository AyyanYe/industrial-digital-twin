"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";

// Types matching our Python Simulator
interface MotorData {
  temperature: number;
  vibration: number;
  status: string;
}

const MotorMesh = ({ data }: { data: MotorData }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Logic: Color changes based on Temperature
  const motorColor = useMemo(() => {
    if (data.temperature > 50) return "#ef4444"; // Red (Hot)
    if (data.temperature > 40) return "#f59e0b"; // Orange (Warm)
    return "#10b981"; // Green (Normal)
  }, [data.temperature]);

  // Logic: Vibration causes physical jitter
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Create random jitter based on vibration magnitude
    const jitter = data.vibration * 0.02; 
    meshRef.current.position.x = (Math.random() - 0.5) * jitter;
    meshRef.current.position.y = (Math.random() - 0.5) * jitter;
    
    // Slow rotation for visual flair
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group dispose={null}>
      {/* The Motor Housing (Cylinder) */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 3, 32]} />
        <meshStandardMaterial color={motorColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floating Label */}
      <Html position={[0, 2, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm border border-white/20">
          Temp: {data.temperature.toFixed(1)}°C
        </div>
      </Html>
    </group>
  );
};

export default function MotorScene({ data }: { data: MotorData }) {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 5]} angle={0.3} intensity={2} />

        {/* The Digital Twin */}
        <MotorMesh data={data} />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
        <gridHelper args={[10, 10, 0x444444, 0x222222]} />
      </Canvas>
    </div>
  );
}