import { Html } from "@react-three/drei";

export default function Loader() {
  return (
    <Html center>
      <div
        style={{
          color: "#8aff8a",
          fontSize: "14px",
          fontWeight: "500",
          background: "rgba(0,0,0,0.6)",
          padding: "10px 16px",
          borderRadius: "8px",
        }}
      >
        Generating avatar…
      </div>
    </Html>
  );
}
