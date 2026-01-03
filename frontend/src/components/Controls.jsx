// export default function Controls() {
//   return (
//     <div style={{ width: 320, padding: 20 }}>
//       <h3>Measurements</h3>
//       <p>Controls coming next</p>
//     </div>
//   )
// }
//


export default function Controls({ measurements, setMeasurements }) {

  // Helper function to update one value
  const updateValue = (key, value) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div style={{ width: 320, padding: 20 }}>
      <h3>Measurements</h3>

      <label>Height: {measurements.height} cm</label>
      <input
        type="range"
        min="150"
        max="200"
        value={measurements.height}
        onChange={(e) => updateValue("height", Number(e.target.value))}
      />

      <label>Chest: {measurements.chest} cm</label>
      <input
        type="range"
        min="70"
        max="120"
        value={measurements.chest}
        onChange={(e) => updateValue("chest", Number(e.target.value))}
      />

      <label>Waist: {measurements.waist} cm</label>
      <input
        type="range"
        min="60"
        max="110"
        value={measurements.waist}
        onChange={(e) => updateValue("waist", Number(e.target.value))}
      />

      <label>Hips: {measurements.hips} cm</label>
      <input
        type="range"
        min="80"
        max="130"
        value={measurements.hips}
        onChange={(e) => updateValue("hips", Number(e.target.value))}
      />
    </div>
  );
}
