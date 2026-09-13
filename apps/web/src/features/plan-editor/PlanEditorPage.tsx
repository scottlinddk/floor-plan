import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { useStory } from "../../app/store";
import { PlanEditorCanvas } from "./components/PlanEditorCanvas";
import { useWallTracing } from "./state/useWallTracing";

export function PlanEditorPage() {
  const navigate = useNavigate();
  const story = useStory();
  const { pendingPoint, canClose, placePoint, closeShape, undoLastSegment } = useWallTracing();

  if (!story) {
    return (
      <div className="page">
        <PageHeader title="Plan editor" />
        <div className="page-body">
          <p>No floor plan loaded yet.</p>
          <button className="primary" onClick={() => navigate("/")}>
            Upload an image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Trace walls" scaleConfidence={story.scaleConfidence}>
        <button onClick={undoLastSegment} disabled={story.walls.length === 0 && !pendingPoint}>
          Undo
        </button>
        <button onClick={closeShape} disabled={!canClose}>
          Close shape
        </button>
        <button
          className="primary"
          onClick={() => navigate("/view")}
          disabled={story.walls.length === 0}
        >
          View in 3D
        </button>
      </PageHeader>
      <div className="page-body">
        <p>Click around the room outline to place walls. Click "Close shape" to finish the loop.</p>
        <PlanEditorCanvas
          sourceImageUrl={story.sourceImageUrl}
          walls={story.walls}
          pendingPoint={pendingPoint}
          onStageClick={placePoint}
        />
      </div>
    </div>
  );
}
