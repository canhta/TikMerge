import { Device, resizeVideo } from '../ffmpeg';

// 'https://dltik.com/download?vid=7079390542810844443&source=tiktok';

interface NoWatermarkProps {
  id: string;
  output: string;
  device: Device;
  pad?: boolean;
  color?: string;
}

export const getNoWatermark = async ({ id, ...rest }: NoWatermarkProps) => {
  const input = `https://dltik.com/download?vid=${id}&source=tiktok`;
  return await resizeVideo({ id, input, ...rest });
};
