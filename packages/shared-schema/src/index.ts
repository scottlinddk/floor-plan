export type ScaleConfidence = "calibrated" | "estimated" | "none";

export interface Point2D {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point2D;
  end: Point2D;
  thicknessMeters: number;
}

export interface Opening {
  id: string;
  wallId: string;
  type: "door" | "window";
  /** Fraction along the wall, 0-1. */
  positionOnWall: number;
  widthMeters: number;
  /** Windows only. */
  sillHeightMeters?: number;
}

export interface Room {
  id: string;
  name?: string;
  polygon: Point2D[];
  floorMaterialId?: string;
}

export interface AlignmentOffset {
  x: number;
  y: number;
  rotationDegrees: number;
}

export interface Story {
  id: string;
  /** 0 = ground, 1 = first floor, -1 = basement. */
  level: number;
  heightMeters: number;
  sourceImageUrl: string;
  scaleConfidence: ScaleConfidence;
  /** Meaningful only if scaleConfidence !== 'none'. */
  pixelsPerMeter?: number;
  /** Relative to the story below. */
  alignmentOffset: AlignmentOffset;
  walls: Wall[];
  rooms: Room[];
  openings: Opening[];
}

export interface Building {
  id: string;
  name: string;
  /** Ordered bottom to top by `level`. */
  stories: Story[];
  createdAt: string;
  updatedAt: string;
}

/** Default height used for a story before calibration exists (Phase 1/2). */
export const DEFAULT_STORY_HEIGHT_METERS = 2.5;

export function createEmptyStory(sourceImageUrl: string): Story {
  return {
    id: crypto.randomUUID(),
    level: 0,
    heightMeters: DEFAULT_STORY_HEIGHT_METERS,
    sourceImageUrl,
    scaleConfidence: "none",
    alignmentOffset: { x: 0, y: 0, rotationDegrees: 0 },
    walls: [],
    rooms: [],
    openings: [],
  };
}
