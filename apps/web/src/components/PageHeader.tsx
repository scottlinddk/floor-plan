import type { ReactNode } from "react";
import type { ScaleConfidence } from "@floorplan3d/shared-schema";
import { confidenceLabel } from "../lib/measurement";

interface PageHeaderProps {
  title: string;
  scaleConfidence?: ScaleConfidence;
  children?: ReactNode;
}

export function PageHeader({ title, scaleConfidence, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <div className="toolbar">
        {scaleConfidence && (
          <span className="confidence-badge" data-confidence={scaleConfidence}>
            {confidenceLabel(scaleConfidence)}
          </span>
        )}
        {children}
      </div>
    </header>
  );
}
