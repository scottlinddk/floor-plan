# FloorPlan3D — Refined Project Plan

Source: original project brief (see PR description / issue). This document is
a critical pass over that brief: it keeps everything that's already sound,
tightens the parts that were underspecified, and calls out the decisions that
need a human answer before Phase 1 scaffolding starts. No application code is
included here, per the "never write code first" rule for a greenfield project
— this is the file-tree-and-decisions step.

## Verdict on the brief

The brief is well-structured and the phasing is correct: manual trace before
provider integration, calibration before multi-story, and the "never trust
estimated data silently" principle is the right hard requirement to anchor
the whole app on. Two things are worth pushing back on before building
starts:

1. **"Third-party digitization API" is a placeholder, not a decision.**
   Phase 3 can't be scoped (cost instrumentation, response shape, auth,
   rate limits) without knowing which vendor (e.g. CubiCasa5K/CubiCasa API,
   Archilogic, an in-house model, or something else). This is explicitly
   fine to defer — Phase 1–2 don't need it — but it shouldn't stay a
   placeholder past the start of Phase 3 planning. Flagging per the brief's
   own instruction, not guessing a vendor.
2. **The canvas library choice is asked for explicitly ("flag the
   tradeoff") — here's that tradeoff, not a silent pick.** See below.

## Canvas library tradeoff (Phase 1 blocker)

Requirement: a draggable vector overlay (wall endpoints, room polygons,
opening markers) on top of a raster image, in a React + TypeScript app,
that needs precise 2D vertex editing (drag a point, snap, insert/remove a
wall segment) more than rich object-manipulation (multi-select, layers
panel, undo stack UI).

| Option | Fit | Tradeoff |
|---|---|---|
| **react-konva** (Konva.js + React bindings) | Good | Idiomatic React (`<Stage>`/`<Layer>`/`<Line>`/`<Circle>` as declarative components), first-class drag events per shape, `Transformer` node for resize/rotate, good performance with hundreds of shapes, active maintenance, decent TS types. Downside: you build wall/vertex/snapping logic yourself — it's a rendering + hit-testing primitive, not a floor-plan editor. |
| **Fabric.js** | Weaker fit | Batteries-included object model (selection, grouping, serialization) but it owns the canvas imperatively — wrapping it in React fights the library rather than working with it. Better suited to a Photoshop-style editor than a small set of typed domain objects (walls/rooms/openings) with their own React-driven state. |
| **paper.js / raw SVG + custom hit-testing** | Weaker fit | Paper.js has excellent vector-path math (useful later for polygon boolean ops) but no React integration story at all. Raw SVG is viable and framework-native, but you'd hand-roll drag handling and performance may suffer past a few hundred DOM nodes on a big multi-room plan. |

**Recommendation: react-konva.** It matches "declarative React app with typed
domain state driving the canvas" better than Fabric, and avoids raw-SVG
drag/hit-test boilerplate. Flagging for confirmation rather than assuming,
per the brief's own instruction — this is a foundational choice for
`features/plan-editor` and `features/scale-calibration` (the two-point
calibration click-tool is the same interaction primitive as wall tracing).

## Other decisions the brief left open (non-blocking for Phase 1, but worth settling now)

- **Monorepo tooling**: the brief specifies the folder layout (`apps/`,
  `packages/`) but not the tool. pnpm workspaces + Turborepo is the common
  default for this shape (fast, TS-project-references-friendly, good with
  OpenAPI-generated packages); Nx is the heavier alternative if
  code-generation/affected-graph tooling becomes valuable later. Recommend
  **pnpm workspaces + Turborepo** to start — cheap to adopt, not a
  one-way door.
- **DB/object storage**: not needed for Phase 1 (no persistence required
  by its acceptance criteria) but will be needed once `features/projects`
  (save/load) is built, likely by Phase 3-4. Deferring the pick rather
  than guessing a vendor now, since the brief doesn't name one and it's a
  real infra decision (managed Postgres + S3-compatible storage is the
  likely shape, but confirm before provisioning anything).
- **Multi-story ghost-overlay prototype (Phase 4 risk)**: the brief
  already correctly flags this as the riskiest interaction and suggests a
  throwaway prototype first. Keeping that recommendation as-is — don't
  build it inside the real editor on the first attempt.

## Data model — no changes

The `Building`/`Story`/`Wall`/`Room`/`Opening` schema in the brief is sound
and should go into `packages/shared-schema` as specified: OpenAPI spec as
source of truth, TS types generated from it, consumed by both `apps/web`
and `apps/bff` rather than hand-duplicated. One addition worth making
explicit: `scaleConfidence` and the `~` display convention should be
enforced at the type level where practical (e.g. a
`Measurement = { value: number; confidence: ScaleConfidence }` wrapper used
anywhere a derived measurement is displayed or exported), so "mark
estimated data visibly" is a compile-time-nudged pattern, not a per-component
convention developers have to remember.

## File tree — confirmed with one addition

The brief's file tree is adopted as-is, with one addition: a
`lib/measurement/` module in `apps/web/src/lib/` for the `Measurement`
wrapper and its formatting helpers (the `~` prefix, badge logic), since
that logic is shared across `plan-editor`, `scale-calibration`, `scene-3d`,
and `rendering-controls` (export panel) and shouldn't be reimplemented in
each feature.

## Phase 1 — concrete task breakdown

Scope stays exactly as the brief defines it (upload → manual trace → 3D
box extrusion, `scaleConfidence: 'none'` throughout, no provider, no
calibration). Breaking it into buildable steps:

1. Scaffold monorepo (`apps/web`, `apps/bff` stub, `packages/shared-schema`
   stub) with the chosen tooling.
2. `packages/shared-schema`: define the `Building`/`Story`/`Wall`/`Room`/
   `Opening` types (hand-written TS for now — OpenAPI spec + generator
   wiring can follow once the BFF has a real endpoint to describe, i.e.
   Phase 3; Phase 1 has no network calls to generate a client for).
3. `features/upload`: file picker → local object URL, no backend yet.
4. `features/plan-editor`: react-konva canvas, image as background layer,
   click-to-place wall-segment tool, wall list held in local component
   state (no persistence yet).
5. `features/scene-3d`: `geometry/` module extrudes a `Story`'s walls into
   basic box meshes via react-three-fiber; default `heightMeters` since
   there's no calibration yet.
6. Wire router (React Router v7, Data Mode) with a minimal route tree:
   upload → editor → 3D view.

No TanStack Query usage yet in Phase 1 (no server state to manage) — it
enters in Phase 3 once the BFF has endpoints worth querying/caching.

## Open questions requiring an answer before proceeding

1. Confirm **react-konva** for the 2D editor, or override with a reason.
2. Confirm **pnpm + Turborepo** for the monorepo, or specify a preferred
   tool.
3. Digitization provider for Phase 3 — no need to decide now, but flagging
   so it's not forgotten until Phase 3 planning starts.
