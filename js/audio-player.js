// audio-player.js - 音频播放器组件

const COMPLETION_THRESHOLD = 0.95;
let playerIdCounter = 0;

// 全局音频管理器：同一时间只能播放一个音频
const AudioManager = {
  _current: null,
  register(player) {
    if (this._current && this._current !== player) {
      this._current.pause();
    }
    this._current = player;
  },
  unregister(player) {
    if (this._current === player) {
      this._current = null;
    }
  }
};

function createAudioPlayer(container, audioSrc, onComplete) {
  const playerId = ++playerIdCounter;
  const audio = new Audio(audioSrc);
  audio.preload = 'metadata';

  let hasCompleted = false;
  let isPlaying = false;

  const html = `
    <div class="audio-player">
      <div class="audio-controls">
        <button class="play-btn" data-player="${playerId}">▶</button>
        <div class="audio-progress-container">
          <div class="audio-time">
            <span class="current-time">0:00</span>
            <span class="duration">--:--</span>
          </div>
          <input type="range" class="audio-progress-bar" data-player="${playerId}" min="0" max="100" value="0">
        </div>
      </div>
      <div class="audio-status" data-player="${playerId}">点击播放</div>
    </div>
  `;
  container.innerHTML = html;

  const playBtn = container.querySelector('.play-btn');
  const progressBar = container.querySelector('.audio-progress-bar');
  const currentTimeEl = container.querySelector('.current-time');
  const durationEl = container.querySelector('.duration');
  const statusEl = container.querySelector('.audio-status');

  // 加载时长
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    progressBar.max = audio.duration || 0;
  });

  audio.addEventListener('durationchange', () => {
    durationEl.textContent = formatTime(audio.duration);
    progressBar.max = audio.duration || 0;
  });

  // 播放/暂停
  playBtn.addEventListener('click', () => {
    if (hasCompleted) return;
    if (isPlaying) {
      audio.pause();
    } else {
      AudioManager.register(audio);
      audio.play().catch((e) => {
        console.error('Audio play error:', e);
        statusEl.textContent = '播放失败，请检查文件';
      });
    }
  });

  audio.addEventListener('play', () => {
    if (hasCompleted) {
      audio.pause();
      return;
    }
    isPlaying = true;
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
    statusEl.textContent = '播放中...';
  });

  audio.addEventListener('pause', () => {
    if (hasCompleted) return;
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    if (audio.currentTime > 0) {
      statusEl.textContent = '已暂停';
    }
  });

  // 进度条更新
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    progressBar.value = audio.currentTime || 0;
    currentTimeEl.textContent = formatTime(audio.currentTime);

    const pct = audio.currentTime / audio.duration;
    if (!hasCompleted && pct >= COMPLETION_THRESHOLD) {
      hasCompleted = true;
      statusEl.textContent = '已完成 ✓';
      playBtn.textContent = '✓';
      playBtn.classList.remove('playing');
      playBtn.style.background = 'var(--success)';
      playBtn.disabled = true;
      progressBar.disabled = true;
      if (onComplete) onComplete();
    }
  });

  audio.addEventListener('ended', () => {
    if (!hasCompleted) {
      hasCompleted = true;
      statusEl.textContent = '已完成 ✓';
      playBtn.textContent = '✓';
      playBtn.classList.remove('playing');
      playBtn.style.background = 'var(--success)';
      playBtn.disabled = true;
      progressBar.disabled = true;
      if (onComplete) onComplete();
    }
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    statusEl.textContent = '加载失败，请检查文件';
    playBtn.textContent = '⟳';
  });

  // 进度条拖动
  progressBar.addEventListener('input', () => {
    if (hasCompleted) return;
    audio.currentTime = parseFloat(progressBar.value);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  return {
    audio,
    reset() {
      hasCompleted = false;
      isPlaying = false;
      audio.currentTime = 0;
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
      playBtn.style.background = '';
      playBtn.disabled = false;
      progressBar.disabled = false;
      progressBar.value = 0;
      currentTimeEl.textContent = '0:00';
      statusEl.textContent = '点击播放';
    },
    isCompleted() { return hasCompleted; }
  };
}