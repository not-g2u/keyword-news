/* ============================================================
   KEYWORD NEWS — app.js
   ============================================================ */

'use strict';

// ── Constants ──
const COLORS = ['#1a5cff','#1a9e6e','#d85a20','#9b3580','#b86e00','#2a7fa8','#6c4fd6'];
const SAMPLE_THUMB = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=80';
const DEFAULT_PROXY_URL = '/api/news';
const CLIENT_EXCLUDE_ALIASES = {
  '야구': ['kbo', '프로야구', 'baseball'],
  'kbo': ['야구', '프로야구', 'baseball'],
  '비트코인': ['bitcoin', 'btc', '가상자산', '암호화폐', '코인'],
  'bitcoin': ['비트코인', 'btc', '가상자산', '암호화폐'],
  'btc': ['비트코인', 'bitcoin', '가상자산', '암호화폐'],
  '토지거래허가제': ['토허제', '토지거래 허가제', '토지거래허가구역', '토지거래 허가구역'],
  '토허제': ['토지거래허가제', '토지거래 허가제', '토지거래허가구역', '토지거래 허가구역']
};

// ── Sample news data (used when API is not configured) ──
const SAMPLE_NEWS = {
  '삼성전자': [
    {
      id: 'se1', title: '삼성전자, 3나노 GAA 공정 수율 획기적 개선…TSMC 추격 본격화',
      source: '한국경제', time: '12분 전', url: 'https://www.hankyung.com',
      breaking: true, read: false,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
      summary: '삼성전자가 3나노 GAA 공정의 수율을 대폭 향상시키며 TSMC와의 격차를 빠르게 좁히고 있습니다. 업계에서는 내년 상반기 내 본격 양산이 가능할 것으로 전망하고 있습니다.',
      related: [
        { title: '삼성 파운드리 수주 현황 분석', url: 'https://www.hankyung.com' },
        { title: 'TSMC vs 삼성 3나노 공정 비교', url: 'https://zdnet.co.kr' },
        { title: 'GAA 공정 기술이란 무엇인가', url: 'https://etnews.com' }
      ]
    },
    {
      id: 'se2', title: '삼성전자 2분기 영업이익 전망치 상향…반도체 업황 회복 신호',
      source: '조선비즈', time: '1시간 전', url: 'https://biz.chosun.com',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80',
      summary: '주요 증권사들이 삼성전자의 2분기 영업이익 전망치를 일제히 상향 조정했습니다. HBM 공급 증가와 모바일 사업부 회복이 주요 원인으로 분석됩니다.',
      related: [
        { title: 'HBM 시장 동향과 삼성의 전략', url: 'https://biz.chosun.com' },
        { title: '반도체 업황 2025년 하반기 전망', url: 'https://www.sedaily.com' }
      ]
    },
    {
      id: 'se3', title: '삼성전자, 차세대 갤럭시 AI 기능 대폭 강화 예고',
      source: '전자신문', time: '3시간 전', url: 'https://etnews.com',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80',
      summary: '삼성전자가 하반기 출시 예정인 갤럭시 신제품에 온디바이스 AI 기능을 대폭 강화한다고 밝혔습니다. 생성형 AI 기반의 통화 요약, 실시간 번역 기능이 탑재될 예정입니다.',
      related: [
        { title: '갤럭시 S26 스펙 유출 총정리', url: 'https://etnews.com' },
        { title: '온디바이스 AI 경쟁 현황', url: 'https://zdnet.co.kr' }
      ]
    }
  ],
  'AI 반도체': [
    {
      id: 'ai1', title: '엔비디아 블랙웰 울트라 공개…AI 학습 속도 5배 향상',
      source: 'ZDNet Korea', time: '방금 전', url: 'https://zdnet.co.kr',
      breaking: true, read: false,
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=700&q=80',
      summary: '엔비디아가 차세대 데이터센터용 GPU인 블랙웰 울트라를 공개했습니다. 전작 대비 AI 학습 속도가 5배 빨라졌으며 에너지 효율도 크게 개선됐습니다.',
      related: [
        { title: 'AMD MI400 대응 전략은?', url: 'https://zdnet.co.kr' },
        { title: 'AI 칩 시장 점유율 2025', url: 'https://www.etnews.com' },
        { title: '국내 데이터센터 GPU 수요 현황', url: 'https://www.ddaily.co.kr' }
      ]
    },
    {
      id: 'ai2', title: '리벨리온, 글로벌 빅테크와 AI 반도체 공급 계약 체결',
      source: '매일경제', time: '45분 전', url: 'https://www.mk.co.kr',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&q=80',
      summary: '국내 AI 반도체 설계 전문 스타트업 리벨리온이 글로벌 빅테크 기업과 대규모 공급 계약을 체결했다고 발표했습니다. 이번 계약으로 회사 가치가 2조원을 넘어섰습니다.',
      related: [
        { title: '리벨리온 기업 가치 분석', url: 'https://www.mk.co.kr' },
        { title: '국내 팹리스 반도체 현황', url: 'https://www.etnews.com' }
      ]
    },
    {
      id: 'ai3', title: 'HBM4 주도권 경쟁…SK하이닉스 vs 삼성전자 격돌',
      source: '디지털타임스', time: '2시간 전', url: 'https://www.dt.co.kr',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=700&q=80',
      summary: '차세대 AI 반도체 핵심 부품인 HBM4 개발 경쟁이 치열해지고 있습니다. SK하이닉스가 선두를 유지하고 있으나 삼성전자의 추격이 거세지고 있습니다.',
      related: [
        { title: 'HBM 기술 로드맵 2025-2027', url: 'https://www.dt.co.kr' },
        { title: 'SK하이닉스 HBM 실적 전망', url: 'https://www.hankyung.com' }
      ]
    }
  ],
  '카카오': [
    {
      id: 'kk1', title: '카카오, AI 플랫폼 재편…카카오톡 AI 비서 하반기 출시',
      source: 'IT조선', time: '30분 전', url: 'https://it.chosun.com',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80',
      summary: '카카오가 AI 전략을 전면 재편하고 카카오톡에 AI 비서 기능을 탑재한 업데이트를 하반기 출시할 예정입니다. 네이버와의 AI 플랫폼 경쟁이 본격화될 전망입니다.',
      related: [
        { title: '카카오 AI 전략 전면 재검토', url: 'https://it.chosun.com' },
        { title: '네이버 클로바 vs 카카오 AI 비교', url: 'https://zdnet.co.kr' }
      ]
    },
    {
      id: 'kk2', title: '카카오페이, 해외 결제 수수료 대폭 인하…글로벌 시장 공략',
      source: '연합뉴스', time: '2시간 전', url: 'https://www.yna.co.kr',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=700&q=80',
      summary: '카카오페이가 해외 결제 수수료를 현행 대비 최대 70% 인하한다고 발표했습니다. 해외 여행 수요 증가와 함께 글로벌 결제 시장 공략에 속도를 내고 있습니다.',
      related: [
        { title: '간편결제 해외 수수료 비교', url: 'https://www.yna.co.kr' },
        { title: '카카오페이 2025 사업 전략', url: 'https://www.mk.co.kr' }
      ]
    }
  ],
  '현대차': [
    {
      id: 'hd1', title: '현대차, 美 전기차 시장 점유율 3위 달성…테슬라 추격 가속',
      source: '헤럴드경제', time: '20분 전', url: 'https://www.heraldcorp.com',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=700&q=80',
      summary: '현대자동차그룹이 미국 전기차 시장에서 점유율 3위를 기록했습니다. 아이오닉 시리즈의 인기와 조지아 현지 생산 확대가 주효했습니다.',
      related: [
        { title: '아이오닉6/9 미국 판매 현황', url: 'https://www.heraldcorp.com' },
        { title: '미국 EV 보조금 정책 변화', url: 'https://www.hankyung.com' },
        { title: '현대차 미래 전기차 라인업', url: 'https://www.autodaily.co.kr' }
      ]
    },
    {
      id: 'hd2', title: '현대차그룹, 보스턴다이내믹스 차세대 산업용 로봇 공개',
      source: '뉴시스', time: '2시간 전', url: 'https://www.newsis.com',
      breaking: false, read: false,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80',
      summary: '현대차그룹이 보스턴다이내믹스를 통해 차세대 산업용 로봇 아틀라스 2세대를 공개했습니다. 현대차 울산 공장에 우선 도입될 예정입니다.',
      related: [
        { title: '보스턴다이내믹스 로봇 기술 현황', url: 'https://www.newsis.com' },
        { title: '자동차 공장 자동화 트렌드', url: 'https://www.etnews.com' }
      ]
    }
  ]
};

// ── State ──
let currentUser = null;
let keywords = [];
let activeKeyword = null;
let activeNews = [];
let keywordNewsCache = [];
let expandedId = null;
let scrapped = new Set();
let apiSettings = { type: 'proxy', proxyUrl: DEFAULT_PROXY_URL, naverClientId: '', naverClientSecret: '' };
let excludedKeywords = [];
let viewMode = 'keyword';
let shareTarget = null;
let nextKwId = 100;

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  const saved = localStorage.getItem('kn_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    initApp();
  } else {
    document.getElementById('authOverlay').style.display = 'flex';
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

function loadTheme() {
  const t = localStorage.getItem('kn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  updateThemeIcon(t);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('kn_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (theme === 'dark') {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  } else {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}

// ── Auth ──
function switchAuth(mode) {
  document.getElementById('authLogin').style.display = mode === 'login' ? '' : 'none';
  document.getElementById('authSignup').style.display = mode === 'signup' ? '' : 'none';
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPw').value;
  const err = document.getElementById('loginError');
  if (!email || !pw) { err.textContent = '이메일과 비밀번호를 입력해 주세요.'; return; }
  const users = JSON.parse(localStorage.getItem('kn_users') || '{}');
  if (!users[email]) { err.textContent = '등록되지 않은 이메일입니다.'; return; }
  if (users[email].pw !== btoa(pw)) { err.textContent = '비밀번호가 올바르지 않습니다.'; return; }
  err.textContent = '';
  currentUser = { email, name: users[email].name };
  localStorage.setItem('kn_user', JSON.stringify(currentUser));
  initApp();
}

function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pw = document.getElementById('signupPw').value;
  const err = document.getElementById('signupError');
  if (!name || !email || !pw) { err.textContent = '모든 항목을 입력해 주세요.'; return; }
  if (pw.length < 8) { err.textContent = '비밀번호는 8자 이상이어야 합니다.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = '유효한 이메일 주소를 입력해 주세요.'; return; }
  const users = JSON.parse(localStorage.getItem('kn_users') || '{}');
  if (users[email]) { err.textContent = '이미 사용 중인 이메일입니다.'; return; }
  users[email] = { name, pw: btoa(pw) };
  localStorage.setItem('kn_users', JSON.stringify(users));
  err.textContent = '';
  currentUser = { email, name };
  localStorage.setItem('kn_user', JSON.stringify(currentUser));
  initApp();
}

function doGuest() {
  currentUser = { email: '', name: '게스트' };
  initApp();
}

function doLogout() {
  localStorage.removeItem('kn_user');
  currentUser = null;
  activeKeyword = null;
  closeSettings();
  document.getElementById('app').style.display = 'none';
  document.getElementById('authOverlay').style.display = 'flex';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPw').value = '';
  document.getElementById('loginError').textContent = '';
  switchAuth('login');
}

// ── App Init ──
function initApp() {
  document.getElementById('authOverlay').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // Load user data
  const key = 'kn_data_' + (currentUser.email || 'guest');
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved) {
    keywords = saved.keywords || [];
    scrapped = new Set(saved.scrapped || []);
    apiSettings = normalizeApiSettings(saved.apiSettings);
    excludedKeywords = normalizeKeywordList(saved.excludedKeywords || []);
  } else {
    keywords = [
      { id: 1, name: '삼성전자', color: COLORS[0], unread: 3 },
      { id: 2, name: 'AI 반도체', color: COLORS[1], unread: 5 },
      { id: 3, name: '카카오', color: COLORS[2], unread: 2 },
      { id: 4, name: '현대차', color: COLORS[3], unread: 2 },
    ];
    apiSettings = normalizeApiSettings(null);
    excludedKeywords = [];
  }

  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userEmail').textContent = currentUser.email || '게스트 모드';
  document.getElementById('userAvatar').textContent = (currentUser.name || 'G')[0].toUpperCase();

  renderKeywords();
}

function normalizeApiSettings(settings) {
  return {
    type: 'proxy',
    proxyUrl: DEFAULT_PROXY_URL,
    naverClientId: settings?.naverClientId || '',
    naverClientSecret: settings?.naverClientSecret || ''
  };
}

function normalizeKeywordList(value) {
  const raw = Array.isArray(value) ? value : String(value || '').split(/[\n,]/);
  return [...new Set(raw.map(item => item.trim()).filter(Boolean))];
}

function saveUserData() {
  if (!currentUser) return;
  const key = 'kn_data_' + (currentUser.email || 'guest');
  localStorage.setItem(key, JSON.stringify({
    keywords,
    scrapped: [...scrapped],
    apiSettings,
    excludedKeywords
  }));
}

// ── Keywords ──
function renderKeywords() {
  const list = document.getElementById('keywordList');
  list.innerHTML = '';
  keywords.forEach(kw => {
    const item = document.createElement('div');
    item.className = 'kw-item' + (activeKeyword && activeKeyword.id === kw.id ? ' active' : '');
    item.innerHTML = `
      <div class="kw-dot" style="background:${kw.color}"></div>
      <span class="kw-name">${esc(kw.name)}</span>
      <span class="kw-badge ${kw.unread === 0 ? 'zero' : ''}">${kw.unread}</span>
      <button class="kw-del" onclick="deleteKeyword(event,${kw.id})" title="키워드 삭제" aria-label="${esc(kw.name)} 삭제">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;
    item.addEventListener('click', () => selectKeyword(kw));
    list.appendChild(item);
  });
}

function addKeyword() {
  const input = document.getElementById('newKwInput');
  const name = input.value.trim();
  if (!name) return;
  if (keywords.find(k => k.name === name)) { showToast('이미 등록된 키워드입니다.'); return; }
  const color = COLORS[nextKwId % COLORS.length];
  const kw = { id: nextKwId++, name, color, unread: 0 };
  keywords.push(kw);
  input.value = '';
  renderKeywords();
  saveUserData();
  selectKeyword(kw);
}

function deleteKeyword(e, id) {
  e.stopPropagation();
  const kw = keywords.find(k => k.id === id);
  if (!kw) return;
  if (!confirm(`"${kw.name}" 키워드를 삭제하시겠습니까?`)) return;
  keywords = keywords.filter(k => k.id !== id);
  if (activeKeyword && activeKeyword.id === id) {
    activeKeyword = null;
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('mainEmpty').style.display = 'flex';
  }
  renderKeywords();
  saveUserData();
}

function selectKeyword(kw) {
  activeKeyword = kw;
  expandedId = null;
  viewMode = 'keyword';
  renderKeywords();
  document.getElementById('mainEmpty').style.display = 'none';
  document.getElementById('mainContent').style.display = 'flex';
  document.getElementById('mainContent').style.flexDirection = 'column';
  document.getElementById('activeKwBadge').textContent = '#' + kw.name;
  setRecommendationButtonActive(false);
  loadNews(kw);
}

// ── News Loading ──
async function loadNews(kw) {
  const bar = document.getElementById('loadingBar');
  bar.style.display = 'block';
  document.getElementById('newsList').innerHTML = '';

  let articles = [];
  try {
    if (apiSettings.type === 'proxy' && apiSettings.proxyUrl) {
      articles = await fetchFromProxy(kw.name);
      document.getElementById('apiWarning').style.display = 'none';
    } else if (apiSettings.type === 'naver' && apiSettings.naverClientId) {
      articles = await fetchFromNaver(kw.name);
      document.getElementById('apiWarning').style.display = 'none';
    } else {
      articles = (SAMPLE_NEWS[kw.name] || []).map(a => ({...a, read: a.read || false}));
      document.getElementById('apiWarning').style.display = 'flex';
    }
  } catch (err) {
    console.error('News fetch error:', err);
    articles = (SAMPLE_NEWS[kw.name] || []).map(a => ({...a}));
    document.getElementById('apiWarning').style.display = 'flex';
    document.querySelector('#apiWarning span').innerHTML = 'RSS 프록시 서버에 연결하지 못해 샘플 데이터를 표시합니다. 서버를 실행한 뒤 같은 PC는 <b>localhost:3001</b>, 다른 PC는 <b>서버IP:3001</b>로 접속하세요.';
  }

  // Restore read state from localStorage
  const readKey = 'kn_read_' + (currentUser?.email || 'guest') + '_' + kw.name;
  const readIds = new Set(JSON.parse(localStorage.getItem(readKey) || '[]'));
  articles.forEach(a => { if (readIds.has(a.id)) a.read = true; });

  activeNews = articles;
  keywordNewsCache = articles;
  kw.unread = articles.filter(a => !a.read).length;
  bar.style.display = 'none';
  renderNews();
  updateCountLabel();
  renderKeywords();
}

function showRecommendations() {
  if (!currentUser?.email) {
    showToast('추천 기사는 로그인 또는 회원가입 후 사용할 수 있습니다.');
    return;
  }
  const recommendations = getRecommendedArticles();
  viewMode = 'recommendations';
  expandedId = null;
  activeNews = recommendations;
  document.getElementById('mainEmpty').style.display = 'none';
  document.getElementById('mainContent').style.display = 'flex';
  document.getElementById('mainContent').style.flexDirection = 'column';
  document.getElementById('activeKwBadge').textContent = '추천 기사';
  document.getElementById('newsCountLabel').textContent = `${recommendations.length}건`;
  setRecommendationButtonActive(true);
  renderNews();
}

function getRecommendedArticles() {
  const scrapData = JSON.parse(localStorage.getItem('kn_scrap_data_' + (currentUser?.email || 'guest')) || '{}');
  const scrappedItems = Object.values(scrapData);
  if (!scrappedItems.length) return [];
  const tokens = extractRecommendationTokens(scrappedItems.map(item => `${item.title || ''} ${item.summary || ''}`).join(' '));
  return keywordNewsCache
    .filter(article => !scrapped.has(article.id))
    .map(article => ({
      ...article,
      recommendationScore: scoreRecommendation(article, tokens)
    }))
    .filter(article => article.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);
}

function extractRecommendationTokens(text) {
  const ignored = new Set(['뉴스','기사','관련','이번','오늘','단독','속보','기자','위해','대한','으로','에서','하다']);
  return [...new Set(String(text || '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length >= 2 && !ignored.has(token)))];
}

function scoreRecommendation(article, tokens) {
  const text = `${article.title || ''} ${article.summary || ''}`.toLowerCase();
  return tokens.reduce((score, token) => score + (text.includes(token.toLowerCase()) ? 1 : 0), 0);
}

function setRecommendationButtonActive(active) {
  const btn = document.getElementById('recommendBtn');
  if (btn) btn.classList.toggle('active', Boolean(active));
}

// ── News API Integration ──
async function fetchFromProxy(keyword) {
  const params = new URLSearchParams({ q: keyword, display: '20' });
  if (excludedKeywords.length) params.set('exclude', excludedKeywords.join(','));
  const data = await fetchNewsJson(params);
  return (data.items || [])
    .filter(item => !containsExcludedKeyword(item))
    .map((item, i) => ({
    id: item.id || 'n' + i + '_' + Date.now(),
    title: stripHtml(item.title),
    source: item.source || safeDomain(item.url || item.originallink || item.link) || '뉴스',
    time: item.time || formatDate(item.pubDate),
    url: item.url || item.originallink || item.link,
    breaking: Boolean(item.breaking) || i === 0,
    read: false,
    image: item.image || item.thumbnail || null,
    summary: stripHtml(item.summary || item.description) || '기사를 클릭하여 원문을 확인하세요.',
    related: item.related || []
  }));
}

async function fetchNewsJson(params) {
  let lastError = null;
  for (const endpoint of getProxyEndpointCandidates()) {
    try {
      const joiner = endpoint.includes('?') ? '&' : '?';
      const res = await fetch(`${endpoint}${joiner}${params.toString()}`);
      if (!res.ok) throw new Error(`Proxy error ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('RSS proxy unavailable');
}

function getProxyEndpointCandidates() {
  const endpoints = [DEFAULT_PROXY_URL];
  const { protocol, hostname } = window.location;

  if (protocol === 'http:' || protocol === 'https:') {
    endpoints.push(`${protocol}//${hostname}:3001/api/news`);
  }

  if (protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1') {
    endpoints.push('http://localhost:3001/api/news');
    endpoints.push('http://127.0.0.1:3001/api/news');
  }

  return [...new Set(endpoints)];
}

function containsExcludedKeyword(article) {
  if (!excludedKeywords.length) return false;
  const haystack = normalizeSearchText(`${article.title || ''} ${article.summary || ''} ${article.description || ''}`);
  return expandClientExcludeTerms(excludedKeywords).some(keyword => haystack.includes(keyword));
}

function expandClientExcludeTerms(keywords) {
  return [...new Set(keywords.flatMap(keyword => {
    const normalized = normalizeSearchText(keyword);
    const aliases = CLIENT_EXCLUDE_ALIASES[normalized] || [];
    return [normalized, ...aliases.map(normalizeSearchText)];
  }).filter(Boolean))];
}

async function fetchFromNaver(keyword) {
  // NOTE: Direct Naver API calls from browser are blocked by CORS.
  // Use the proxy server approach instead (see server/proxy.js).
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(keyword)}&display=20&sort=date`;
  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': apiSettings.naverClientId,
      'X-Naver-Client-Secret': apiSettings.naverClientSecret
    }
  });
  if (!res.ok) throw new Error('Naver API error');
  const data = await res.json();
  return (data.items || []).map((item, i) => ({
    id: 'nv' + i + '_' + Date.now(),
    title: stripHtml(item.title),
    source: new URL(item.originallink || item.link).hostname.replace('www.',''),
    time: formatDate(item.pubDate),
    url: item.originallink || item.link,
    breaking: i === 0,
    read: false,
    image: null,
    summary: stripHtml(item.description) || '기사를 클릭하여 원문을 확인하세요.',
    related: []
  }));
}

// ── Render News ──
function renderNews() {
  const list = document.getElementById('newsList');
  list.innerHTML = '';
  if (!activeNews.length) {
    const message = viewMode === 'recommendations'
      ? '스크랩한 기사와 현재 키워드 뉴스가 겹칠 때 추천 기사가 표시됩니다.'
      : '검색 결과가 없습니다.';
    list.innerHTML = `<div class="empty-message">${esc(message)}</div>`;
    return;
  }
  activeNews.forEach(article => {
    list.appendChild(buildCard(article));
  });
}

function buildCard(article) {
  const card = document.createElement('div');
  card.className = 'news-card' + (article.read ? ' read' : '') + (expandedId === article.id ? ' expanded' : '');
  card.id = 'card_' + article.id;

  const breakBadge = article.breaking ? '<span class="card-breaking">속보</span>' : '';
  const isExpanded = expandedId === article.id;
  const isScrapped = scrapped.has(article.id);

  let expandedHtml = '';
  if (isExpanded) {
    const imageUrl = article.image || SAMPLE_THUMB;
    const imgHtml = `<img class="card-thumb" src="${esc(imageUrl)}" alt="기사 대표 이미지" loading="lazy" onerror="this.onerror=null;this.src='${esc(SAMPLE_THUMB)}'">`;

    const relatedArticles = getRelatedArticles(article);
    const relatedHtml = relatedArticles.length
      ? relatedArticles.map(r => `
          <div class="related-item" onclick="goToArticle(event,'${esc(r.url)}')">
            <span class="related-copy">
              <span class="related-title">${esc(r.title)}</span>
              <span class="related-meta">${esc(formatRelatedMeta(r))}</span>
            </span>
            <span class="related-arrow">→</span>
          </div>`).join('')
      : '<div style="font-size:12px;color:var(--text3);padding:4px 0">관련 기사가 없습니다.</div>';

    expandedHtml = `
      <div class="card-expanded">
        ${imgHtml}
        <p class="card-summary">${esc(article.summary)}</p>
        <div class="card-actions">
          <button class="card-btn primary" onclick="goOriginal(event,'${esc(article.url)}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            원문 보기
          </button>
          <button class="card-btn ${isScrapped ? 'scrapped' : ''}" onclick="toggleScrap(event,'${article.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isScrapped ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            ${isScrapped ? '스크랩됨' : '스크랩'}
          </button>
          <button class="card-btn" onclick="openShareModal(event,'${article.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            공유
          </button>
        </div>
        <div class="related-section-title">관련 기사</div>
        <div class="related-list">${relatedHtml}</div>
      </div>`;
  }

  card.innerHTML = `
    <div class="card-header" onclick="toggleCard('${article.id}')">
      <div class="card-unread-dot"></div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-source">${esc(article.source)}</span>
          <span>${esc(article.time)}</span>
          ${breakBadge}
        </div>
        <div class="card-title">${esc(article.title)}</div>
      </div>
      <svg class="card-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    ${expandedHtml}
  `;

  return card;
}

function toggleCard(id) {
  const article = activeNews.find(a => a.id === id);
  if (!article) return;

  const wasExpanded = expandedId === id;

  // If collapsing a card that was opened (read it), mark as read NOW (on fold)
  if (wasExpanded && !article.read) {
    markAsRead(article);
  }

  expandedId = wasExpanded ? null : id;
  renderNews();
}

function getRelatedArticles(article) {
  if (article.related && article.related.length) return article.related.slice(0, 3);
  return activeNews
    .filter(item => item.id !== article.id && item.url !== article.url)
    .slice(0, 3)
    .map(item => ({
      title: item.title,
      url: item.url,
      source: item.source,
      time: item.time
    }));
}

function formatRelatedMeta(article) {
  return [article.source, article.time].filter(Boolean).join(' · ');
}

function markAsRead(article) {
  article.read = true;
  if (activeKeyword) {
    activeKeyword.unread = Math.max(0, activeKeyword.unread - 1);
    // Persist read state
    const readKey = 'kn_read_' + (currentUser?.email || 'guest') + '_' + activeKeyword.name;
    const readIds = new Set(JSON.parse(localStorage.getItem(readKey) || '[]'));
    readIds.add(article.id);
    localStorage.setItem(readKey, JSON.stringify([...readIds]));
    renderKeywords();
    updateCountLabel();
  }
}

function updateCountLabel() {
  if (!activeKeyword) return;
  const total = activeNews.length;
  const unread = activeNews.filter(a => !a.read).length;
  document.getElementById('newsCountLabel').textContent = `${total}건 · 미읽음 ${unread}`;
}

function markAllRead() {
  activeNews.forEach(a => { a.read = true; });
  if (activeKeyword) {
    activeKeyword.unread = 0;
    const readKey = 'kn_read_' + (currentUser?.email || 'guest') + '_' + activeKeyword.name;
    localStorage.setItem(readKey, JSON.stringify(activeNews.map(a => a.id)));
    renderKeywords();
    updateCountLabel();
  }
  renderNews();
}

function refreshNews() {
  if (!activeKeyword) return;
  expandedId = null;
  // Clear read state for refresh
  const readKey = 'kn_read_' + (currentUser?.email || 'guest') + '_' + activeKeyword.name;
  localStorage.removeItem(readKey);
  loadNews(activeKeyword);
}

// ── Navigation ──
function goOriginal(e, url) {
  e.stopPropagation();
  if (url && url !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
}

function goToArticle(e, url) {
  e.stopPropagation();
  if (url && url !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
}

// ── Scrap ──
function toggleScrap(e, id) {
  e.stopPropagation();
  if (!currentUser?.email) {
    showToast('스크랩은 로그인 또는 회원가입 후 사용할 수 있습니다.');
    return;
  }
  const article = activeNews.find(a => a.id === id);
  if (!article) return;
  if (scrapped.has(id)) {
    scrapped.delete(id);
    showToast('스크랩이 해제되었습니다.');
  } else {
    scrapped.add(id);
    // Save article info for settings display
    const scrapData = JSON.parse(localStorage.getItem('kn_scrap_data_' + (currentUser?.email || 'guest')) || '{}');
    scrapData[id] = {
      title: article.title,
      url: article.url,
      source: article.source,
      summary: article.summary,
      image: article.image
    };
    localStorage.setItem('kn_scrap_data_' + (currentUser?.email || 'guest'), JSON.stringify(scrapData));
    showToast('스크랩에 저장되었습니다.');
  }
  saveUserData();
  // Re-render just this card
  const card = document.getElementById('card_' + id);
  if (card) card.replaceWith(buildCard(article));
}

// ── Share ──
function openShareModal(e, id) {
  e.stopPropagation();
  shareTarget = activeNews.find(a => a.id === id) || null;
  if (!shareTarget) return;
  document.getElementById('shareTitle').textContent = shareTarget.title;
  document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
  shareTarget = null;
}

function shareVia(method) {
  if (!shareTarget) return;
  const url = shareTarget.url;
  const text = shareTarget.title;
  closeShareModal();
  switch (method) {
    case 'copy':
      navigator.clipboard.writeText(url).then(() => showToast('링크가 복사되었습니다.')).catch(() => {
        const inp = document.createElement('input');
        inp.value = url; document.body.appendChild(inp);
        inp.select(); document.execCommand('copy'); document.body.removeChild(inp);
        showToast('링크가 복사되었습니다.');
      });
      break;
  }
}

// ── Settings ──
function openSettings() {
  const modal = document.getElementById('settingsModal');
  document.getElementById('settingsName').value = currentUser?.name || '';
  document.getElementById('settingsEmail').value = currentUser?.email || '게스트';
  document.getElementById('excludedKeywords').value = excludedKeywords.join('\n');
  renderScrappedList();
  modal.style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}

function saveExcludedKeywords() {
  excludedKeywords = normalizeKeywordList(document.getElementById('excludedKeywords').value);
  saveUserData();
  showToast('제외 키워드가 저장되었습니다.');
  if (activeKeyword) loadNews(activeKeyword);
}

function saveProfile() {
  const name = document.getElementById('settingsName').value.trim();
  if (!name) { showToast('이름을 입력해 주세요.'); return; }
  if (currentUser) currentUser.name = name;
  localStorage.setItem('kn_user', JSON.stringify(currentUser));
  document.getElementById('userName').textContent = name;
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();
  showToast('프로필이 저장되었습니다.');
}

function renderScrappedList() {
  const el = document.getElementById('scrappedList');
  const scrapData = JSON.parse(localStorage.getItem('kn_scrap_data_' + (currentUser?.email || 'guest')) || '{}');
  const ids = [...scrapped];
  if (!ids.length) {
    el.innerHTML = '<div class="scrapped-empty">스크랩한 기사가 없습니다.</div>';
    return;
  }
  el.innerHTML = ids.map(id => {
    const info = scrapData[id];
    if (!info) return '';
    return `<div class="scrapped-item">
      <span class="scrapped-item-title" onclick="window.open('${esc(info.url)}','_blank')">${esc(info.title)}</span>
      <button class="kw-del" style="opacity:1" onclick="removeScrap('${id}')" title="스크랩 해제" aria-label="스크랩 해제">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>`;
  }).join('');
}

function removeScrap(id) {
  scrapped.delete(id);
  saveUserData();
  renderScrappedList();
  const card = document.getElementById('card_' + id);
  if (card) {
    const article = activeNews.find(a => a.id === id);
    if (article) card.replaceWith(buildCard(article));
  }
}

// ── Sidebar toggle ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Helpers ──
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>')
    .replace(/&amp;/g,'&')
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .trim();
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[·ㆍ]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return '방금 전';
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff/60)}시간 전`;
    return `${Math.floor(diff/1440)}일 전`;
  } catch { return dateStr; }
}

function safeDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
