# FloorPlan3D

React app that turns an uploaded 2D floor plan into a walkable 3D model. See
`PROJECT_PLAN.md` for the full brief, phased roadmap, and the decisions made
along the way.

## Status

Phase 1 (single-story manual trace skeleton) is implemented: upload an
image, trace its walls in a 2D canvas, view the result as a basic 3D box
scene. No provider integration, calibration, or persistence yet — those are
Phase 2+.

## Structure

- `apps/web` — the React app (Vite, React Router v7, react-konva, react-three-fiber).
- `apps/bff` — placeholder for the Phase 3 backend-for-frontend.
- `packages/shared-schema` — the `Building`/`Story`/`Wall`/`Room`/`Opening` types shared by both apps.

## Development

```sh
pnpm install
pnpm --filter @floorplan3d/web dev
```
