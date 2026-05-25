// ============================================================
// KEYWORD NEWS - RSS proxy server
//
// API key 없이 공개 RSS 피드를 모아 키워드 뉴스로 정규화합니다.
// 브라우저에서 http://localhost:3001 을 열면 앱과 RSS API를 함께 사용할 수 있습니다.
// ============================================================

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 10 * 60 * 1000);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DEFAULT_NEWS_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80';

const RSS_SOURCES = [
  { name: '연합뉴스', url: 'https://www.yna.co.kr/rss/news.xml' },
  { name: '조선일보', url: 'https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml' },
  { name: '조선일보 경제', url: 'https://www.chosun.com/arc/outboundfeeds/rss/category/economy/?outputType=xml' },
  { name: '조선일보 사회', url: 'https://www.chosun.com/arc/outboundfeeds/rss/category/national/?outputType=xml' },
  { name: '뉴시스 속보', url: 'https://www.newsis.com/RSS/sokbo.xml' },
  { name: '뉴시스 경제', url: 'https://www.newsis.com/RSS/economy.xml' },
  { name: '뉴시스 사회', url: 'https://www.newsis.com/RSS/society.xml' },
  { name: '뉴시스 수도권', url: 'https://www.newsis.com/RSS/met.xml' },
  { name: '한겨레', url: 'https://www.hani.co.kr/rss' },
  { name: '경향신문', url: 'https://www.khan.co.kr/rss/rssdata/total_news.xml' },
  { name: '뉴스1', url: 'https://www.news1.kr/rss/articles?type=popular' },
  { name: '전자신문', url: 'https://www.etnews.com/rss/news.xml' },
  { name: 'ZDNet Korea', url: 'https://feeds.feedburner.com/zdkorea' },
  { name: '디지털데일리', url: 'https://www.ddaily.co.kr/rss/S1N1.xml' },
  { name: '매일경제', url: 'https://www.mk.co.kr/rss/30000001/' },
  { name: '매일경제 전체', url: 'https://www.mk.co.kr/rss/40300001/' },
  { name: '매일경제 부동산', url: 'https://www.mk.co.kr/rss/50300009/' },
  { name: '매일경제 스포츠', url: 'https://www.mk.co.kr/rss/71000001/' },
  { name: '한국경제', url: 'https://www.hankyung.com/feed/all-news' },
  { name: '블록미디어', url: 'https://www.blockmedia.co.kr/feed' },
  { name: '토큰포스트', url: 'https://www.tokenpost.kr/rss' },
  { name: '코인데스크코리아', url: 'https://www.coindeskkorea.com/feed' },
];

const KEYWORD_ALIASES = {
  '애플': ['apple', '아이폰', 'iphone', '아이패드', 'ipad', '맥북', 'macbook', '비전프로', 'vision pro', '앱스토어', 'app store', 'wwdc', 'aapl', '팀쿡', '팀 쿡'],
  'apple': ['애플', '아이폰', 'iphone', '아이패드', 'ipad', '맥북', 'macbook', '비전프로', 'vision pro', '앱스토어', 'app store', 'wwdc', 'aapl', 'tim cook'],
  '삼성전자': ['삼성', 'galaxy', '갤럭시', '반도체', 'hbm', '파운드리', 'ds부문', '005930'],
  '삼성': ['삼성전자', 'galaxy', '갤럭시', '반도체', 'hbm', '파운드리'],
  'sk하이닉스': ['하이닉스', 'sk hynix', 'hynix', 'hbm', '반도체', '000660'],
  '하이닉스': ['sk하이닉스', 'sk hynix', 'hynix', 'hbm', '반도체'],
  '엔비디아': ['nvidia', 'nvda', '젠슨황', '젠슨 황', 'gpu', 'blackwell', '블랙웰', 'ai칩', 'ai chip'],
  'nvidia': ['엔비디아', 'nvda', 'jensen huang', 'gpu', 'blackwell', '블랙웰'],
  '테슬라': ['tesla', 'tsla', '일론머스크', '일론 머스크', 'ev', '전기차', 'model y', '모델y'],
  'tesla': ['테슬라', 'tsla', 'elon musk', 'ev', '전기차'],
  '구글': ['google', '알파벳', 'alphabet', 'gemini', '제미나이', 'android', '안드로이드', 'googl', 'goog'],
  'google': ['구글', '알파벳', 'alphabet', 'gemini', '제미나이', 'android', '안드로이드'],
  '마이크로소프트': ['microsoft', 'msft', '오픈ai', 'openai', 'azure', '애저', 'copilot', '코파일럿'],
  'microsoft': ['마이크로소프트', 'msft', 'openai', 'azure', 'copilot', '코파일럿'],
  '아마존': ['amazon', 'amzn', 'aws', '앤디재시', '앤디 재시'],
  'amazon': ['아마존', 'amzn', 'aws'],
  '메타': ['meta', 'facebook', '페이스북', 'instagram', '인스타그램', 'threads', '스레드', 'mark zuckerberg', '저커버그'],
  'meta': ['메타', 'facebook', '페이스북', 'instagram', '인스타그램', 'threads', '스레드'],
  '카카오': ['kakao', '카카오톡', '카톡', '카카오페이', '카카오뱅크'],
  '네이버': ['naver', '라인', 'line', '웹툰', '클로바', '하이퍼클로바'],
  '현대차': ['현대자동차', 'hyundai', '현대차그룹', '기아', 'kia', '전기차', '아이오닉', '제네시스'],
  'ai': ['인공지능', '생성형ai', '생성 ai', 'llm', '챗봇', '반도체', 'gpu'],
  '인공지능': ['ai', '생성형ai', '생성 ai', 'llm', '챗봇'],
  '토지거래허가제': ['토허제', '토지거래 허가제', '토지거래허가구역', '토지거래 허가구역', '토지거래허가'],
  '토허제': ['토지거래허가제', '토지거래 허가제', '토지거래허가구역', '토지거래 허가구역'],
  '비트코인': ['bitcoin', 'btc', '가상자산', '암호화폐', '코인', '디지털자산'],
  'bitcoin': ['비트코인', 'btc', 'crypto', 'cryptocurrency'],
  'btc': ['비트코인', 'bitcoin', '가상자산', '암호화폐'],
  '야구': ['kbo', '프로야구', 'baseball'],
  'kbo': ['야구', '프로야구', 'baseball'],
};

const cache = new Map();
const imageCache = new Map();

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'GET 요청만 지원합니다.' });

  const requestUrl = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);

  if (requestUrl.pathname === '/api/news') {
    await handleNews(requestUrl, res);
    return;
  }

  if (requestUrl.pathname === '/api/sources') {
    sendJson(res, 200, { sources: RSS_SOURCES.map(({ name, url }) => ({ name, url })) });
    return;
  }

  if (requestUrl.pathname === '/health') {
    sendJson(res, 200, { status: 'ok', time: new Date().toISOString() });
    return;
  }

  serveStatic(requestUrl, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Keyword News RSS proxy: http://localhost:${PORT}`);
  console.log(`News API: http://localhost:${PORT}/api/news?q=삼성전자`);
  console.log(`App: http://localhost:${PORT}`);
  getLanAddresses().forEach((address) => {
    console.log(`LAN App: http://${address}:${PORT}`);
  });
});

async function handleNews(requestUrl, res) {
  const keyword = String(requestUrl.searchParams.get('q') || '').trim();
  const display = requestUrl.searchParams.get('display') || 20;
  const excludeTerms = parseTerms(requestUrl.searchParams.get('exclude') || '');
  if (!keyword) return sendJson(res, 400, { error: 'q(검색어) 파라미터가 필요합니다.' });

  try {
    const allItems = await loadAllFeeds();
    const queryGroups = buildKeywordGroups(keyword);
    const displayCount = Math.min(Number(display) || 20, 50);
    let matchedAll = filterAndRankItems(allItems, queryGroups, excludeTerms);

    if (matchedAll.length < displayCount) {
      const fallbackItems = await loadGoogleNewsFallback(keyword);
      const fallbackMatched = filterAndRankItems(fallbackItems, queryGroups, excludeTerms);
      matchedAll = mergeRankedItems([...matchedAll, ...fallbackMatched]);
    }

    const visibleItems = matchedAll.slice(0, displayCount);
    const matched = await Promise.all(visibleItems.map(async (item, i) => ({
        id: stableId(item.url || item.title || `${keyword}_${i}`),
        title: item.title,
        source: item.source,
        time: formatRelativeTime(item.pubDate),
        pubDate: item.pubDate,
        url: item.url,
        link: item.url,
        breaking: i === 0 && isRecent(item.pubDate),
        read: false,
        image: item.image || await fetchArticleImage(item.url) || DEFAULT_NEWS_IMAGE,
        summary: item.summary || '기사를 클릭해 원문을 확인하세요.',
        related: buildRelatedItems(item, matchedAll),
      })));

    sendJson(res, 200, {
      total: matched.length,
      sourceType: 'rss',
      queryTerms: queryGroups.flat(),
      updatedAt: new Date().toISOString(),
      items: matched,
    });
  } catch (err) {
    console.error('RSS fetch error:', err);
    sendJson(res, 500, { error: 'RSS 뉴스를 가져오는 중 오류가 발생했습니다.' });
  }
}

function filterAndRankItems(items, queryGroups, excludeTerms) {
  const excludeGroups = excludeTerms.flatMap((term) => buildKeywordGroups(term));
  return items
      .map((item) => ({ item, score: scoreKeywordMatch(item, queryGroups) }))
      .filter(({ score }) => score > 0)
      .map(({ item, score }) => ({ ...item, matchScore: score }))
      .filter((item) => !scoreKeywordMatch(item, excludeGroups))
      .sort((a, b) => b.matchScore - a.matchScore || new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

function mergeRankedItems(items) {
  const seen = new Set();
  return items
    .filter((item) => {
      const key = item.url || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0) || new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

function parseTerms(value) {
  return String(value || '').split(/[\n,]/).map(term => term.trim()).filter(Boolean);
}

function buildKeywordGroups(keyword) {
  const normalizedKeyword = normalizeSearchText(keyword);
  const tokens = normalizedKeyword.split(/\s+/).filter(Boolean);
  const groups = [];

  if (normalizedKeyword) groups.push(expandTerm(normalizedKeyword));
  tokens.forEach((token) => {
    const group = expandTerm(token);
    if (!groups.some((existing) => existing.join('|') === group.join('|'))) groups.push(group);
  });

  return groups.length ? groups : [[normalizedKeyword]];
}

function expandTerm(term) {
  const normalized = normalizeSearchText(term);
  const aliases = KEYWORD_ALIASES[normalized] || [];
  return [...new Set([normalized, ...aliases.map(normalizeSearchText)].filter(Boolean))];
}

function buildRelatedItems(currentItem, candidates) {
  return candidates
    .filter((item) => item.url !== currentItem.url)
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      url: item.url,
      source: item.source,
      time: formatRelativeTime(item.pubDate),
    }));
}

async function loadAllFeeds() {
  const results = await Promise.allSettled(RSS_SOURCES.map(loadFeed));
  const seen = new Set();
  return results
    .flatMap((result) => result.status === 'fulfilled' ? result.value : [])
    .filter((item) => {
      const key = item.url || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function loadGoogleNewsFallback(keyword) {
  const url = new URL('https://news.google.com/rss/search');
  url.searchParams.set('q', keyword);
  url.searchParams.set('hl', 'ko');
  url.searchParams.set('gl', 'KR');
  url.searchParams.set('ceid', 'KR:ko');
  try {
    const xml = await fetchText(url.toString());
    return parseFeed(xml, { name: 'Google 뉴스 검색', url: url.toString() })
      .filter((item) => /[가-힣]/.test(`${item.title} ${item.summary}`));
  } catch (err) {
    console.warn('Google News fallback failed:', err.message);
    return [];
  }
}

function getLanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((info) => info && info.family === 'IPv4' && !info.internal)
    .map((info) => info.address);
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  if (statusCode === 204) {
    res.end();
    return;
  }
  res.end(JSON.stringify(data));
}

function serveStatic(requestUrl, res) {
  const pathname = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType(filePath),
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}

async function loadFeed(source) {
  const cached = cache.get(source.url);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.items;

  const xml = await fetchText(source.url, source.name);
  const items = parseFeed(xml, source);
  cache.set(source.url, { fetchedAt: Date.now(), items });
  return items;
}

async function fetchText(url, label = 'RSS') {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      'User-Agent': 'KeywordNews/1.0 (+local RSS reader)',
    },
  });
  if (!response.ok) throw new Error(`${label} fetch error ${response.status}`);
  return response.text();
}

function parseFeed(xml, source) {
  const entries = matchBlocks(xml, 'item');
  const atomEntries = entries.length ? [] : matchBlocks(xml, 'entry');
  const blocks = entries.length ? entries : atomEntries;

  return blocks.map((block) => {
    const title = decodeEntities(stripTags(readTag(block, 'title')));
    const rawLink = readTag(block, 'link') || readAttr(block, 'link', 'href');
    const url = normalizeUrl(decodeEntities(stripCdata(rawLink)));
    const rawSummary =
      readTag(block, 'description') ||
      readTag(block, 'summary') ||
      readTag(block, 'content:encoded');
    const summary = decodeEntities(stripTags(rawSummary));
    const pubDate = readTag(block, 'pubDate') || readTag(block, 'published') || readTag(block, 'updated') || '';
    const image = extractImage(block, rawSummary);

    const itemSource = decodeEntities(stripTags(readTag(block, 'source'))) || source.name;

    return {
      title: title || '(제목 없음)',
      source: itemSource,
      pubDate,
      url,
      image,
      summary: trimText(summary, 180),
      searchable: normalizeSearchText(`${title} ${summary} ${source.name}`),
    };
  }).filter((item) => item.url && item.title);
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[·ㆍ]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreKeywordMatch(item, groups) {
  const haystack = item.searchable || '';
  let score = 0;
  for (const group of groups) {
    const matchedTerms = group.filter((term) => hasSearchTerm(haystack, term));
    if (!matchedTerms.length) continue;
    score += matchedTerms.some((term) => term === group[0]) ? 4 : 2;
    score += Math.min(matchedTerms.length - 1, 3);
  }
  return score;
}

function matchesAnyKeyword(item, terms) {
  if (!terms.length) return false;
  const haystack = item.searchable || '';
  return terms.some((term) => hasSearchTerm(haystack, normalizeSearchText(term)));
}

function hasSearchTerm(haystack, term) {
  if (!term) return false;
  if (term === '애플') {
    return /(^|[^\p{L}\p{N}])애플($|[^\p{L}\p{N}]|은|는|이|가|을|를|의|과|와|도|로|에|에서|보다|처럼)/u.test(haystack);
  }
  return haystack.includes(term);
}

async function fetchArticleImage(url) {
  if (!url) return null;
  const cached = imageCache.get(url);
  if (cached && Date.now() - cached.fetchedAt < 24 * 60 * 60 * 1000) return cached.image;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'KeywordNews/1.0 (+local RSS reader)',
      },
    });
    if (!response.ok) return null;
    const html = await response.text();
    const image = extractMetaImage(html, url);
    imageCache.set(url, { fetchedAt: Date.now(), image });
    return image;
  } catch {
    imageCache.set(url, { fetchedAt: Date.now(), image: null });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractMetaImage(html, baseUrl) {
  const candidates = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i,
  ];
  for (const re of candidates) {
    const match = String(html || '').match(re);
    if (match?.[1]) {
      try {
        return new URL(decodeEntities(match[1]), baseUrl).toString();
      } catch {
        return decodeEntities(match[1]);
      }
    }
  }
  return null;
}

function matchBlocks(xml, tagName) {
  const re = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, 'gi');
  return xml.match(re) || [];
}

function readTag(block, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = block.match(re);
  return match ? stripCdata(match[1]).trim() : '';
}

function readAttr(block, tagName, attrName) {
  const re = new RegExp(`<${tagName}\\b[^>]*\\s${attrName}=["']([^"']+)["'][^>]*>`, 'i');
  const match = block.match(re);
  return match ? match[1].trim() : '';
}

function extractImage(block, summary) {
  const mediaUrl = readAttr(block, 'media:content', 'url') || readAttr(block, 'media:thumbnail', 'url');
  if (mediaUrl) return decodeEntities(mediaUrl);
  const enclosureType = readAttr(block, 'enclosure', 'type');
  const enclosureUrl = readAttr(block, 'enclosure', 'url');
  if (enclosureUrl && /^image\//.test(enclosureType)) return decodeEntities(enclosureUrl);
  const imgMatch = String(summary || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? decodeEntities(imgMatch[1]) : null;
}

function stripCdata(value) {
  return String(value || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function stripTags(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .trim();
}

function normalizeUrl(url) {
  const cleaned = String(url || '').trim();
  if (!cleaned) return '';
  try {
    return new URL(cleaned).toString();
  } catch {
    return cleaned;
  }
}

function trimText(text, maxLength) {
  const cleaned = String(text || '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}...`;
}

function stableId(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return `rss_${Math.abs(hash)}`;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (!Number.isFinite(diff)) return '';
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  } catch {
    return dateStr;
  }
}

function isRecent(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 60 * 60 * 1000;
  } catch {
    return false;
  }
}
