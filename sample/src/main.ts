import { ImageCoreInfo } from '@salmidev/image-core';
import { ImageColorInfo } from '@salmidev/image-color';

if (import.meta.main) {
  console.log(`Image Core  Library version : ${ImageCoreInfo.version}`);
  console.log(`Image Color Library version : ${ImageColorInfo.version}`);
}
