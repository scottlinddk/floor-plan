import { useSyncExternalStore } from "react";
import { createEmptyStory, type Story, type Wall } from "@floorplan3d/shared-schema";

/**
 * Phase 1 has no backend and no persistence — this is a minimal in-memory
 * store for the single Story being traced in the current tab. It's
 * intentionally not Redux/Zustand: there's exactly one piece of shared state
 * (the active Story) and one consumer pattern (subscribe + snapshot), so a
 * hand-rolled useSyncExternalStore store is the smallest thing that works.
 * Replace this once Phase 3+ introduces real persistence and TanStack Query.
 */
let story: Story | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function startNewStory(sourceImageUrl: string): void {
  story = createEmptyStory(sourceImageUrl);
  emit();
}

export function addWall(wall: Wall): void {
  if (!story) throw new Error("No active story — upload an image first.");
  story = { ...story, walls: [...story.walls, wall] };
  emit();
}

export function removeLastWall(): void {
  if (!story || story.walls.length === 0) return;
  story = { ...story, walls: story.walls.slice(0, -1) };
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Story | null {
  return story;
}

export function useStory(): Story | null {
  return useSyncExternalStore(subscribe, getSnapshot);
}
