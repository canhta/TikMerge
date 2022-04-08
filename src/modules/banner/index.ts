import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import { PostCollector } from 'tiktok-scraper';
import { getLogger } from '../../helpers/logger';

const getRandomItem = (arr: any[], acc: any[]): any => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  if (acc.includes(item)) {
    return getRandomItem(arr, acc);
  }
  return item;
};
const getRandomItems = (arr: any[], number: number) => {
  const randomItems: any[] = [];
  for (let i = 0; i < number; i++) {
    randomItems.push(getRandomItem(arr, randomItems));
  }
  return randomItems;
};

export interface IBanner {
  views: string;
  likes: string;
  coverUrls: string[];
  outputPath: string;
  width: number;
  height: number;
}

export const createBanner = async ({ views, likes, coverUrls, outputPath, width, height }: IBanner) => {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  const logger = getLogger('createBanner');
  // Load background images
  await Promise.all(
    coverUrls.map(async (url, index) => {
      const imageWidth = width / coverUrls.length;
      const image = await loadImage(url);
      context.drawImage(image, index * imageWidth, 0, imageWidth, height);
    })
  );
  // Load logo
  const logoSize = 200;
  const logo = await loadImage('src/assets/images/tiktok_logo.png');
  context.drawImage(logo, (width - logoSize) / 2, height / 2 - 120, logoSize, logoSize);

  // Draw stats
  const viewText = `${views} VIEWS`;
  const likeText = `${likes} LIKES`;
  context.font = 'bold 60pt Sans-Serif';
  context.textAlign = 'center';
  context.fillStyle = 'yellow';
  context.shadowColor = 'black';
  context.shadowBlur = 15;
  context.fillText(viewText, 320, 150);
  context.fillText(likeText, width - 320, height - 50);

  // Create image
  const imageBuffer = canvas.toBuffer('image/png');
  await fs.writeFileSync(outputPath, imageBuffer);
  logger.info(`Created banner ${outputPath}`);
};

interface IBannerOptions {
  number: number;
  views: string;
  likes: string;
  collectors: PostCollector[];
  mainPath: string;
  width: number;
  height: number;
}
export const createBanners = async ({ number = 1, collectors, mainPath, ...rest }: IBannerOptions) => {
  const logger = getLogger('createBanners');
  const promises = [];
  const covers = collectors.map((item) => item.covers.origin);
  for (let i = 0; i < number; i++) {
    const coverUrls = getRandomItems(covers, 3);
    promises.push(
      createBanner({
        ...rest,
        coverUrls,
        outputPath: `${mainPath}/banner_${i + 1}.jpg`,
      })
    );
  }
  return await Promise.all(promises)
    .then(() => {
      logger.info(`Created ${number} banners`);
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};
