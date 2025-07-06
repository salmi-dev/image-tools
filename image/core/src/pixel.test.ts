import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Pixel } from "./pixel.ts";

describe("Pixel", () => {
  it("should be created", () => {
    expect(new Pixel(10, 10)).toBeTruthy();
  });

  describe("constructor", () => {
    it("should set x and y properties correctly", () => {
      const pixel = new Pixel(5, 7);
      expect(pixel.x).toBe(5);
      expect(pixel.y).toBe(7);
    });

    it("should allow zero values", () => {
      const pixel = new Pixel(0, 0);
      expect(pixel.x).toBe(0);
      expect(pixel.y).toBe(0);
    });

    it("should allow negative values", () => {
      const pixel = new Pixel(-3, -5);
      expect(pixel.x).toBe(-3);
      expect(pixel.y).toBe(-5);
    });
  });

  describe("nextPixel", () => {
    it("should return the next pixel in the same row", () => {
      const pixel = new Pixel(5, 7);
      const next = pixel.nextPixel(10, 10);

      expect(next).toBeDefined();
      if (next) {
        expect(next.x).toBe(6);
        expect(next.y).toBe(7);
      }
    });

    it("should move to the next row when at the end of a row", () => {
      const pixel = new Pixel(9, 7);
      const next = pixel.nextPixel(10, 10);

      expect(next).toBeDefined();
      if (next) {
        expect(next.x).toBe(0);
        expect(next.y).toBe(8);
      }
    });

    it("should return undefined when at the end of the image", () => {
      const pixel = new Pixel(9, 9);
      const next = pixel.nextPixel(10, 10);

      expect(next).toBeUndefined();
    });

    it("should return undefined for a pixel beyond the image bounds", () => {
      const pixel = new Pixel(10, 10);
      const next = pixel.nextPixel(10, 10);

      expect(next).toBeUndefined();
    });

    it("should work with a 1x1 image", () => {
      const pixel = new Pixel(0, 0);
      const next = pixel.nextPixel(1, 1);

      expect(next).toBeUndefined();
    });

    it("should handle being at the edge of a wide image", () => {
      const pixel = new Pixel(99, 5);
      const next = pixel.nextPixel(100, 100);

      expect(next).toBeDefined();
      if (next) {
        expect(next.x).toBe(0);
        expect(next.y).toBe(6);
      }
    });
  });

  describe("transform", () => {
    it("should apply xTransform correctly", () => {
      const pixel = new Pixel(5, 10);
      const transformed = pixel.transform((x) => x * 2);

      expect(transformed.x).toBe(10);
      expect(transformed.y).toBe(20);
    });

    it("should apply both xTransform and yTransform correctly", () => {
      const pixel = new Pixel(3, 7);
      const transformed = pixel.transform((x) => x + 1, (y) => y - 1);

      expect(transformed.x).toBe(4);
      expect(transformed.y).toBe(6);
    });

    it("should leave y unchanged if yTransform is not provided", () => {
      const pixel = new Pixel(8, 15);
      const transformed = pixel.transform((x) => x - 3);

      expect(transformed.x).toBe(5);
      expect(transformed.y).toBe(12);
    });

    it("should handle flipping coordinates horizontally", () => {
      const pixel = new Pixel(25, 50);
      const transformed = pixel.transform((x) => 99 - x);

      expect(transformed.x).toBe(74);
      expect(transformed.y).toBe(49);
    });

    it("should handle swapping x and y coordinates", () => {
      const pixel = new Pixel(3, 7);
      const transformed = pixel.transform((_) => pixel.x);

      expect(transformed.x).toBe(3);
      expect(transformed.y).toBe(3);
    });
  });
});
