import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Gltf } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

// Dummy Data for Clothes
const CLOTHES_DATA = [
  { id: 1, name: 'Slim Fit Shirt', category: 'Men', price: '$45', model: '/models/shirt_male.glb', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200' },
  // { id: 2, name: 'Summer Dress', category: 'Women', price: '$60', model: '/models/dress_female.glb', image: 'https://images.unsplash.com/photo-1572804013307-59c8575a6d81?w=200' },
  { id: 3, name: 'Denim Jacket', category: 'Men', price: '$85', model: '/models/jacket.glb', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200' },
  { id: 4, name: 'Floral Skirt', category: 'Women', price: '$35', model: '/models/skirt.glb', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDress, setSelectedDress] = useState(null);
  const [measurements, setMeasurements] = useState({ height: 170, waist: 75, chest: 90 });

  // 1. Check Login Status on Load
  useEffect(() => {
    const user = localStorage.getItem('userToken'); // Your login logic should set this
    if (user) setIsLoggedIn(true);
  }, []);

  const filteredClothes = selectedCategory === 'All' 
    ? CLOTHES_DATA 
    : CLOTHES_DATA.filter(item => item.category === selectedCategory);

  return (
    <div style={dashboardContainer}>
      
      {/* LEFT SIDE: PRODUCT CATALOG */}
      <div style={catalogSection}>
        <div style={headerStyle}>
          <h2>Collections</h2>
          <div style={categoryBar}>
            {['All', 'Men', 'Women'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                style={{...catBtn, background: selectedCategory === cat ? '#4CAF50' : '#222'}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={productGrid}>
          {filteredClothes.map(item => (
            <div key={item.id} style={productCard}>
              <img src={item.image} alt={item.name} style={productImg} />
              <div style={{padding: '10px'}}>
                <h4 style={{margin: '0'}}>{item.name}</h4>
                <p style={{color: '#4CAF50', fontWeight: 'bold'}}>{item.price}</p>
                <button 
                  onClick={() => setSelectedDress(item)}
                  style={tryOnBtn}
                >
                  Try On 3D
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: 3D FITTING ROOM (Protected) */}
      <div style={fittingRoomSection}>
        {!isLoggedIn ? (
          <div style={overlayBlur}>
            <h3>Login Required</h3>
            <p>Please log in to access the 3D Virtual Fitting Room and view your custom measurements.</p>
            <button onClick={() => navigate('/login')} style={loginPromptBtn}>Login Now</button>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={measurementHeader}>
              <span>Height: {measurements.height}cm</span>
              <span>Waist: {measurements.waist}cm</span>
            </div>
            
            <div style={{ flex: 1, background: '#000' }}>
              <Canvas camera={{ position: [0, 1.5, 4] }}>
                <Suspense fallback={null}>
                  <Stage environment="city" intensity={0.5} center>
                    {/* The 3D Human Model */}
                    <Gltf src="/models/female.glb" scale={[1, measurements.height/170, 1]} />
                    
                    {/* The Selected Dress (Imprinted on top) */}
                    {selectedDress && (
                       <Gltf src={selectedDress.model} scale={[1.02, measurements.height/170, 1.02]} />
                    )}
                  </Stage>
                </Suspense>
                <OrbitControls makeDefault />
              </Canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const dashboardContainer = { display: 'flex', height: 'calc(100vh - 70px)', background: '#050505', color: 'white' };
const catalogSection = { flex: 2, padding: '30px', overflowY: 'auto' };
const fittingRoomSection = { flex: 1.2, background: '#111', borderLeft: '1px solid #222', position: 'relative' };

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const categoryBar = { display: 'flex', gap: '10px' };
const catBtn = { padding: '8px 20px', border: 'none', color: 'white', borderRadius: '20px', cursor: 'pointer', transition: '0.3s' };

const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const productCard = { background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' };
const productImg = { width: '100%', height: '200px', objectFit: 'cover' };
const tryOnBtn = { width: '100%', padding: '10px', background: '#4CAF50', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

const measurementHeader = { padding: '15px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-around', fontSize: '12px', borderBottom: '1px solid #333' };

const overlayBlur = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px', zIndex: 5 };
const loginPromptBtn = { marginTop: '20px', padding: '12px 30px', background: '#4CAF50', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Dashboard;