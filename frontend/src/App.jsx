// import Home from './pages/Home'

// function App() {
//   return <Home />
// }

// export default App

import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, Gltf, Text, Line } from '@react-three/drei'
import * as THREE from 'three'

function App() {
  // 1. Gender and Measurements State
  const [gender, setGender] = useState('female');
  const [measurements, setMeasurements] = useState({
    height: 170,
    chest: 90,
    waist: 75,
    hips: 95,
  });
  const [loading, setLoading] = useState(false);

  // 2. Function to Send Data to your FastAPI (main.py)
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, ...measurements }),
      });
      const data = await response.json();
      alert("Backend Response: " + data.message);
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend is offline. Run 'python main.py' in the backend folder.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (name, value) => {
    setMeasurements(prev => ({ ...prev, [name]: Number(value) }));
  };

  // 3. Scaling Logic
  const heightScale = measurements.height / 170;
  // Simulating width change based on average tailoring measurements
  const widthScale = (measurements.chest + measurements.waist + measurements.hips) / (86 * 3);

  // 4. Wireframe Effect (to match your reference images)
  const applyWireframe = (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          wireframe: true,
          color: gender === 'female' ? '#ff4081' : '#2196f3', // Pink for Female, Blue for Male
          transparent: true,
          opacity: 0.5,
        });
      }
    });
  };

  // Measurement Line positions
  const headTopY = heightScale * 1.0; 
  const floorY = -heightScale * 1.0;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#050505', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '350px', padding: '30px', background: '#111', borderRight: '1px solid #222', zIndex: 10 }}>
        <h2 style={{ color: '#4CAF50', letterSpacing: '2px' }}>TRUDRAPE</h2>
        <p style={{ color: '#666', fontSize: '11px' }}>AI-DRIVEN MEASUREMENT SYSTEM</p>
        <hr style={{ borderColor: '#222', margin: '20px 0' }} />
        
        {/* Gender Toggle */}
        <div style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setGender('male')} style={{ flex: 1, padding: '10px', background: gender === 'male' ? '#4CAF50' : '#222', color: 'white', border: 'none', cursor: 'pointer' }}>MALE</button>
          <button onClick={() => setGender('female')} style={{ flex: 1, padding: '10px', background: gender === 'female' ? '#4CAF50' : '#222', color: 'white', border: 'none', cursor: 'pointer' }}>FEMALE</button>
        </div>

        {/* Sliders */}
        {['height', 'chest', 'waist', 'hips'].map((m) => (
          <div key={m} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', fontSize: '12px' }}>
              {m} <strong>{measurements[m]} cm</strong>
            </label>
            <input type="range" min={m === 'height' ? 140 : 60} max={m === 'height' ? 220 : 140} 
              value={measurements[m]} onChange={(e) => handleUpdate(m, e.target.value)}
              style={{ width: '100%', accentColor: '#4CAF50' }} />
          </div>
        ))}

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{ marginTop: '20px', width: '100%', padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "SAVING..." : "SAVE TO CLOUD"}
        </button>
      </div>

      {/* 3D VIEWPORT */}
      <div style={{ flex: 1, background: '#000' }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} center>
              
              <Gltf 
                key={gender} // Forces reload when gender changes
                src={`/models/${gender}.glb`} 
                onLoad={applyWireframe} 
                rotation={[0, Math.PI, 0]} 
                scale={[widthScale, heightScale, widthScale]} 
              />

              {/* MEASUREMENT UI */}
              <Line points={[[0.8, floorY, 0], [0.8, headTopY, 0]]} color="#4CAF50" lineWidth={1} />
              <Line points={[[0.75, headTopY, 0], [0.85, headTopY, 0]]} color="#4CAF50" lineWidth={2} />
              <Text position={[0.9, headTopY, 0]} fontSize={0.12} color="#4CAF50" anchorX="left" fontWeight="bold">
                {measurements.height}cm
              </Text>
              <Line points={[[0.75, floorY, 0], [0.85, floorY, 0]]} color="#4CAF50" lineWidth={2} />

            </Stage>
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  )
}

export default App