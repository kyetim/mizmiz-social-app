'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
    }
  })

  return (
    <RoundedBox ref={meshRef} args={[2, 2, 2]} radius={0.2} smoothness={4}>
      <meshStandardMaterial
        color="#16a34a"
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={1}
      />
    </RoundedBox>
  )
}

export function FloatingCube() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />
        <AnimatedCube />
      </Canvas>
    </div>
  )
}

