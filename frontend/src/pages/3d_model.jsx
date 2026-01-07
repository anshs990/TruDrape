import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Line, Text } from "@react-three/drei";
import { useNavigate, Link } from 'react-router-dom';
import Avatar from "../components/AvatarViewer"; // Check your path
import Loader from "../components/Loader"; // Check your path
import { Navigate } from "react-router-dom";

const ModelViewer = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("female");
  const [measurements, setMeasurements] = useState({
    height: 170,
    chest: 90,
    waist: 75,
    hips: 95,
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = (name, value) => {
    setMeasurements((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.user_id) {
        alert("User not logged in!");
        setLoading(false);
        return;
      }

      // Prepare payload matching backend schema
      const payload = {
        user_id: user.user_id,
        gender: gender,
        height: measurements.height,
        chest: measurements.chest,
        waist: measurements.waist,
        hip: measurements.hips, // Note backend uses singular 'hip'
        image_url: null, // If you have an image url, add it here
      };

      const response = await fetch("http://localhost:8000/api/save_measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "success") {
        navigate('/'); // You can replace with nicer UI feedback
      } else {
        alert("Failed to save measurements.");
      }
    } catch (error) {
      alert("Error saving measurements: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Measurement line logic
  const heightScale = measurements.height / 170;
  const topY = heightScale * 1.0;
  const bottomY = -heightScale * 1.0;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 70px)", background: "#050505" }}>
      {/* LEFT PANEL: SLIDERS */}
      <div style={sidebarStyle}>
        <h2 style={{ color: "#4CAF50", letterSpacing: "2px", fontSize: "1.5rem" }}>MEASUREMENTS</h2>
        <p style={{ color: "#666", fontSize: "11px", marginBottom: "20px" }}>AI-DRIVEN FITTING SYSTEM</p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          <button onClick={() => setGender("male")} style={genderBtn(gender === "male")}>MALE</button>
          <button onClick={() => setGender("female")} style={genderBtn(gender === "female")}>FEMALE</button>
        </div>

        {["height", "chest", "waist", "hips"].map((m) => (
          <div key={m} style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#bbb" }}>
              {m.toUpperCase()} <strong>{measurements[m]} cm</strong>
            </label>
            <input
              type="range"
              min={m === "height" ? 140 : 60}
              max={m === "height" ? 220 : 140}
              value={measurements[m]}
              onChange={(e) => handleUpdate(m, e.target.value)}
              style={{ width: "100%", accentColor: "#4CAF50" }}
            />
          </div>
        ))}

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{ ...genderBtn(true), marginTop: "20px", width: "100%" }}
          disabled={loading}
        >
          {loading ? "Saving..." : "SAVE MEASUREMENTS"}
        </button>
      </div>

      {/* RIGHT PANEL: 3D VIEW */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
          <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={0.5} center>
              <Avatar gender={gender} measurements={measurements} />
              <Line points={[[0.8, bottomY, 0], [0.8, topY, 0]]} color="#4CAF50" />
              <Line points={[[0.75, topY, 0], [0.85, topY, 0]]} color="#4CAF50" />
              <Line points={[[0.75, bottomY, 0], [0.85, bottomY, 0]]} color="#4CAF50" />
              <Text position={[0.95, topY, 0]} fontSize={0.12} color="#4CAF50">
                {measurements.height}cm
              </Text>
            </Stage>
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
};

// --- STYLES ---
const sidebarStyle = {
  width: "340px",
  padding: "30px",
  background: "#111",
  borderRight: "1px solid #222",
  overflowY: "auto",
};

const genderBtn = (active) => ({
  flex: 1,
  padding: "10px",
  background: active ? "#4CAF50" : "#222",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
});

export default ModelViewer;
