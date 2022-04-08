import { hashtag, Options, PostCollector, trend } from 'tiktok-scraper';
import { getLogger } from '../../helpers/logger';

export enum ETypes {
  trend = 'trend',
  hashtag = 'hashtag',
}

// TODO: Crop video by aspect ratio
export const filter = (collectors: PostCollector[], duration: number, skip: number): PostCollector[] => {
  const logger = getLogger('Filter');
  const max = duration * 60;
  logger.info(`Start with ${collectors.length} videos to fit ${duration} minutes`);
  const sorted = collectors
    .filter(({ videoMeta: { width, height } }) => width === 576 && height === 1024)
    .sort((a, b) => b.diggCount - a.diggCount)
    .slice(skip);
  logger.info(`After filter: ${sorted.length} videos, skip ${skip} videos`);
  // Get enough videos to fit the duration
  const { videos, totalDuration } = sorted.reduce(
    (acc: { totalDuration: number; videos: PostCollector[] }, video) => {
      const { duration } = video.videoMeta;
      const { totalDuration, videos } = acc;
      if (totalDuration + duration > max) {
        logger.info(`${video.text} is skipped: ${totalDuration + duration}s > ${max}s`);
        return acc;
      }
      return { totalDuration: totalDuration + duration, videos: [...videos, video] };
    },
    { totalDuration: 0, videos: [] }
  );
  logger.info(`Result: ${videos.length} videos with duration: ${Math.ceil(totalDuration / 60)}:${totalDuration % 60}`);
  return videos;
};

export const scraper = async (
  type: ETypes,
  duration: number,
  skip: number,
  input?: string
): Promise<PostCollector[]> => {
  const logger = getLogger('Scraper');
  const number = 100;
  const options: Options = {
    number,
    sessionList: ['sid_tt=a331d722756e7e96e73590c244080e0b;', 'sid_tt=0fc030635e3a2ee4a74e9d862ca1d1ac;'],
    noWaterMark: true,
  };

  try {
    if (type === ETypes.hashtag) {
      if (!input) {
        throw new Error('Hashtag is required');
      }
      logger.info(`Scrapping by hashtag: ${input} with ${number} collectors`);
      const response = await hashtag(input, options);
      const collectors = filter(response.collector, duration, skip);
      logger.info(`Scraper finished with ${collectors.length} collectors`);
      return collectors;
    }
    if (type === ETypes.trend) {
      logger.info(`Scrapping by trend with ${number} collectors`);
      const response = await trend('', options);
      const collectors = filter(response.collector, duration, skip);
      logger.info(`Scraper finished with ${collectors.length} collectors`);
      return collectors;
    }
    throw new Error('Invalid type');
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
