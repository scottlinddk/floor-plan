import { type ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { startNewStory } from "../../app/store";

export function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    startNewStory(objectUrl);
    navigate("/editor");
  }

  return (
    <div className="page">
      <PageHeader title="FloorPlan3D" />
      <div className="page-body">
        <p>Upload a 2D floor plan image to start tracing it.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
