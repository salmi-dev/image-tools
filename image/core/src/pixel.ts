/**
 * Represents a single pixel position in a 2D image.
 * Provides coordinates and navigation utilities for traversing an image.
 */
export class Pixel {
  /**
   * Creates a new Pixel instance.
   *
   * @param x - The horizontal position (column) of the pixel
   * @param y - The vertical position (row) of the pixel
   */
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {
  }

  /**
   * Calculates the next pixel position in a row-by-row traversal pattern.
   * Moves from left to right, then to the next row, similar to reading text.
   *
   * @param width - The width of the image (maximum x value + 1)
   * @param height - The height of the image (maximum y value + 1)
   * @returns The next pixel position or undefined if at the end of the image
   *
   * @example
   * const pixel = new Pixel(5, 10);
   * // Get the next pixel in a 100x100 image
   * const nextPixel = pixel.nextPixel(100, 100);
   * if (nextPixel) {
   *   // Process next pixel
   * }
   */
  nextPixel(width: number, height: number): Pixel | undefined {
    if (this.x + 1 >= width) {
      const next = new Pixel(0, this.y + 1);
      if (next.y >= height) {
        return undefined;
      }
      return next;
    }
    return new Pixel(this.x + 1, this.y);
  }

  /**
   * Creates a new Pixel with transformed coordinates.
   * Applies the provided transform functions to the current coordinates.
   *
   * @param xTransform - Function to transform the x-coordinate
   * @param yTransform - Optional function to transform the y-coordinate.
   *                    If not provided, the y-coordinate remains unchanged.
   * @returns A new Pixel instance with the transformed coordinates
   *
   * @example
   * // Double the x-coordinate
   * const pixel = new Pixel(5, 10);
   * const transformed = pixel.transform(x => x * 2);
   * // Result: transformed.x = 10, transformed.y = 10
   *
   * @example
   * // Flip coordinates horizontally in a 100-width image
   * const pixel = new Pixel(25, 50);
   * const flipped = pixel.transform(x => 99 - x);
   * // Result: flipped.x = 74, flipped.y = 50
   *
   * @example
   * // Transform both coordinates (mirror across y=x line)
   * const pixel = new Pixel(3, 7);
   * const swapped = pixel.transform(x => y, y => x);
   * // Result: swapped.x = 7, swapped.y = 3
   */
  transform(
    xTransform: (x: number) => number,
    yTransform?: (y: number) => number,
  ): Pixel {
    let yTransformCopy = yTransform;
    if (!yTransformCopy) {
      yTransformCopy = (y) => xTransform(y);
    }
    return new Pixel(
      xTransform(this.x),
      yTransformCopy(this.y),
    );
  }
}
