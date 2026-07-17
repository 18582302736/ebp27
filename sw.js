// sw.js - Service Worker（离线缓存）

const CACHE_STATIC = 'ebp-static-v96';
const CACHE_AUDIO = 'ebp-audio-v2';
const CACHE_PDF = 'ebp-pdf-v2';

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
  './assets/logo-lotus-small.png',
  './assets/companions/v2/act-01-departure-cat.webp',
  './assets/companions/v2/act-02-four-part-map-cat.webp',
  './assets/companions/v2/act-03-avoidance-rabbit.webp',
  './assets/companions/v2/act-04-risk-estimating-fox.webp',
  './assets/companions/v2/act-05-worry-crow.webp',
  './assets/companions/v2/act-06-problem-solving-otter.webp',
  './assets/companions/v2/act-07-uncertainty-bird.webp',
  './assets/companions/v2/act-08-safety-rail-raccoon.webp',
  './assets/companions/v2/act-09-approaching-rabbit.webp',
  './assets/companions/v2/act-10-self-trust-bear.webp',
  './assets/companions/v2/act-11-courage-walking-dog.webp',
  './assets/companions/v2/act-12-step-ladder-sheep.webp',
  './assets/companions/v2/act-13-fact-review-sparrow.webp',
  './assets/companions/v2/act-14-experiment-fox.webp',
  './assets/companions/v2/act-15-heartbeat-whale.webp',
  './assets/companions/v2/act-16-outward-attention-cat.webp',
  './assets/companions/v2/act-17-repeat-upgrade-dragon.webp',
  './assets/companions/v2/act-18-good-enough-bear.webp',
  './assets/companions/v2/act-19-experiment-notes-owl.webp',
  './assets/companions/v2/act-20-setback-map-raccoon.webp',
  './assets/companions/v2/act-21-long-journey-cat.webp',
  './assets/companions/v2/cbt-01-three-way-fox.webp',
  './assets/companions/v2/cbt-02-cost-balance-otter.webp',
  './assets/companions/v2/cbt-03-intensity-meter-bear.webp',
  './assets/companions/v2/cbt-04-safe-touch-lamb.webp',
  './assets/companions/v2/cbt-05-five-senses-raccoon.webp',
  './assets/companions/v2/cbt-06-muscle-melting-bear.webp',
  './assets/companions/v2/cbt-07-motion-dog.webp',
  './assets/companions/v2/cbt-08-cooling-penguin.webp',
  './assets/companions/v2/cbt-09-thought-mirror.webp',
  './assets/companions/v2/cbt-10-fact-boundary-cat.webp',
  './assets/companions/v2/cbt-11-evidence-check-cat.webp',
  './assets/companions/v2/cbt-12-grayscale-fox.webp',
  './assets/companions/v2/cbt-13-responsibility-raccoon.webp',
  './assets/companions/v2/cbt-14-perspective-owl.webp',
  './assets/companions/v2/cbt-15-old-belief-parrot.webp',
  './assets/companions/v2/cbt-16-passing-thought-cloud.webp',
  './assets/companions/v2/cbt-17-positive-evidence-sparrow.webp',
  './assets/companions/v2/cbt-18-pause-turtle.webp',
  './assets/companions/v2/cbt-19-problem-shaping-mouse.webp',
  './assets/companions/v2/cbt-20-smallest-step-badger.webp',
  './assets/companions/v2/cbt-21-flexible-tool-elephant.webp',
  './assets/companions/v2/ebp-01-curiosity-sprout.webp',
  './assets/companions/v2/ebp-02-slow-tasting-mochi.webp',
  './assets/companions/v2/ebp-03-tactile-grounding-plush.webp',
  './assets/companions/v2/ebp-04-scent-finding-cat.webp',
  './assets/companions/v2/ebp-05-body-listening-bear.webp',
  './assets/companions/v2/ebp-06-joy-gathering-magpie.webp',
  './assets/companions/v2/ebp-07-glimmer-sprout.webp',
  './assets/companions/v2/ebp-08-flowing-cloud-mochi.webp',
  './assets/companions/v2/ebp-09-emotion-naming-fox.webp',
  './assets/companions/v2/ebp-10-space-giving-whale.webp',
  './assets/companions/v2/ebp-11-inner-listening-cat.webp',
  './assets/companions/v2/ebp-12-letting-go-otter.webp',
  './assets/companions/v2/ebp-13-direction-bird.webp',
  './assets/companions/v2/ebp-14-action-sprout.webp',
  './assets/companions/v2/ebp-15-one-step-turtle.webp',
  './assets/companions/v2/ebp-16-feelings-along-rabbit.webp',
  './assets/companions/v2/ebp-17-daily-practice-raccoon.webp',
  './assets/companions/v2/ebp-18-gentle-repeat-bird.webp',
  './assets/companions/v2/ebp-19-heart-tree-spirit.webp',
  './assets/companions/v2/ebp-20-flourishing-bear.webp',
  './assets/companions/v2/ebp-21-emotion-messenger-pigeon.webp',
  './assets/companions/v2/ebp-22-awareness-lotus.webp',
  './assets/companions/v2/ebp-23-self-knowing-cat.webp',
  './assets/companions/v2/ebp-24-original-light-firefly.webp',
  './assets/companions/v2/ebp-25-coping-kit-raccoon.webp'
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
  if (pathname.match(/\.(js|css|png|webp|jpg|svg|ico|json)$/) || pathname === '/' || pathname.endsWith('/') || pathname.endsWith('.html')) {
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
