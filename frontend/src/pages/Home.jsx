// import AvatarViewer from '../components/AvatarViewer'
// import Controls from '../components/Controls'
//
// export default function Home() {
//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <AvatarViewer />
//       <Controls />
//     </div>
//   )
// }
//


import { useState } from "react";
import AvatarViewer from "../components/AvatarViewer";
import Controls from "../components/Controls";

export default function Home() {

  // 1️⃣ This is shared data (STATE)
  const [measurements, setMeasurements] = useState({
    height: 170,
    chest: 90,
    waist: 75,
    hips: 95,
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 2️⃣ Avatar reads measurements */}
      <AvatarViewer measurements={measurements} />

      {/* 3️⃣ Controls updates measurements */}
      <Controls
        measurements={measurements}
        setMeasurements={setMeasurements}
      />
    </div>
  );
}
