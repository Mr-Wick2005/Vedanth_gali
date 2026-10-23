'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function HeroRingScene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { pointer } = useThree()

  // Generate 50 ambient particle points
  const particleGeo = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const radius = 2.0 + Math.random() * 1.5
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.0
      positions[i * 3 + 2] = Math.sin(theta) * radius
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
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
    <>
      {/* 3D Scene Lighting: Key Violet light + Subtle Cyan/Blue specular accent */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#8B5CF6" />
      <pointLight position={[-5, -5, -3]} intensity={1.8} color="#06B6D4" />

      {/* Procedural Metallic Torus Ring */}
      <mesh ref={meshRef}>
        <torusGeometry args={[1.8, 0.12, 32, 100]} />
        <meshStandardMaterial
          color="#8B5CF6"
          roughness={0.25}
          metalness={0.85}
          emissive="#4C1D95"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Secondary Thin Inner Wireframe Ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 16, 64]} />
        <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Floating Particle Field */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.035}
          color="#C4B5FD"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </>
  )
}
