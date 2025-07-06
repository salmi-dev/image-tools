import { encodePNG } from '@img/png/encode';
import type { Color } from '@salmidev/image-color';
import { Colors } from '@salmidev/image-color';
import { join } from '@std/path/join';
import { Pixel } from './pixel.ts';

/**
 * Represents a 2D image composed of pixels with color information.
 * Supports creating, manipulating and saving images.
 *
 * @implements {Iterable<Pixel>}
 *
 * @example
 * // Create a 100x100 white image
 * const image = new Image(100, 100);
 *
 * // Create a checkerboard pattern
 * const checkerboard = new Image(100, 100, (pixel) => {
 *   return (pixel.x + pixel.y) % 2 === 0 ? colors.White : colors.Black;
 * });
 */
export class Image implements Iterable<Pixel> {
  /**
   * Default directory where images will be saved.
   */
  public static readonly defaultBaseFolder = './maths-objects-images';

  /**
   * Array storing color information for all pixels in the image.
   * Indexed by y * width + x.
   */
  public pixels: Color[] = [];

  /**
   * Creates a new Image instance.
   *
   * @param width - Width of the image in pixels
   * @param height - Height of the image in pixels
   * @param colorCalculator - Function to determine the color of each pixel.
   *                          Defaults to creating a white image.
   */
  constructor(
    public readonly width: number,
    public readonly height: number,
    colorCalculator: (pixel: Pixel) => Color = () => Colors.White,
  ) {
    for (const pixel of this) {
      this.pixels.push(colorCalculator(pixel));
    }
  }

  /**
   * Validates that a pixel's coordinates are within the bounds of the image.
   *
   * @param pixel - The pixel coordinates to check
   * @throws Error if the pixel coordinates are outside the image boundaries
   *
   * @example
   * // Check if a pixel is within bounds before using it
   * const image = new Image(100, 100);
   * const pixel = new Pixel(50, 50);
   * image.checkBounds(pixel); // No error thrown
   *
   * // This would throw an error:
   * // image.checkBounds(new Pixel(200, 50));
   */
  checkBounds(pixel: Pixel): void {
    if (
      pixel.x < 0 || pixel.x >= this.width ||
      pixel.y < 0 || pixel.y >= this.height
    ) {
      throw new Error(
        `Pixel coordinates (${pixel.x}, ${pixel.y}) are out of bounds for image size ${this.width}x${this.height}.`,
      );
    }
  }

  /**
   * Updates the color of a specific pixel.
   *
   * @param pixel - The pixel coordinates to update
   * @param color - The new color to assign
   */
  public updatePixel(pixel: Pixel, color: Color) {
    const index = pixel.y * this.width + pixel.x;
    this.pixels[index] = color;
  }

  /**
   * Gets the color of a specific pixel.
   *
   * @param pixel - The pixel coordinates to query
   * @returns The color at the specified pixel
   */
  public getPixel(pixel: Pixel): Color {
    const index = pixel.y * this.width + pixel.x;
    return this.pixels[index];
  }

  /**
   * Converts the image to a Uint8Array of RGBA values.
   * Each pixel is represented by 4 bytes (R, G, B, A).
   *
   * @returns A Uint8Array containing the image data
   */
  public toUint8Array(): Uint8Array<ArrayBuffer> {
    const res = new Uint8Array(this.width * this.height * 4);
    this.pixels.forEach((color, index) => {
      const i = index * 4;
      res[i] = color.r;
      res[i + 1] = color.g;
      res[i + 2] = color.b;
      res[i + 3] = color.a;
    });
    return res;
  }

  /**
   * Saves the image as a PNG file.
   *
   * @param filename - Name of the output file
   * @param baseFolder - Directory where the file should be saved
   * @returns Promise that resolves when the file has been written
   *
   * @example
   * // Create and save an image
   * const image = new Image(100, 100);
   * await image.save("test.png");
   */
  async save(
    filename: string,
    baseFolder = Image.defaultBaseFolder,
  ): Promise<void> {
    await Deno.mkdir(baseFolder, { recursive: true });
    await Deno.writeFile(
      join(baseFolder, filename),
      await encodePNG(this.toUint8Array(), {
        width: this.width,
        height: this.height,
        compression: 0,
        filter: 0,
        interlace: 0,
      }),
    );
  }

  /**
   * Implements the Iterator protocol for the Image class.
   * Allows iterating through all pixels in row-major order.
   *
   * @returns An iterator for the pixels
   *
   * @example
   * // Iterate through all pixels and set them to red
   * const image = new Image(100, 100);
   * for (const pixel of image) {
   *   image.updatePixel(pixel, colors.Red);
   * }
   */
  [Symbol.iterator](): Iterator<Pixel> {
    let nextEl: Pixel | undefined = new Pixel(0, 0);
    const { width, height } = this;
    return {
      next(): IteratorResult<Pixel> {
        const current = nextEl;
        nextEl = nextEl?.nextPixel(width, height);
        if (!current) {
          return { done: true, value: undefined };
        }
        return { done: false, value: current };
      },
    };
  }
}
