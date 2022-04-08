import { existsSync, mkdirSync } from 'fs';
import { DateTime } from 'luxon';
import { join } from 'path';

export const createPaths = (
  directory: string,
  hashtag: string
): {
  mainPath: string;
  sourcesPath: string;
  bannerPath: string;
  metaFilePath: string;
  normalizeFilePath: string;
  videoFilePath: string;
  descriptionFilePath: string;
} => {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
  const mainPath = join(__dirname, '../../../contents', `${DateTime.now().toFormat('yyyy-MM-dd')}-${hashtag}`);
  if (!existsSync(mainPath)) {
    mkdirSync(mainPath);
  }
  const sourcesPath = join(mainPath, 'sources');
  if (!existsSync(sourcesPath)) {
    mkdirSync(sourcesPath);
  }
  const bannerPath = join(mainPath, 'banners');
  if (!existsSync(bannerPath)) {
    mkdirSync(bannerPath);
  }

  const metaFilePath = join(mainPath, 'metadata.json');
  const normalizeFilePath = join(mainPath, 'normalize.json');
  const videoFilePath = join(mainPath, 'merged_video.mp4');
  const descriptionFilePath = join(mainPath, 'description.txt');

  return {
    mainPath,
    sourcesPath,
    bannerPath,
    metaFilePath,
    normalizeFilePath,
    videoFilePath,
    descriptionFilePath,
  };
};
