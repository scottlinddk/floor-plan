import type { ScaleConfidence } from "@floorplan3d/shared-schema";

/**
 * Wraps any derived measurement together with the scale confidence it was
 * computed under, so "mark estimated data visibly" (non-negotiable principle
 * #1 in the project brief) is something the type system nudges toward rather
 * than a convention each component has to remember.
 */
export interface Measurement {
  valueMeters: number;
  confidence: ScaleConfidence;
}

export function formatMeasurement(measurement: Measurement, fractionDigits = 2): string {
  const value = `${measurement.valueMeters.toFixed(fractionDigits)} m`;
  return measurement.confidence === "calibrated" ? value : `~${value}`;
}

export function isTrustworthy(confidence: ScaleConfidence): boolean {
  return confidence === "calibrated";
}

/**
 * Human-readable confidence badge text. Shown in both the 2D editor and the
 * 3D view headers per the brief's non-negotiable rule that estimated/absent
 * scale must be visible everywhere a measurement could be inferred from —
 * not just once calibration (Phase 2) exists.
 */
export function confidenceLabel(confidence: ScaleConfidence): string {
  switch (confidence) {
    case "calibrated":
      return "Scale: calibrated";
    case "estimated":
      return "Scale: estimated — dimensions are approximate";
    case "none":
      return "Scale: not set — dimensions are not to scale";
  }
}
