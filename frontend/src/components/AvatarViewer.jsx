import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Loader from './Loader'

function Avatar({ scale = 1 }) {
  const { scene } = useGLTF('/models/avatar.glb')

  return (
    <primitive
      object={scene}
      scale={scale}
      position={[0, -1.2, 0]}
      castShadow
      receiveShadow
    />
  )
}

export default function AvatarViewer({ avatarScale = 1 }) {
  return (
    <div style={{ flex: 1 }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 3.2], fov: 45 }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Environment for realism */}
          <Environment preset="studio" />

          {/* Ground shadow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.2} />
          </mesh>

          {/* Avatar */}
          <Avatar scale={avatarScale} />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={5}
            target={[0, 0.8, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

