import fs from 'fs';
import path from 'path';
import { Device, getDimensions, resizeVideo } from '.';
import metaData from '../../../contents/2022-04-07-funnycat/metadata.json';

(async () => {
  const outputPath = path.join(__dirname, '../../contents/2022-04-06/sources');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const inputDimensions = await Promise.all(
    metaData.map(async ({ videoUrl }) => {
      return await getDimensions(videoUrl);
    })
  );

  // Resize videos
  const resizePromises = metaData.map(async ({ id, videoUrl }) => {
    const output = path.join(outputPath, `${id}.mp4`);
    return await resizeVideo({ id, input: videoUrl, output, device: Device.mobile });
  });
  const videoPaths = await Promise.all(resizePromises);

  const outputDimensions = await Promise.all(
    videoPaths.map(async (videoUrl) => {
      return await getDimensions(videoUrl);
    })
  );
  console.log({
    inputDimensions,
    // videoPaths,
    // outputDimensions,
  });

  // // Test merge videos
  // const mergedOutput = path.join(outputPath, 'merged.mp4');
  // await mergeVideos(videoPaths, mergedOutput);
  // const mergedDimensions = await getDimensions(mergedOutput);
  // console.log(mergedDimensions);
})();
