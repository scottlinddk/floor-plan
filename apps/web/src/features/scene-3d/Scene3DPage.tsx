import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { useStory } from "../../app/store";
import { StoryScene } from "./components/StoryScene";

export function Scene3DPage() {
  const navigate = useNavigate();
  const story = useStory();

  if (!story || story.walls.length === 0) {
    return (
      <div className="page">
        <PageHeader title="3D view" />
        <div className="page-body">
          <p>Trace at least one wall before viewing the 3D model.</p>
          <button className="primary" onClick={() => navigate(story ? "/editor" : "/")}>
            {story ? "Back to editor" : "Upload an image"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="3D view" scaleConfidence={story.scaleConfidence}>
        <button onClick={() => navigate("/editor")}>Back to editor</button>
      </PageHeader>
      <div className="page-body">
        <StoryScene story={story} />
      </div>
    </div>
  );
}
