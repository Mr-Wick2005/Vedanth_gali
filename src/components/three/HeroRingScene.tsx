'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Precompute deterministic ambient particle points (pure, module-level constant)
const PARTICLE_COUNT = 60
const PARTICLE_POSITIONS = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 * 3.1415
    const dist = 1.9 + ((i * 13) % 20) * 0.035
    positions[i * 3] = Math.cos(angle) * dist
    positions[i * 3 + 1] = Math.sin(angle) * dist
    positions[i * 3 + 2] = (((i * 17) % 21) - 10) * 0.04
  }
  return positions
})()

export function HeroRingScene() {
  const primaryRingRef = useRef<THREE.Mesh>(null)
  const secondaryRingRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  // Generate ambient particle geometry from deterministic positions
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(PARTICLE_POSITIONS, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    // Gentle cinematic Z-axis rotation facing camera
    if (primaryRingRef.current) {
      primaryRingRef.current.rotation.z += delta * 0.12
    }

    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.z -= delta * 0.08
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.05
    }

    // Subtle 3D parallax tilt based on mouse pointer
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * -0.08,
        0.05,
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.08,
        0.05,
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* High-contrast cinematic dual-tone lighting */}
      <ambientLight intensity={0.2} />
      {/* Electric Cyan point light on the left */}
      <pointLight position={[-3, 1, 2]} intensity={3.5} color="#00e5ff" distance={8} />
      {/* Neon Violet point light on the right */}
      <pointLight position={[3, -1, 2]} intensity={4.0} color="#8b5cf6" distance={8} />
      {/* Backlight fill for depth */}
      <pointLight position={[0, 2, -1.5]} intensity={2.0} color="#6366f1" distance={6} />

      {/* Primary Electric Neon Energy Ring */}
      <mesh ref={primaryRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.0, 0.038, 32, 128]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Secondary Outer Thin Orbit Ring */}
      <mesh ref={secondaryRingRef} position={[0, 0, -0.05]}>
        <torusGeometry args={[2.28, 0.012, 16, 128]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00b4d8"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Inner Thin Halo Ring */}
      <mesh position={[0, 0, -0.02]}>
        <torusGeometry args={[1.78, 0.008, 16, 128]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ambient Luminous Floating Particle Dust */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.045}
          color="#00e5ff"
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
