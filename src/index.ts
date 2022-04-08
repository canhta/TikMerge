import { writeFileSync } from 'fs';
import { join } from 'path';
import { getArgs } from './helpers/arguments';
import { getLogger } from './helpers/logger';
import { convertNumber, normalizeCollector } from './helpers/normalization';
import { createPaths } from './helpers/paths';
import { batchPromises } from './helpers/promises';
import { createBanners } from './modules/banner';
import { generateDescription } from './modules/description';
import { getDimensions, mergeVideos, resizeVideo } from './modules/ffmpeg';
import { scraper } from './modules/scraper';

(async () => {
  const logger = getLogger('Main');
  const { device, banner, hashtag, type, batchSize, duration, skip } = getArgs(process.argv.slice(2));
  const { sourcesPath, bannerPath, videoFilePath, metaFilePath, descriptionFilePath } = createPaths(
    'contents',
    hashtag
  );
  const collectors = await scraper(type, duration, skip, hashtag);
  const normalizeData = normalizeCollector(collectors);
  await writeFileSync(metaFilePath, JSON.stringify(collectors, null, 2));
  // await writeFileSync(normalizeFilePath, JSON.stringify(normalizeData, null, 2));
  await generateDescription(collectors, descriptionFilePath);
  // Resize and save videos
  const videoPaths = await batchPromises(
    batchSize,
    collectors,
    async ({ id, videoUrl }) =>
      await resizeVideo({ id, input: videoUrl, device, output: join(sourcesPath, `${id}.mp4`) })
  );
  // logger.info(`All paths: ${JSON.stringify(videoPaths, null, 2)}`);
  const dimensions = await Promise.all(
    videoPaths.map(async (videoPath) => {
      return await getDimensions(videoPath);
    })
  );
  // logger.info(`All dimensions: ${JSON.stringify(dimensions, null, 2)}`);
  if (videoPaths.length > 1) {
    await mergeVideos(videoPaths, videoFilePath);
    const likes = convertNumber(normalizeData.likes);
    const views = convertNumber(normalizeData.views);
    const { width, height } = dimensions[0];
    // TODO: Fixed banner size
    await createBanners({
      collectors,
      likes,
      views,
      height: 1080,
      width: 1920,
      mainPath: bannerPath,
      number: banner,
    });
  }
  logger.info('Done');
})();
