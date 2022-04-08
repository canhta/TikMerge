import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PostCollector } from 'tiktok-scraper';
export const generateDescription = async (collectors: PostCollector[], outputPath: string, tags?: number) => {
  const hashtags = getHashtags(collectors, tags || 5);
  await writeFileSync(outputPath, `${hashtags.join(' ')}\n`);
  // Get the description from the default file
  const description = await readFileSync(join(__dirname, '../../configs/default-description.txt'), 'utf8');
  // Append the description to the file
  await appendFileSync(outputPath, description);
};

interface HashtagObject {
  [key: string]: {
    id: string;
    name: string;
    diggCount: number;
  };
}

export const getHashtags = (collectors: PostCollector[], size: number): string[] => {
  const hashtagObject = collectors.reduce((sorted: HashtagObject, { hashtags, diggCount }) => {
    hashtags.forEach(({ id, name }) => {
      if (sorted[id]) {
        sorted[id] = { ...sorted[id], diggCount: sorted[id].diggCount + diggCount };
      } else {
        sorted[id] = { id, name, diggCount };
      }
    });
    return sorted;
  }, {});

  return Object.keys(hashtagObject)
    .map((key) => {
      const { id, name, diggCount } = hashtagObject[key];
      return { id, name, diggCount };
    })
    .sort((a, b) => b.diggCount - a.diggCount)
    .slice(0, size)
    .map(({ name }) => `#${name}`);
};
