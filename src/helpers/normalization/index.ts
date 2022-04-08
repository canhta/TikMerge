import { Hashtags, PostCollector } from 'tiktok-scraper';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  nickName: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  cover: string[] | string;
  author: Author;
}

export interface Metadata {
  views: number;
  likes: number;
  hashtags: Hashtags[];
  origins: VideoInfo[];
}
export const normalizeCollector = (collectors: PostCollector[]) => {
  const res = collectors.reduce(
    (acc: Metadata, collector) => {
      const author: Author = {
        id: collector.authorMeta.id,
        name: collector.authorMeta.name,
        avatar: collector.authorMeta.avatar,
        nickName: collector.authorMeta.nickName,
      };
      const videoInfo: VideoInfo = {
        id: collector.id,
        title: collector.text,
        cover: collector.covers.default,
        author,
      };
      const hashtags: Hashtags[] = collector.hashtags.map((hashtag) => {
        return {
          id: hashtag.id,
          name: hashtag.name,
          title: hashtag.title,
          cover: hashtag.cover,
        };
      });
      return {
        views: acc.views + collector.playCount,
        likes: acc.likes + collector.diggCount,
        hashtags: [...acc.hashtags, ...hashtags],
        origins: [...acc.origins, videoInfo],
      };
    },
    {
      views: 0,
      likes: 0,
      hashtags: [],
      origins: [],
    }
  );
  return res;
};

export const convertNumber = (num: number, fraction?: number) => {
  const unit = ['', 'K', 'M', 'B', 'T'];
  const index = Math.floor(Math.log10(num) / 3);
  return (num / Math.pow(10, index * 3)).toFixed(fraction || 2) + unit[index];
};

export const convertBytes = (kbs: number) => {
  const unit = ['KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log10(kbs) / 3);
  return (kbs / Math.pow(10, index * 3)).toFixed(2) + unit[index];
};
