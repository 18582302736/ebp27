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

  const wrapper = document.createElement('div');
  wrapper.className = 'audio-player';
  wrapper.innerHTML = `
    <div class="audio-controls">
      <button class="play-btn" data-player="${playerId}">${iconPlay(16)}</button>
      <div class="audio-progress-container">
        <div class="audio-time">
          <span class="current-time">0:00</span>
          <span class="duration">--:--</span>
        </div>
        <input type="range" class="audio-progress-bar" data-player="${playerId}" min="0" max="100" value="0">
      </div>
    </div>
    <div class="audio-status" data-player="${playerId}">点击播放</div>
  `;
  container.appendChild(wrapper);

  const playBtn = wrapper.querySelector('.play-btn');
  const progressBar = wrapper.querySelector('.audio-progress-bar');
  const currentTimeEl = wrapper.querySelector('.current-time');
  const durationEl = wrapper.querySelector('.duration');
  const statusEl = wrapper.querySelector('.audio-status');

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
    if (isPlaying) {
      audio.pause();
    } else {
      AudioManager.register(audio);
      audio.play().catch((e) => {
        console.error('Audio play error:', e);
        statusEl.textContent = '播放失败，音频文件尚未部署';
      });
    }
  });

  audio.addEventListener('play', () => {
    isPlaying = true;
    playBtn.innerHTML = iconPause(16);
    playBtn.classList.add('playing');
    playBtn.style.background = '';
    statusEl.textContent = '播放中...';
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.innerHTML = hasCompleted ? iconCheck(16) : iconPlay(16);
    playBtn.classList.remove('playing');
    if (hasCompleted) {
      playBtn.style.background = 'var(--success)';
    }
    if (audio.currentTime > 0 && !hasCompleted) {
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
      statusEl.textContent = '已完成';
      playBtn.innerHTML = iconCheck(16);
      playBtn.classList.remove('playing');
      playBtn.style.background = 'var(--success)';
      if (onComplete) onComplete();
    }
  });

  audio.addEventListener('ended', () => {
    if (!hasCompleted) {
      hasCompleted = true;
      statusEl.textContent = '已完成';
      playBtn.innerHTML = iconCheck(16);
      playBtn.classList.remove('playing');
      playBtn.style.background = 'var(--success)';
      if (onComplete) onComplete();
    }
    isPlaying = false;
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    statusEl.textContent = '加载失败，音频文件尚未部署';
    playBtn.innerHTML = iconPlay(16);
    playBtn.style.opacity = '0.5';
  });

  // 进度条拖动
  progressBar.addEventListener('input', () => {
    audio.currentTime = parseFloat(progressBar.value);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  return {
    audio,
    reset() {
      hasCompleted = false;
      isPlaying = false;
      audio.currentTime = 0;
      playBtn.innerHTML = iconPlay(16);
      playBtn.classList.remove('playing');
      playBtn.style.background = '';
      playBtn.style.opacity = '';
      progressBar.value = 0;
      currentTimeEl.textContent = '0:00';
      statusEl.textContent = '点击播放';
    },
    isCompleted() { return hasCompleted; }
  };
}