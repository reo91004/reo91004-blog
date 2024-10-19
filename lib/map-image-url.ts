import { Block } from 'notion-types';
// import { defaultMapImageUrl } from 'react-notion-x';

import { defaultPageCover, defaultPageIcon } from './config';

const NOTION_DOMAIN = 'reo91004.notion.site';

/**
 * 이미지 URL을 매핑하는 함수
 * @param url 이미지의 원본 URL
 * @param block 이미지가 포함된 블록 정보
 * @returns 매핑된 이미지 URL
 */
export const mapImageUrl = (url: string, block: Block) => {
  // 기본 페이지 커버나 아이콘인 경우 원본 URL을 그대로 반환
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url;
  }

  try {
    // 이미지 URL을 encodeURIComponent로 인코딩하여 특수문자 처리
    const encodedImageUrl = encodeURIComponent(url);

    // 노션 이미지 프록시 URL 생성
    const notionImageUrl = `https://${NOTION_DOMAIN}/image/${encodedImageUrl}?table=block&id=${block.id}&cache=v2`;

    return notionImageUrl;
  } catch (error) {
    // URL 인코딩 중 오류가 발생하면 원본 URL을 반환
    console.error('이미지 URL 매핑 중 오류 발생:', error);
    return url;
  }
};
