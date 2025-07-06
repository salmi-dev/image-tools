import denoConfig from '../deno.json' with { type: 'json' };

export const SDImageColorInfo = {
  version: denoConfig.version,
};

export * from './color.ts';
export * from './colors.ts';
export * from './color-pair.ts';
