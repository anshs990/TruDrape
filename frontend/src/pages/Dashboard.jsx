import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Gltf } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

// Dummy Data for Clothes
const CLOTHES_DATA = [
  { id: 1, name: 'LINEN POLO SHIRT', category: 'Men', price: '$18.39', model: '/models/shirt_male.glb', image: 'https://static.zara.net/assets/public/c55e/6a2c/296b40599ef5/f378e4139a98/00794185052-e1/00794185052-e1.jpg?ts=1753359858827&w=1280' },
  { id: 2, name: 'Summer Dress', category: 'Women', price: '$60', model: '/models/dress_female.glb', image: 'https://image.hm.com/assets/hm/14/79/1479c15a622bce64190a65b07d3f96d28a191163.jpg?imwidth=1536' },
  { id: 3, name: 'BUTTON MIDI DRESS', category: 'Women', price: '$14.99', model: '/models/dress_female.glb', image: 'https://static.zara.net/assets/public/1597/11bb/e47f4b6cbf77/74ec9dc58a3a/03644188719-e1/03644188719-e1.jpg?ts=1757427266775&w=1280' },
  { id: 4, name: 'Denim Jacket', category: 'Men', price: '$41.99', model: '/models/jacket.glb', image: 'https://static.zara.net/assets/public/80b4/ef69/2e984ef2b04d/908fb9ca321e/03409373426-e1/03409373426-e1.jpg?ts=1756107387255&w=1280' },
  { id: 5, name: 'Floral Skirt', category: 'Women', price: '$17.99', model: '/models/skirt.glb', image: 'https://static.zara.net/assets/public/fc6e/ba2c/ba8b453a91fb/4a65919cc1e8/08697441307-e1/08697441307-e1.jpg?ts=1757084869494&w=1280' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDress, setSelectedDress] = useState(null);
  // const [measurements, setMeasurements] = useState({ height: 170, waist: 75, chest: 90 });
  const [user, setUser] = useState(null);
  const [measurements, setMeasurements] = useState(null);

  // 1. Check Login Status on Load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchMeasurements = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/check_measurements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id  : user.user_id }),
        });
        const data = await response.json();
        console.log("Measurements from API:", data);
        if (data.measurement_exists) {
          const mapped = { ...data.data, hips: data.data.hip }; // map DB column if needed
          setMeasurements(mapped); // ✅ replace default state with DB values
        }
      } catch (e) {
        console.error("Error fetching measurements:", e);
      }
    };

    fetchMeasurements();
  }, [user]);

  // console.log(data.height);
  

  if (!measurements) {
    return <div style={{ color: "white", padding: 20 }}>Loading measurements...</div>;
  }

  // Calculate scales (baseline values should match your default model sizes)
  const heightScale = measurements.height / 170;
  const chestScale = measurements.chest / 90;
  const waistScale = measurements.waist / 75;
  const hipsScale = measurements.hips / 95;


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
      <div style={{ height: "100%", width: '40%', background: "#111", color: "white" }}>
        {user?.user_id ? (
          <Canvas camera={{ position: [0, 1.5, 4] }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.5}>
                {measurements.gender === "male" ? (
                  <Gltf
                    src="/models/male.glb"
                    scale={[chestScale, heightScale, hipsScale]} // Example non-uniform scaling
                  />
                ) : (
                  <Gltf
                    src="/models/female.glb"
                    scale={[chestScale, heightScale, hipsScale]}
                  />
                )}
                {selectedDress && <Gltf src={selectedDress.model} />}
              </Stage>
            </Suspense>
            <OrbitControls
              makeDefault
              enableZoom={false}
              target={[0, 1.5, 0]}   // 👈 look at chest/head level
            />
          </Canvas>
        ) : (
          <div style={{ padding: 20 }}>
            <h2>TRUDRAPE STUDIO</h2>
            <p>Log in to visualize these garments on your 3D body profile.</p>
            <button onClick={() => navigate("/login")} style={{ background: "#4CAF50", color: "white", padding: "12px 30px", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold" }}>
              LOGIN
            </button>
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