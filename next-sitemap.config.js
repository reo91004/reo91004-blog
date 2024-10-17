// next-sitemap.js
module.exports = {
  siteUrl: 'https://docs.reo91004.com', // 실제 도메인 주소로 변경
  generateRobotsTxt: true, // robots.txt 파일도 생성
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // 추가적인 정책이 필요하면 여기에 작성
    ],
    sitemap: 'https://docs.reo91004.com/sitemap.xml', // Sitemap 위치
  },
};
