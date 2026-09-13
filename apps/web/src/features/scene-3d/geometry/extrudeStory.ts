import type { Story } from "@floorplan3d/shared-schema";
import { midpoint, wallAngle, wallLengthPixels } from "../../../lib/geometry-utils";

/**
 * Phase 1 has no calibration (`scaleConfidence` is always `'none'`), so
 * there is no real pixels-per-meter to extrude with. This constant exists
 * only to give traced walls a plausible on-screen proportion relative to
 * `heightMeters` — it is a display convenience, not a measurement, and must
 * never be surfaced as a real unit conversion once calibration (Phase 2)
 * exists.
 */
const PHASE1_DISPLAY_UNITS_PER_PIXEL = 1 / 100;

export interface WallMesh {
  id: string;
  /** [x, y, z] center of the wall box, y is up. */
  position: [number, number, number];
  /** Rotation around the vertical (y) axis, in radians. */
  rotationY: number;
  /** [length, height, thickness]. */
  size: [number, number, number];
}

export function extrudeStory(story: Story): WallMesh[] {
  return story.walls.map((wall) => {
    const lengthUnits = wallLengthPixels(wall) * PHASE1_DISPLAY_UNITS_PER_PIXEL;
    const center = midpoint(wall.start, wall.end);
    const angle = wallAngle(wall);

    return {
      id: wall.id,
      // Canvas (x, y) maps to the 3D ground plane (x, z); height runs along y.
      position: [
        center.x * PHASE1_DISPLAY_UNITS_PER_PIXEL,
        story.heightMeters / 2,
        center.y * PHASE1_DISPLAY_UNITS_PER_PIXEL,
      ],
      rotationY: -angle,
      size: [lengthUnits, story.heightMeters, wall.thicknessMeters],
    };
  });
}
