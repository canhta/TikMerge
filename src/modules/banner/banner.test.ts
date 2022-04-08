import path from 'path';
import { createBanners } from '.';
import collectors from '../../../contents/2022-04-07-funnycat/metadata.json';

(async () => {
  await createBanners({
    collectors,
    height: 1080,
    width: 1920,
    likes: '435M',
    views: '392B',
    mainPath: path.join(__dirname, '../../contents/2022-04-07-funnycat/banners'),
    number: 30,
  });
})();
