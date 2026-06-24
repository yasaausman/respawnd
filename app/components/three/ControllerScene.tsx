'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Controller() {
  const { scene } = useGLTF('/models/controller.glb')
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5
  })

  return <primitive ref={ref} object={scene} scale={1} position={[0, -2, 0]} />
}

export default function ControllerScene() {
  return (
    <Canvas
    camera={{ position: [0, 2, 18], fov: 30 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={3} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <Suspense fallback={null}>
        <Controller />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  )
}