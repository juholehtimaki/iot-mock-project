import { Thresholds } from "../types";

export const isWithinThreshold = (val: number, threshold: Thresholds) => {
  return val >= threshold.lower && val <= threshold.upper;
};
