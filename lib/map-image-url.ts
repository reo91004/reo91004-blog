import { Block } from 'notion-types';
import { defaultMapImageUrl } from 'react-notion-x';
import { defaultPageIcon, defaultPageCover } from './config';

export const mapImageUrl = (url: string, block: Block) => {
  if (!url) return '';

  if (url === defaultPageCover || url === defaultPageIcon) {
    return url;
  }

  // Encode the URL for Notion's caching mechanism
  const encodedUrl = encodeURIComponent(url);
  const id = block?.id;
  return `https://reo91004.notion.site/image/${encodedUrl}?table=block&id=${id}&cache=v2`;
};
