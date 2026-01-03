// // import { Canvas } from '@react-three/fiber'
// // import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
// // import { Suspense } from 'react'
// // import Loader from './Loader'
// //
// // function Avatar({ scale = 1 }) {
// //   const { scene } = useGLTF('/models/avatar.glb')
// //
// //   return (
// //     <primitive
// //       object={scene}
// //       scale={scale}
// //       position={[0, -1.2, 0]}
// //       castShadow
// //       receiveShadow
// //     />
// //   )
// // }
// //
// // export default function AvatarViewer({ avatarScale = 1 }) {
// //   return (
// //     <div style={{ flex: 1 }}>
// //       <Canvas
// //         shadows
// //         camera={{ position: [0, 1.6, 3.2], fov: 45 }}
// //       >
// //         <Suspense fallback={<Loader />}>
// //           {/* Lighting */}
// //           <ambientLight intensity={0.6} />
// //           <directionalLight
// //             position={[5, 8, 5]}
// //             intensity={1.2}
// //             castShadow
// //             shadow-mapSize-width={1024}
// //             shadow-mapSize-height={1024}
// //           />
// //
// //           {/* Environment for realism */}
// //           <Environment preset="studio" />
// //
// //           {/* Ground shadow */}
// //           <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
// //             <planeGeometry args={[10, 10]} />
// //             <shadowMaterial opacity={0.2} />
// //           </mesh>
// //
// //           {/* Avatar */}
// //           <Avatar scale={avatarScale} />
// //
// //           {/* Controls */}
// //           <OrbitControls
// //             enablePan={false}
// //             minDistance={2}
// //             maxDistance={5}
// //             target={[0, 0.8, 0]}
// //           />
// //         </Suspense>
// //       </Canvas>
// //     </div>
// //   )
// // }
// //
//
//
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { Suspense } from "react";
// import Loader from "./Loader";
//
// // function Avatar({ measurements }) {
// //   const { scene } = useGLTF("/models/avatar2.glb");
// //
// //   // Convert cm to scale ratios
// //   const heightScale = measurements.height / 170;
// //   const widthScale =
// //     (measurements.chest + measurements.hips) / (90 + 95);
// //
// //   // Apply scaling
// //   scene.scale.set(
// //     widthScale,    // X → width
// //     heightScale,   // Y → height
// //     widthScale     // Z → depth
// //   );
// //
// //   return (
// //     <primitive
// //       object={scene}
// //       position={[0, -1.2, 0]}
// //       castShadow
// //       receiveShadow
// //     />
// //   );
// // }
//
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { Suspense } from "react";
// import Loader from "./Loader";
//
// function Avatar({ scale }) {
//   const { scene } = useGLTF("/models/female.glb");
//
//   return (
//     <primitive
//       object={scene}
//       scale={scale}              // ✅ React-controlled scaling
//       position={[0, -1.2, 0]}
//       castShadow
//       receiveShadow
//     />
//   );
// }
//
// export default function AvatarViewer({ measurements }) {
//
//   // Convert measurements → scale
//   const heightScale = measurements.height / 170;
//
//   const widthScale =
//     (measurements.chest + measurements.hips) / (90 + 95);
//
//   // Three.js scale vector [x, y, z]
//   const avatarScale = [
//     widthScale,   // width
//     heightScale,  // height
//     widthScale    // depth
//   ];
//
//   return (
//     <div style={{ flex: 1 }}>
//       <Canvas
//         shadows
//         camera={{ position: [0, 1.6, 3.2], fov: 45 }}
//       >
//         <Suspense fallback={<Loader />}>
//
//           {/* Lighting */}
//           <ambientLight intensity={1.2} />
//           <directionalLight position={[5, 8, 5]} intensity={1.5} />
//
//           {/* Environment */}
//           <Environment preset="studio" />
//
//           {/* Ground */}
//           <mesh
//             rotation={[-Math.PI / 2, 0, 0]}
//             position={[0, -1.2, 0]}
//             receiveShadow
//           >
//             <planeGeometry args={[10, 10]} />
//             <shadowMaterial opacity={0.2} />
//           </mesh>
//
//           {/* Avatar */}
//           <Avatar scale={avatarScale} />
//
//           {/* Camera controls */}
//           <OrbitControls
//             enablePan={false}
//             minDistance={2}
//             maxDistance={5}
//             target={[0, 0.8, 0]}
//           />
//
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }


import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Avatar({ gender, measurements }) {
  const { scene } = useGLTF(`/models/${gender}.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetInfluences) {
        const dict = child.morphTargetDictionary;

        // Convert cm → 0..1
        const height = (measurements.height - 163) / (140 - 90);

        const chest = (measurements.chest - 90) / (140 - 90);
        const waist = (measurements.waist - 75) / (140 - 75);
        const hips  = (measurements.hips  - 95) / (140 - 95);

        if (dict["Height_Max"] !== undefined)
          child.morphTargetInfluences[dict["Height_Max"]] = height;

        if (dict["Chest_Max"] !== undefined)
          child.morphTargetInfluences[dict["Chest_Max"]] = chgit est;
        if (dict["Waist_Max"] !== undefined)
          child.morphTargetInfluences[dict["Waist_Max"]] = waist;

        if (dict["Hips_Max"] !== undefined)
          child.morphTargetInfluences[dict["Hips_Max"]] = hips;
      }
    });
  }, [scene, measurements]);

  return <primitive object={scene} rotation={[0, Math.PI, 0]} />;
}
