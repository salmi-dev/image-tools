import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { ColorPair } from './color-pair.ts';
import { Color } from './color.ts';

describe('ColorPair', () => {
  it('should be created', () => {
    expect(ColorPair.fromHex('#FFF', '#000', 'blackandwhite')).toBeTruthy();
  });

  describe('id generation', () => {
    it('should generate id from name correctly', () => {
      const colorPair = ColorPair.fromHex('#FFF', '#000', 'Black And White');
      expect(colorPair.id).toBe('black and white');
    });

    it('should generate lowercase id for uppercase name', () => {
      const colorPair = ColorPair.fromHex('#FFF', '#000', 'PRIMARY');
      expect(colorPair.id).toBe('primary');
    });
  });

  describe('fromColors factory method', () => {
    it('should create ColorPair from Color objects', () => {
      const primary = new Color(255, 0, 0, 255);
      const secondary = new Color(0, 0, 255, 255);
      const colorPair = ColorPair.fromColors(
        'Red and Blue',
        primary,
        secondary,
      );

      expect(colorPair.name).toBe('Red and Blue');
      expect(colorPair.primaryColor).toBe(primary);
      expect(colorPair.secondaryColor).toBe(secondary);
    });
  });

  describe('fromHex factory method', () => {
    it('should create ColorPair from hex values', () => {
      const colorPair = ColorPair.fromHex('#FF0000', '#0000FF', 'Red and Blue');

      expect(colorPair.name).toBe('Red and Blue');
      expect(colorPair.primaryColor.r).toBe(255);
      expect(colorPair.primaryColor.g).toBe(0);
      expect(colorPair.primaryColor.b).toBe(0);
      expect(colorPair.primaryColor.a).toBe(255);

      expect(colorPair.secondaryColor.r).toBe(0);
      expect(colorPair.secondaryColor.g).toBe(0);
      expect(colorPair.secondaryColor.b).toBe(255);
      expect(colorPair.secondaryColor.a).toBe(255);
    });

    it('should support shorthand hex values', () => {
      const colorPair = ColorPair.fromHex('#F00', '#00F', 'Red and Blue');

      expect(colorPair.primaryColor.r).toBe(255);
      expect(colorPair.primaryColor.g).toBe(0);
      expect(colorPair.primaryColor.b).toBe(0);

      expect(colorPair.secondaryColor.r).toBe(0);
      expect(colorPair.secondaryColor.g).toBe(0);
      expect(colorPair.secondaryColor.b).toBe(255);
    });

    it('should support hex values with alpha', () => {
      const colorPair = ColorPair.fromHex(
        '#FF0000AA',
        '#0000FF80',
        'Red and Blue',
      );

      expect(colorPair.primaryColor.a).toBe(170); // AA in hex
      expect(colorPair.secondaryColor.a).toBe(128); // 80 in hex
    });
  });

  describe('property access', () => {
    it('should provide read access to all properties', () => {
      const colorPair = ColorPair.fromHex('#FFF', '#000', 'Contrast');

      expect(colorPair.name).toBe('Contrast');
      expect(colorPair.id).toBe('contrast');
      expect(colorPair.primaryColor).toBeInstanceOf(Color);
      expect(colorPair.secondaryColor).toBeInstanceOf(Color);
    });
  });
});
