import { Thresholds } from "../src/types";
import { isWithinThreshold } from "../src/utils/utils";

describe("utils.ts", () => {
  describe("isWithinThreshold", () => {
    test("should return true with valid value and threshold", () => {
      const threshold: Thresholds = {
        lower: 50,
        upper: 100,
      };
      expect(isWithinThreshold(60, threshold)).toBe(true);
    });
    test("should return false with invalid value and threshold", () => {
      const threshold: Thresholds = {
        lower: 50,
        upper: 100,
      };
      expect(isWithinThreshold(120, threshold)).toBe(false);
    });
  });
});
