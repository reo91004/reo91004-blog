import { NextRequest } from 'next/server';
import { host } from 'lib/config';
import { getSiteMap } from 'lib/get-site-map';
import type { SiteMap } from 'lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeChunk = async (chunk: string) => {
    await writer.write(encoder.encode(chunk));
  };

  // XML 헤더 작성
  await writeChunk(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}</loc>
  </url>
  <url>
    <loc>${host}/</loc>
  </url>`);

  try {
    const siteMap: SiteMap = await getSiteMap();

    for (const canonicalPagePath of Object.keys(siteMap.canonicalPageMap)) {
      await writeChunk(`
  <url>
    <loc>${host}/${encodeURIComponent(canonicalPagePath)}</loc>
  </url>`);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // XML 푸터 작성
  await writeChunk(`
</urlset>`);

  writer.close();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=28800, stale-while-revalidate=28800',
    },
  });
}
