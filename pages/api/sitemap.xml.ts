// pages/api/sitemap.xml.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { host } from 'lib/config';
import { getSiteMap } from 'lib/get-site-map';
import type { SiteMap } from 'lib/types';

let cachedSitemap: string | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8시간

const generateSitemap = (siteMap: SiteMap): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}</loc>
  </url>
  <url>
    <loc>${host}/</loc>
  </url>
  ${Object.keys(siteMap.canonicalPageMap)
    .map(canonicalPagePath =>
      `
      <url>
        <loc>${host}/${canonicalPagePath}</loc>
      </url>
    `.trim(),
    )
    .join('')}
</urlset>`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const now = Date.now();
    if (!cachedSitemap || !cacheTimestamp || now - cacheTimestamp > CACHE_DURATION) {
      const siteMap = await getSiteMap();
      cachedSitemap = generateSitemap(siteMap);
      cacheTimestamp = now;
    }

    // 캐시를 최대 8시간으로 설정
    res.setHeader('Cache-Control', 'public, max-age=28800, stale-while-revalidate=28800');
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(cachedSitemap);
  } catch (error) {
    console.error('Sitemap 생성 중 오류 발생:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
