import type { Point2D, Wall } from "@floorplan3d/shared-schema";

export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Point2D, b: Point2D): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Angle of the wall in radians, measured from the positive x-axis. */
export function wallAngle(wall: Wall): number {
  return Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
}

export function wallLengthPixels(wall: Wall): number {
  return distance(wall.start, wall.end);
}
