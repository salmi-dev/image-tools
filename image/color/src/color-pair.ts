import { Color } from './color.ts';

/**
 * Represents a pair of colors used together in UI elements or themes.
 * Each ColorPair has a primary and secondary color along with a name identifier.
 */
export class ColorPair {
  /**
   * A lowercase version of the name, suitable for use as an identifier.
   * @readonly
   */
  public readonly id: string;

  /**
   * Creates a new ColorPair instance.
   * @param name - The display name of the color pair
   * @param primaryColor - The main color in the pair
   * @param secondaryColor - The complementary color in the pair
   * @private
   */
  private constructor(
    /**
     * The display name of the color pair.
     * @readonly
     */
    public readonly name: string,
    /**
     * The main color in the pair.
     * @readonly
     */
    public readonly primaryColor: Color,
    /**
     * The complementary color in the pair.
     * @readonly
     */
    public readonly secondaryColor: Color,
  ) {
    this.id = this.name.toLowerCase();
  }

  /**
   * Creates a ColorPair from two Color objects.
   * @param name - The display name of the color pair
   * @param primaryColor - The main color in the pair
   * @param secondaryColor - The complementary color in the pair
   * @returns A new ColorPair instance
   *
   * @example
   * const primary = new Color(255, 255, 255, 255);
   * const secondary = new Color(0, 0, 0, 255);
   * const pair = ColorPair.fromColors("Black and White", primary, secondary);
   */
  static fromColors(
    name: string,
    primaryColor: Color,
    secondaryColor: Color,
  ): ColorPair {
    return new ColorPair(name, primaryColor, secondaryColor);
  }

  /**
   * Creates a ColorPair from two hexadecimal color strings.
   * @param hex1 - Hexadecimal string for the primary color (e.g., "#FFFFFF" or "#FFF")
   * @param hex2 - Hexadecimal string for the secondary color
   * @param name - The display name of the color pair
   * @returns A new ColorPair instance
   *
   * @example
   * const pair = ColorPair.fromHex("#FFFFFF", "#000000", "Black and White");
   */
  static fromHex(hex1: string, hex2: string, name: string): ColorPair {
    return ColorPair.fromColors(
      name,
      Color.fromHex(hex1),
      Color.fromHex(hex2),
    );
  }
}

/**
 * Pre-defined color pairs that can be used throughout the application.
 * Each pair consists of carefully selected primary and secondary colors.
 *
 * @example
 * import { colorPairs } from "./color-pair.ts";
 *
 * // Use the Ocean color pair
 * const oceanPair = colorPairs.Ocean;
 */
export const colorPairs: {
  Classic: ColorPair;
  Ocean: ColorPair;
  Sunset: ColorPair;
  Lavender: ColorPair;
  Mint: ColorPair;
  Berry: ColorPair;
  Steel: ColorPair;
  Desert: ColorPair;
  Electric: ColorPair;
  Cosmic: ColorPair;
} = {
  Classic: ColorPair.fromHex('#F5F5F5', '#212121', 'Classic'),
  Ocean: ColorPair.fromHex('#E0F7FA', '#01579B', 'Ocean'),
  Sunset: ColorPair.fromHex('#FFEBEE', '#BF360C', 'Sunset'),
  Lavender: ColorPair.fromHex('#F3E5F5', '#4A148C', 'Lavender'),
  Mint: ColorPair.fromHex('#E0F2F1', '#004D40', 'Mint'),
  Berry: ColorPair.fromHex('#FCE4EC', '#880E4F', 'Berry'),
  Steel: ColorPair.fromHex('#ECEFF1', '#263238', 'Steel'),
  Desert: ColorPair.fromHex('#FFF8E1', '#FF6F00', 'Desert'),
  Electric: ColorPair.fromHex('#FFD600', '#1A237E', 'Electric'),
  Cosmic: ColorPair.fromHex('#FF1744', '#1A237E', 'Cosmic'),
} as const;
