const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
import ffmpeg from 'fluent-ffmpeg';
import { getLogger } from '../../helpers/logger';
import { convertBytes } from '../../helpers/normalization';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export enum Device {
  mobile = 'mobile',
  desktop = 'desktop',
}

interface ResizeProps {
  id: string;
  input: string;
  output: string;
  device: Device;
  pad?: boolean;
  color?: string;
}

export const resizeVideo = ({ id, input, output, device, color = 'black' }: ResizeProps): Promise<string> => {
  const logger = getLogger('Resize & Save');
  return new Promise((resolve, reject) => {
    // Default aspect ratio on YouTube is 16:9 for desktop and 16:9 for mobile
    const resolution = device === Device.desktop ? '1920x1080' : '1080x1920';

    ffmpeg(input)
      .on('start', function () {
        logger.info(`Resizing ${id} with resolution ${resolution}`);
      })
      .on('end', () => {
        logger.info(`Resized and saved ${id}`);
        resolve(output);
      })
      .on('error', (err) => {
        reject(err);
      })
      .output(output)
      .withSize(resolution)
      .autoPad(true, color)
      .run();
  });
};

export const getDimensions = (input: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, metadata) => {
      if (err) {
        reject(err);
      }
      const width = metadata?.streams[0]?.width as number;
      const height = metadata?.streams[0]?.height as number;
      resolve({ width, height });
    });
  });
};

export const mergeVideos = (inputs: string[], output: string) => {
  const logger = getLogger('Merge');
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    inputs.forEach((input) => {
      command.input(input);
    });
    command
      .on('start', function () {
        logger.info('Started merging');
      })
      .on('progress', (progress) => {
        logger.info(`Processing: ${convertBytes(progress.targetSize) || '0KB'}`);
      })
      .on('end', () => {
        logger.info(`Merge finished at ${output}`);
        resolve(output);
      })
      .on('error', (err) => {
        reject(err);
      })
      .mergeToFile(output);
  });
};
