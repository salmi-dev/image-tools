import denoConfig from '../deno.json' with { type: 'json' };

export * from './pixel.ts';
export * from './image.ts';

export const SDImageCoreInfo = {
  version: denoConfig.version,
};
