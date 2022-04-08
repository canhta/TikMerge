import { join } from 'path';
import { getNoWatermark } from '.';
import { createPaths } from '../../helpers/paths';
import { Device } from '../ffmpeg';

(async () => {
  const { sourcesPath } = createPaths('test', 'tiktokdancevn');
  const id = '7071629750069955866';
  const videoUrl = getNoWatermark({
    id: id,
    device: Device.mobile,
    pad: true,
    color: 'black',
    output: join(sourcesPath, `${id}.mp4`),
  });

  console.log(videoUrl);
})();
