import { Color } from './color.ts';

/**
 * A collection of predefined colors.
 */
export const Colors: {
  Black: Color;
  White: Color;
  Red: Color;
  Green: Color;
  Blue: Color;
  Yellow: Color;
  Magenta: Color;
  Cyan: Color;
  Transparent: Color;
  Gray: Color;
  DarkGray: Color;
} = {
  Black: new Color(0, 0, 0, 255),
  White: new Color(255, 255, 255, 255),
  Red: new Color(255, 0, 0, 255),
  Green: new Color(0, 255, 0, 255),
  Blue: new Color(0, 0, 255, 255),
  Yellow: new Color(255, 255, 0, 255),
  Magenta: new Color(255, 0, 255, 255),
  Cyan: new Color(0, 255, 255, 255),
  Transparent: new Color(0, 0, 0, 0),
  Gray: new Color(128, 128, 128, 255),
  DarkGray: new Color(64, 64, 64, 255),
} as const;
