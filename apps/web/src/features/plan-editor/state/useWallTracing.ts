import { useState } from "react";
import type { Point2D } from "@floorplan3d/shared-schema";
import { addWall, removeLastWall } from "../../../app/store";

/** Default wall thickness used for manually traced walls (Phase 1 has no calibration to derive this from). */
const DEFAULT_WALL_THICKNESS_METERS = 0.15;

/**
 * Click-to-place wall tracing: each click after the first draws a wall
 * segment from the previous click to the new one, so tracing a room is a
 * sequence of clicks around its perimeter. "Close shape" connects the last
 * point back to the first to finish the loop.
 */
export function useWallTracing() {
  const [firstPoint, setFirstPoint] = useState<Point2D | null>(null);
  const [lastPoint, setLastPoint] = useState<Point2D | null>(null);

  function placePoint(point: Point2D) {
    if (!lastPoint) {
      setFirstPoint(point);
      setLastPoint(point);
      return;
    }

    addWall({
      id: crypto.randomUUID(),
      start: lastPoint,
      end: point,
      thicknessMeters: DEFAULT_WALL_THICKNESS_METERS,
    });
    setLastPoint(point);
  }

  function closeShape() {
    if (!firstPoint || !lastPoint) return;
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) return;

    addWall({
      id: crypto.randomUUID(),
      start: lastPoint,
      end: firstPoint,
      thicknessMeters: DEFAULT_WALL_THICKNESS_METERS,
    });
    setFirstPoint(null);
    setLastPoint(null);
  }

  function undoLastSegment() {
    removeLastWall();
    setFirstPoint(null);
    setLastPoint(null);
  }

  return {
    pendingPoint: lastPoint,
    canClose: firstPoint !== null && lastPoint !== null && firstPoint !== lastPoint,
    placePoint,
    closeShape,
    undoLastSegment,
  };
}
