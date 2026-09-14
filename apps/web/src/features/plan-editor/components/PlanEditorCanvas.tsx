import { useMemo } from "react";
import type Konva from "konva";
import { Circle, Image as KonvaImage, Layer, Line, Stage } from "react-konva";
import type { Wall } from "@floorplan3d/shared-schema";
import { useHtmlImage } from "../hooks/useHtmlImage";

const MAX_CANVAS_WIDTH = 900;
const MAX_CANVAS_HEIGHT = 650;

interface PlanEditorCanvasProps {
  sourceImageUrl: string;
  walls: Wall[];
  pendingPoint: { x: number; y: number } | null;
  onStageClick: (point: { x: number; y: number }) => void;
}

export function PlanEditorCanvas({
  sourceImageUrl,
  walls,
  pendingPoint,
  onStageClick,
}: PlanEditorCanvasProps) {
  const image = useHtmlImage(sourceImageUrl);

  const size = useMemo(() => {
    if (!image) return { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    const scale = Math.min(MAX_CANVAS_WIDTH / image.width, MAX_CANVAS_HEIGHT / image.height, 1);
    return { width: image.width * scale, height: image.height * scale };
  }, [image]);

  function handleClick(event: Konva.KonvaEventObject<MouseEvent>) {
    const stage = event.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) onStageClick(point);
  }

  return (
    <Stage
      width={size.width}
      height={size.height}
      onClick={handleClick}
      style={{ border: "1px solid #ccc", background: "#fff" }}
    >
      <Layer>
        {image && <KonvaImage image={image} width={size.width} height={size.height} />}
      </Layer>
      <Layer>
        {walls.map((wall) => (
          <Line
            key={wall.id}
            points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
            stroke="#1a1a1a"
            strokeWidth={4}
            lineCap="round"
          />
        ))}
        {pendingPoint && <Circle x={pendingPoint.x} y={pendingPoint.y} radius={5} fill="#e6482e" />}
      </Layer>
    </Stage>
  );
}
