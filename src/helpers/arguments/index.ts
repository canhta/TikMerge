import { defaultMainArgs, defaultUploadArgs } from '../../configs';
import { Device } from '../../modules/ffmpeg';
import { ETypes } from '../../modules/scraper';

export const getArgs = (
  args: string[]
): {
  type: ETypes;
  device: Device;
  banner: number;
  duration: number; // The duration of video by minutes
  hashtag: string;
  batchSize: number;
  skip: number;
} => {
  const type: ETypes = (args?.find((arg) => arg.startsWith('type='))?.split('=')[1] as ETypes) || defaultMainArgs.type;
  const device = (args?.find((arg) => arg.startsWith('device='))?.split('=')[1] || defaultMainArgs.device) as Device;
  const duration = parseInt(
    args?.find((arg) => arg.startsWith('duration='))?.split('=')[1] || defaultMainArgs.duration
  );
  const banner = parseInt(args?.find((arg) => arg.startsWith('banner='))?.split('=')[1] || defaultMainArgs.banner);
  const hashtag = args?.find((arg) => arg.startsWith('hashtag='))?.split('=')[1] || defaultMainArgs.hashtag;
  const batchSize = parseInt(args?.find((arg) => arg.startsWith('batch='))?.split('=')[1] || defaultMainArgs.batchSize);
  const skip = parseInt(args?.find((arg) => arg.startsWith('skip='))?.split('=')[1] || defaultMainArgs.skip);
  return { type, device, duration, banner, hashtag, batchSize, skip };
};

export const uploadArgs = (args: string[]): { title: string; hashtag: string; bannerId: number } => {
  const title = args?.find((arg) => arg.startsWith('title='))?.split('=')[1] || defaultUploadArgs.title;
  const bannerId = parseInt(
    args?.find((arg) => arg.startsWith('bannerId='))?.split('=')[1] || defaultUploadArgs.bannerId
  );
  const hashtag = args?.find((arg) => arg.startsWith('hashtag='))?.split('=')[1] || defaultUploadArgs.hashtag;
  return { title, hashtag, bannerId };
};
