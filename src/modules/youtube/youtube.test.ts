import { readFileSync } from 'fs';
import { join } from 'path';
import { uploadToYoutube } from '.';
import { uploadArgs } from '../../helpers/arguments';
import { createPaths } from '../../helpers/paths';

(async () => {
  const { hashtag, bannerId, title } = uploadArgs(process.argv.slice(2));
  const { bannerPath, videoFilePath, descriptionFilePath } = createPaths('contents', hashtag);

  const description = await readFileSync(descriptionFilePath, 'utf8');
  const thumbFilePath = join(bannerPath, `banner_${bannerId}.jpg`);
  console.log('Start upload');

  const response = await uploadToYoutube({
    title,
    description,
    thumbFilePath,
    videoFilePath,
    tags: [],
  });
  console.log(`Video uploaded: ${response}`);
})();
