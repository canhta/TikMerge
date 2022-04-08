import { filter } from '.';
const metaData = require('../../contents/2022-04-06/metadata.json');
(async () => {
  // const collectors = await scraper(ETypes.hashtag, 10, 'gaixinh');
  // console.log(collectors);

  console.log(metaData.map(({ videoMeta }: any) => videoMeta));
  const collectors = filter(metaData, 5);
  console.log(collectors.map(({ videoMeta }) => videoMeta));
})();
