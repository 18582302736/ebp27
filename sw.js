// sw.js - Service Worker（离线缓存）

const CACHE_STATIC = 'ebp-static-v78';
const CACHE_AUDIO = 'ebp-audio-v1';
const CACHE_PDF = 'ebp-pdf-v1';

// 静态资源列表（安装时预缓存）
const STATIC_FILES = [
  './',
  './index.html',
  './day.html',
  './css/style.css',
  './js/utils.js',
  './js/icons.js',
  './js/toast.js',
  './js/data.js',
  './js/storage.js',
  './js/backup.js',
  './js/settings.js',
  './js/app.js',
  './js/cbt-data.js',
  './js/cbt-guide-text.js',
  './js/act-data.js',
  './js/act-guide-text.js',
  './js/calendar.js',
  './js/recovery.js',
  './js/day.js',
  './js/lock.js',
  './js/worksheet-text.js',
  './js/audio-player.js',
  './js/journal.js',
  './js/ebp-journal-config.js',
  './js/ebp-journal.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png',
  './assets/illustration.png',
  './assets/logo-lotus.png',
  './assets/logo-lotus-small.png'
];

// 安装：预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(
      STATIC_FILES.map(url => new Request(url, { cache: 'reload' }))
    ))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_STATIC && k !== CACHE_AUDIO && k !== CACHE_PDF)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// 消息监听：允许页面主动清缓存
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    );
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 绕过所有 GitHub API 请求，绝对不拦截缓存，直接走网络
  if (requestUrl.hostname === 'api.github.com') {
    return;
  }

  const { pathname } = requestUrl;

  // 音频文件：Stale-While-Revalidate
  if (pathname.match(/\.(mp3|MP3)$/)) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_AUDIO));
    return;
  }

  // PDF 文件：Cache-First
  if (pathname.match(/\.pdf$/)) {
    event.respondWith(cacheFirst(event.request, CACHE_PDF));
    return;
  }

  // 静态资源：Cache-First
  if (pathname.match(/\.(js|css|png|jpg|svg|ico|json)$/) || pathname === '/' || pathname.endsWith('/') || pathname.endsWith('.html')) {
    event.respondWith(cacheFirst(event.request, CACHE_STATIC));
    return;
  }

  // 其他请求：网络优先
  event.respondWith(networkFirst(event.request));
});

// Cache-First 策略
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request, { cache: 'reload' });
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('离线内容不可用', { status: 503 });
  }
}

// Stale-While-Revalidate 策略
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  return cached || fetchPromise;
}

// Network-First 策略
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || new Response('离线内容不可用', { status: 503 });
  }
}
