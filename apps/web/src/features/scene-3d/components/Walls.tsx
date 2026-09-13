import type { Story } from "@floorplan3d/shared-schema";
import { extrudeStory } from "../geometry/extrudeStory";
import { wallMaterialProps } from "../materials/wallMaterial";

export function Walls({ story }: { story: Story }) {
  const walls = extrudeStory(story);

  return (
    <>
      {walls.map((wall) => (
        <mesh key={wall.id} position={wall.position} rotation={[0, wall.rotationY, 0]}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial {...wallMaterialProps} />
        </mesh>
      ))}
    </>
  );
}
