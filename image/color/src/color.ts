/**
 * Represents an RGBA color.
 * This class handles color representation and conversion between different formats.
 */
export class Color {
  /**
   * The red component of the color (0-255)
   * @private
   */
  private readonly _r: number;

  /**
   * The green component of the color (0-255)
   * @private
   */
  private readonly _g: number;

  /**
   * The blue component of the color (0-255)
   * @private
   */
  private readonly _b: number;

  /**
   * The alpha (opacity) component of the color (0-255)
   * @private
   */
  private readonly _a: number;

  /**
   * Creates a new Color instance.
   * @param r - The red component (0-255)
   * @param g - The green component (0-255)
   * @param b - The blue component (0-255)
   * @param a - The alpha (opacity) component (0-255)
   */
  constructor(r: number, g: number, b: number, a: number) {
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
      throw new Error('Invalid color components');
    }
    this._r = r % 256;
    this._g = g % 256;
    this._b = b % 256;
    this._a = a % 256;
  }

  /**
   * Gets the red component of the color.
   * @returns The red component (0-255)
   */
  get r(): number {
    return this._r;
  }

  /**
   * Gets the green component of the color.
   * @returns The green component (0-255)
   */
  get g(): number {
    return this._g;
  }

  /**
   * Gets the blue component of the color.
   * @returns The blue component (0-255)
   */
  get b(): number {
    return this._b;
  }

  /**
   * Gets the alpha (opacity) component of the color.
   * @returns The alpha component (0-255)
   */
  get a(): number {
    return this._a;
  }

  /**
   * Converts the color to an RGBA string.
   * @returns A CSS-compatible RGBA string representation (e.g., "rgba(255, 0, 0, 255)")
   */
  toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  /**
   * Creates a Color instance from a hexadecimal color string.
   * @param hex - The hexadecimal color string (e.g., "#FF0000", "FF0000", "#F00", "F00")
   * @returns A new Color instance
   *
   * @example
   * // Create a red color
   * const red = Color.fromHex("#FF0000");
   *
   * @example
   * // Create a semi-transparent blue color
   * const blue = Color.fromHex("#0000FF80");
   *
   * @throws {Error} If the hex string has an invalid format
   */
  static fromHex(hex: string): Color {
    if (hex.startsWith('#')) {
      hex = hex.slice(1);
    }
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('') + 'FF';
    }
    if (hex.length === 6) {
      hex = hex + 'FF';
    }
    if (hex.length !== 8) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
    return new Color(
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      parseInt(hex.slice(6, 8), 16),
    );
  }

  /**
   * Composites two colors using alpha compositing algorithm.
   * @param top - The foreground color (top layer)
   * @param bottom - The background color (bottom layer)
   * @returns A new Color instance resulting from the composition
   */
  static composite(top: Color, bottom: Color): Color {
    // Normalize alpha values (0-1)
    const topAlpha = top.a / 255;
    const bottomAlpha = bottom.a / 255;

    // Calculate resulting alpha using alpha compositing formula
    const resultAlpha = topAlpha + bottomAlpha * (1 - topAlpha);

    // If both colors are fully transparent
    if (resultAlpha === 0) {
      return new Color(0, 0, 0, 0);
    }

    // Calculate resulting RGB components using alpha compositing formula
    const r = Math.round(
      (top.r * topAlpha + bottom.r * bottomAlpha * (1 - topAlpha)) /
        resultAlpha,
    );
    const g = Math.round(
      (top.g * topAlpha + bottom.g * bottomAlpha * (1 - topAlpha)) /
        resultAlpha,
    );
    const b = Math.round(
      (top.b * topAlpha + bottom.b * bottomAlpha * (1 - topAlpha)) /
        resultAlpha,
    );

    // Convert final alpha to 0-255 range
    const a = Math.round(resultAlpha * 255);

    return new Color(r, g, b, a);
  }

  /**
   * Composites this color over another color.
   * @param bottom - The background color to composite over
   * @returns A new Color instance resulting from the composition
   */
  compositeOver(bottom: Color): Color {
    return Color.composite(this, bottom);
  }
}
