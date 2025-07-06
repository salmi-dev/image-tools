import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import { assertSpyCalls, type Spy, spy } from 'jsr:@std/testing/mock';
import { expect } from '@std/expect';
import { Image, Pixel } from '@salmidev/image-core';
import { Color, Colors } from '@salmidev/image-color';

describe("Image", () => {
  let testImage: Image;

  beforeEach(() => {
    testImage = new Image(3, 2);
  });

  it("should be created", () => {
    expect(new Image(10, 10)).toBeTruthy();
  });

  describe("constructor", () => {
    it("should create an image with correct dimensions", () => {
      expect(testImage.width).toBe(3);
      expect(testImage.height).toBe(2);
      expect(testImage.pixels.length).toBe(6); // 3x2
    });

    it("should initialize with white pixels by default", () => {
      for (let y = 0; y < testImage.height; y++) {
        for (let x = 0; x < testImage.width; x++) {
          const color = testImage.getPixel(new Pixel(x, y));
          expect(color).toBe(Colors.White);
        }
      }
    });

    it("should use the provided color calculator", () => {
      // Create a checkerboard pattern
      const checkerboard = new Image(2, 2, (pixel) => {
        return (pixel.x + pixel.y) % 2 === 0 ? Colors.White : Colors.Black;
      });

      expect(checkerboard.getPixel(new Pixel(0, 0))).toBe(Colors.White);
      expect(checkerboard.getPixel(new Pixel(1, 0))).toBe(Colors.Black);
      expect(checkerboard.getPixel(new Pixel(0, 1))).toBe(Colors.Black);
      expect(checkerboard.getPixel(new Pixel(1, 1))).toBe(Colors.White);
    });
  });

  describe("pixel manipulation", () => {
    it("should update and retrieve pixel colors correctly", () => {
      const pixel = new Pixel(1, 1);
      testImage.updatePixel(pixel, Colors.Red);
      expect(testImage.getPixel(pixel)).toBe(Colors.Red);

      testImage.updatePixel(new Pixel(0, 1), Colors.Green);
      expect(testImage.getPixel(new Pixel(0, 1))).toBe(Colors.Green);
    });
  });

  describe("toUint8Array", () => {
    it("should convert image data to Uint8Array correctly", () => {
      // Create a 2x1 image with specific colors
      const smallImage = new Image(2, 1);
      smallImage.updatePixel(new Pixel(0, 0), Colors.Red);
      smallImage.updatePixel(new Pixel(1, 0), Colors.Blue);

      const data = smallImage.toUint8Array();

      // 2 pixels x 4 bytes (RGBA) = 8 bytes
      expect(data.length).toBe(8);

      // Check Red pixel
      expect(data[0]).toBe(Colors.Red.r);
      expect(data[1]).toBe(Colors.Red.g);
      expect(data[2]).toBe(Colors.Red.b);
      expect(data[3]).toBe(Colors.Red.a);

      // Check Blue pixel
      expect(data[4]).toBe(Colors.Blue.r);
      expect(data[5]).toBe(Colors.Blue.g);
      expect(data[6]).toBe(Colors.Blue.b);
      expect(data[7]).toBe(Colors.Blue.a);
    });
  });

  describe("checkBounds", () => {
    it("should not throw error for valid pixel coordinates", () => {
      // Test all valid coordinates in the 3x2 test image
      expect(() => testImage.checkBounds(new Pixel(0, 0))).not.toThrow();
      expect(() => testImage.checkBounds(new Pixel(1, 0))).not.toThrow();
      expect(() => testImage.checkBounds(new Pixel(2, 0))).not.toThrow();
      expect(() => testImage.checkBounds(new Pixel(0, 1))).not.toThrow();
      expect(() => testImage.checkBounds(new Pixel(1, 1))).not.toThrow();
      expect(() => testImage.checkBounds(new Pixel(2, 1))).not.toThrow();
    });

    it("should throw error for negative coordinates", () => {
      expect(() => testImage.checkBounds(new Pixel(-1, 0))).toThrow(Error);
      expect(() => testImage.checkBounds(new Pixel(0, -1))).toThrow(Error);
      expect(() => testImage.checkBounds(new Pixel(-1, -1))).toThrow(Error);
    });

    it("should throw error for coordinates beyond image dimensions", () => {
      expect(() => testImage.checkBounds(new Pixel(3, 0))).toThrow(Error);
      expect(() => testImage.checkBounds(new Pixel(0, 2))).toThrow(Error);
      expect(() => testImage.checkBounds(new Pixel(3, 2))).toThrow(Error);
    });

    it("should include pixel coordinates and image dimensions in error message", () => {
      const errorPattern =
        /Pixel coordinates \(5, 10\) are out of bounds for image size 3x2/;
      expect(() => testImage.checkBounds(new Pixel(5, 10))).toThrow(
        errorPattern,
      );
    });
  });

  describe("iteration", () => {
    it("should iterate through all pixels in correct order", () => {
      const expectedPositions = [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ];

      expect(testImage.pixels.length).toBe(6);

      let index = 0;
      for (const pixel of testImage) {
        expect(pixel.x).toBe(expectedPositions.at(index)?.at(0));
        expect(pixel.y).toBe(expectedPositions.at(index)?.at(1));
        index++;
      }

      expect(index).toBe(expectedPositions.length);
    });

    it("should allow modifying pixels during iteration", () => {
      // Set all pixels to their position-based color
      for (const pixel of testImage) {
        const colorValue = (pixel.x + pixel.y * 10) * 20;
        testImage.updatePixel(
          pixel,
          new Color(
            colorValue % 256,
            0,
            0,
            255,
          ),
        );
      }

      // Verify pixels were set correctly
      expect(testImage.getPixel(new Pixel(0, 0)).r).toBe(0);
      expect(testImage.getPixel(new Pixel(1, 0)).r).toBe(20);
      expect(testImage.getPixel(new Pixel(0, 1)).r).toBe(200);
    });
  });

  describe("save", () => {
    const originalDeno: Partial<typeof Deno> = {
      mkdir: Deno.mkdir,
      writeFile: Deno.writeFile,
    };

    const mkdirSpy = spy((_path: string) => {
      return Promise.resolve();
    });

    const writeFileSpy = spy((_path: string, _data: Uint8Array) => {
      return Promise.resolve();
    });

    beforeEach(() => {
      Deno.mkdir = mkdirSpy as typeof Deno.mkdir;
      Deno.writeFile = writeFileSpy as typeof Deno.writeFile;
    });

    afterEach(() => {
      Deno.mkdir = originalDeno.mkdir as typeof Deno.mkdir;
      Deno.writeFile = originalDeno.writeFile as typeof Deno.writeFile;
    });

    it("should create directory and save image as PNG", async () => {
      const filePath = "test_image.png";
      await testImage.save(filePath, "base_folder");
      assertSpyCalls(Deno.mkdir as Spy<typeof Deno.mkdir>, 1);
      assertSpyCalls(Deno.writeFile as Spy<typeof Deno.writeFile>, 1);

      expect(mkdirSpy.calls[0].args[0]).toBe("base_folder");
      expect(writeFileSpy.calls[0].args[0]).toBe("base_folder/test_image.png");
      expect(writeFileSpy.calls[0].args[1]).toBeInstanceOf(Uint8Array);
    });
  });
});
