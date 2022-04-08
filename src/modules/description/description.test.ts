import { join } from 'path';
import { generateDescription } from '.';
import metaData from '../../../contents/2022-04-07-funnycat/metadata.json';

(async () => {
  const outputPath = join(__dirname, '../../contents/2022-04-06/description.txt');
  await generateDescription(metaData, outputPath);
  console.log('Done');
})();
