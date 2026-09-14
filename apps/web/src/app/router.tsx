import { createBrowserRouter } from "react-router-dom";
import { UploadPage } from "../features/upload/UploadPage";
import { PlanEditorPage } from "../features/plan-editor/PlanEditorPage";
import { Scene3DPage } from "../features/scene-3d/Scene3DPage";

export const router = createBrowserRouter([
  { path: "/", element: <UploadPage /> },
  { path: "/editor", element: <PlanEditorPage /> },
  { path: "/view", element: <Scene3DPage /> },
]);
