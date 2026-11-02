'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Precompute 1000 deterministic glowing particles (pure module-level constant)
const PARTICLE_COUNT = 900
const PARTICLE_POSITIONS = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spiral and torus distribution around the ring
    const u = (i / PARTICLE_COUNT) * Math.PI * 2 * 6.0
    const radius = 1.8 + (((i * 19) % 37) / 37) * 0.9
    const theta = (i / PARTICLE_COUNT) * Math.PI * 2
    positions[i * 3] = Math.cos(theta) * radius + (Math.sin(u) * 0.15)
    positions[i * 3 + 1] = Math.sin(theta) * radius + (Math.cos(u) * 0.15)
    positions[i * 3 + 2] = (((i * 23) % 41) - 20) * 0.035
  }
  return positions
})()

export function HeroRingScene() {
  const groupRef = useRef<THREE.Group>(null)
  const primaryRingRef = useRef<THREE.Mesh>(null)
  const secondaryRingRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const shard1Ref = useRef<THREE.Mesh>(null)
  const shard2Ref = useRef<THREE.Mesh>(null)
  const shard3Ref = useRef<THREE.Mesh>(null)

  // Particle geometry
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(PARTICLE_POSITIONS, 3))
    return geo
  }, [])

  useFrame((state, delta) => {
    // 1. Ring rotations
    if (primaryRingRef.current) {
      primaryRingRef.current.rotation.z += delta * 0.14
    }
    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.z -= delta * 0.1
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.04
    }

    // 2. Low-poly shards orbital drift
    if (shard1Ref.current) {
      shard1Ref.current.rotation.x += delta * 0.6
      shard1Ref.current.rotation.y += delta * 0.8
    }
    if (shard2Ref.current) {
      shard2Ref.current.rotation.y += delta * 0.5
      shard2Ref.current.rotation.z += delta * 0.7
    }
    if (shard3Ref.current) {
      shard3Ref.current.rotation.x += delta * 0.4
      shard3Ref.current.rotation.z += delta * 0.5
    }

    // 3. Pointer tilt (ring up to 10 degrees)
    if (groupRef.current) {
      const targetRotX = state.pointer.y * -0.17 // ~10 deg
      const targetRotY = state.pointer.x * 0.17
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06)
    }

    // 4. Subtle camera dolly on pointer depth
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.2 - Math.abs(state.pointer.x) * 0.3, 0.05)
  })

  return (
    <group ref={groupRef}>
      {/* Lighting setup: high contrast neon blue & violet */}
      <ambientLight intensity={0.25} />
      <pointLight position={[-3, 1.5, 2]} intensity={4.5} color="#00e5ff" distance={9} />
      <pointLight position={[3, -1.5, 2]} intensity={5.0} color="#8b5cf6" distance={9} />
      <pointLight position={[0, 2, -1.5]} intensity={2.5} color="#a78bfa" distance={7} />

      {/* Primary Electric Neon Energy Ring */}
      <mesh ref={primaryRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.05, 0.04, 32, 128]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Secondary Outer Thin Cyan Orbit Ring */}
      <mesh ref={secondaryRingRef} position={[0, 0, -0.06]}>
        <torusGeometry args={[2.35, 0.015, 16, 128]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Halo Ring */}
      <mesh position={[0, 0, -0.02]}>
        <torusGeometry args={[1.78, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Low-poly geometric shards */}
      <mesh ref={shard1Ref} position={[-2.1, 1.3, -0.2]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh ref={shard2Ref} position={[2.2, -1.1, -0.15]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.15} metalness={0.9} />
      </mesh>
      <mesh ref={shard3Ref} position={[1.4, 1.8, -0.3]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Luminous Particle Field */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.035}
          color="#c4b5fd"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
