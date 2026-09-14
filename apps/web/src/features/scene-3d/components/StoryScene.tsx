import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import type { Story } from "@floorplan3d/shared-schema";
import { Walls } from "./Walls";

export function StoryScene({ story }: { story: Story }) {
  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 50 }} style={{ width: "100%", height: "70vh" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 12, 8]} intensity={1} />
      <Grid args={[40, 40]} cellColor="#ddd" sectionColor="#bbb" position={[0, 0, 0]} />
      <Walls story={story} />
      <OrbitControls makeDefault />
    </Canvas>
  );
}
