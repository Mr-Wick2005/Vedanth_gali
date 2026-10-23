'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Precompute deterministic ambient particle points (pure, module-level constant)
const PARTICLE_COUNT = 50
const PARTICLE_POSITIONS = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 3.618
    const radius = 2.0 + ((i * 17) % 15) * 0.1
    positions[i * 3] = Math.cos(theta) * radius
    positions[i * 3 + 1] = (((i * 23) % 20) - 10) * 0.1
    positions[i * 3 + 2] = Math.sin(theta) * radius
  }
  return positions
})()

export function HeroRingScene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { pointer } = useThree()

  // Generate ambient particle geometry from deterministic positions
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(PARTICLE_POSITIONS, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Continuous procedural rotation
      meshRef.current.rotation.x += delta * 0.25
      meshRef.current.rotation.y += delta * 0.35

      // Smooth pointer parallax lerping
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        meshRef.current.rotation.x + pointer.y * 0.1,
        0.05,
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        meshRef.current.rotation.y + pointer.x * 0.1,
        0.05,
      )
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.1
    }
  })

  return (
    <group>
      {/* Dynamic directional lighting inside the 3D scene */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-4, -4, 2]} intensity={2.0} color="#8B5CF6" />
      <pointLight position={[3, 3, -2]} intensity={1.5} color="#06b6d4" />

      {/* Main Procedural Torus Ring */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.12, 32, 100]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6D28D9"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Ambient Particle Dust */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial size={0.035} color="#A78BFA" transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  )
}
