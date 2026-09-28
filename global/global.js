/**
 * 2026 教師節 — 全局通用腳本庫 (Global Scripts)
 * 問答資料庫與問答邏輯已獨立模組化至 global/questions.js
 */

/**
 * ==========================================================================
 * 背景隨機表情包貼圖漂浮反彈動效 (Floating Bouncing Stickers)
 * 隨機挑選 global/src/照片素材 1~16 中的圖片在背景漂彈
 * ==========================================================================
 */
const ASSET_BASE_PATH = (function() {
  const script = document.currentScript;
  if (script && script.src) {
    return script.src.replace(/global\.js(\?.*)?$/, 'src/照片素材/');
  }
  const isSubfolder = window.location.pathname.includes('/mathematic/') ||
                      window.location.pathname.includes('/history/') ||
                      window.location.pathname.includes('/civics/');
  return (isSubfolder ? '../' : '') + 'global/src/照片素材/';
})();

function initFloatingStickers(customOptions = {}) {
  // 避免重複初始化
  if (document.getElementById('floating-stickers-layer')) return;

  const isMobile = window.innerWidth < 640;
  // 隨機挑選 4~6 張（手機版 3~4 張）
  const defaultCount = isMobile
    ? Math.floor(Math.random() * 2) + 3 // 3 ~ 4
    : Math.floor(Math.random() * 2) + 5; // 5 ~ 6
  const count = customOptions.count || defaultCount;

  // 洗牌算法隨機挑選 1~16 中不重複的圖片編號
  const allIds = Array.from({ length: 16 }, (_, i) => i + 1);
  for (let i = allIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
  }
  const chosenIds = allIds.slice(0, count);

  // 建立全螢幕固定背景層
  const container = document.createElement('div');
  container.id = 'floating-stickers-layer';
  container.className = 'floating-stickers-layer';
  document.body.prepend(container);

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 建立貼圖資料與 DOM 元件
  const stickers = chosenIds.map((id, index) => {
    const img = document.createElement('img');
    img.className = 'floating-sticker';
    img.src = `${ASSET_BASE_PATH}${id}.png`;
    img.alt = `教師節趣味貼圖 ${id}`;

    // 隨機貼圖寬度：桌機 100~135px，手機 70~90px
    const baseWidth = isMobile
      ? Math.floor(70 + Math.random() * 20)
      : Math.floor(100 + Math.random() * 35);
    img.style.width = `${baseWidth}px`;
    container.appendChild(img);

    // 網格隨機分佈初始位置，避免貼圖重疊聚集
    const cols = 3;
    const rows = 2;
    const col = index % cols;
    const row = Math.floor(index / cols) % rows;
    const cellW = vw / cols;
    const cellH = vh / rows;
    const initX = Math.max(10, Math.min(vw - baseWidth - 10, col * cellW + Math.random() * (cellW - baseWidth)));
    const initY = Math.max(10, Math.min(vh - baseWidth - 10, row * cellH + Math.random() * (cellH - baseWidth)));

    // 隨機速度向量（像素/影格），確保在 X 與 Y 軸都有明確動態
    const speed = 1.0 + Math.random() * 0.9;
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    if (Math.abs(vx) < 0.6) vx = vx < 0 ? -0.8 : 0.8;
    if (Math.abs(vy) < 0.6) vy = vy < 0 ? -0.8 : 0.8;

    const stickerObj = {
      elem: img,
      x: initX,
      y: initY,
      vx: vx,
      vy: vy,
      width: baseWidth,
      height: baseWidth, // 預估正方形，圖片載入完成後會更新精確高度
      rotation: (Math.random() - 0.5) * 20, // 初始傾角
      rotSpeed: (Math.random() - 0.5) * 0.35, // 搖擺角速度
      scale: 1,
      scaleVel: 0
    };

    img.onload = () => {
      if (img.offsetWidth) stickerObj.width = img.offsetWidth;
      if (img.offsetHeight) stickerObj.height = img.offsetHeight;
    };

    return stickerObj;
  });

  // 動畫循環 (requestAnimationFrame)
  let lastTime = performance.now();
  function animate(now) {
    const dt = Math.min((now - lastTime) / 16.67, 2.0); // 影格歸一化係數（約 60fps 為 1.0）
    lastTime = now;

    const currentVw = window.innerWidth;
    const currentVh = window.innerHeight;

    stickers.forEach(s => {
      const w = s.width || 100;
      const h = s.height || 100;

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // 溫和漂浮微晃動
      s.rotation += s.rotSpeed * dt;
      if (s.rotation > 16) {
        s.rotation = 16;
        s.rotSpeed = -Math.abs(s.rotSpeed);
      } else if (s.rotation < -16) {
        s.rotation = -16;
        s.rotSpeed = Math.abs(s.rotSpeed);
      }

      // 邊緣反彈彈性形變恢復
      if (s.scale !== 1 || s.scaleVel !== 0) {
        const springForce = (1 - s.scale) * 0.22;
        s.scaleVel = (s.scaleVel + springForce) * 0.72;
        s.scale += s.scaleVel * dt;
        if (Math.abs(s.scale - 1) < 0.005 && Math.abs(s.scaleVel) < 0.005) {
          s.scale = 1;
          s.scaleVel = 0;
        }
      }

      // 碰壁反彈：左 / 右邊界
      if (s.x <= 0) {
        s.x = 0;
        s.vx = Math.abs(s.vx);
        s.scale = 1.12; // 彈跳微縮放
        s.rotSpeed = (Math.random() - 0.5) * 0.5;
      } else if (s.x + w >= currentVw) {
        s.x = currentVw - w;
        s.vx = -Math.abs(s.vx);
        s.scale = 1.12;
        s.rotSpeed = (Math.random() - 0.5) * 0.5;
      }

      // 碰壁反彈：上 / 下邊界
      if (s.y <= 0) {
        s.y = 0;
        s.vy = Math.abs(s.vy);
        s.scale = 1.12;
        s.rotSpeed = (Math.random() - 0.5) * 0.5;
      } else if (s.y + h >= currentVh) {
        s.y = currentVh - h;
        s.vy = -Math.abs(s.vy);
        s.scale = 1.12;
        s.rotSpeed = (Math.random() - 0.5) * 0.5;
      }

      // 渲染最新位置（硬體加速）
      s.elem.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${s.rotation.toFixed(1)}deg) scale(${s.scale.toFixed(3)})`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // 視窗調整大小時邊界保護
  window.addEventListener('resize', () => {
    const newVw = window.innerWidth;
    const newVh = window.innerHeight;
    stickers.forEach(s => {
      const w = s.width || 100;
      const h = s.height || 100;
      if (s.x + w > newVw) s.x = Math.max(0, newVw - w);
      if (s.y + h > newVh) s.y = Math.max(0, newVh - h);
    });
  });
}

// 自動掛載啟動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initFloatingStickers());
} else {
  initFloatingStickers();
}

/**
 * ==========================================================================
 * 通用提示訊息彈窗 (Global Toast System)
 * ==========================================================================
 */
function showToast(message, duration = 2200) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  if (toast._timer) clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
window.showToast = showToast;

/**
 * ==========================================================================
 * 感性時間音樂播放器模組 (Emotional BGM Manager)
 * 支援 MP3 與 WAV 備援，並整合 Web Audio API 作為最終防護機制
 * ==========================================================================
 */
const EmotionalAudio = (function() {
  let audioElement = null;
  let isPlaying = false;
  let isMuted = false;
  let targetVolume = 0.75;
  let fadeTimer = null;
  let audioCtx = null;
  let synthTimer = null;

  function initAudio() {
    if (audioElement) return;
    audioElement = new Audio();
    audioElement.loop = true;
    audioElement.preload = 'auto';

    const bgmBase = ASSET_BASE_PATH.replace('照片素材/', '');
    const mp3Src = bgmBase + 'bgm.mp3';
    const wavSrc = bgmBase + 'bgm.wav';

    audioElement.src = mp3Src;
    audioElement.volume = 0;

    audioElement.addEventListener('error', () => {
      if (audioElement.src.endsWith('.mp3')) {
        console.log('[BGM] MP3 載入失敗，自動切換至 WAV 格式...');
        audioElement.src = wavSrc;
        if (isPlaying) {
          audioElement.play().catch(fallbackToWebAudio);
        }
      } else {
        console.log('[BGM] 音檔載入異常，切換至 Web Audio 鋼琴合成音...');
        fallbackToWebAudio();
      }
    });
  }

  function fallbackToWebAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playSynthChords();
    } catch (e) {
      console.warn('[BGM] Web Audio 初始化失敗:', e);
    }
  }

  function playSynthChords() {
    if (!audioCtx) return;
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C
      [246.94, 293.66, 392.00, 493.88], // G/B
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 329.63, 392.00], // Em/G
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 261.63, 329.63], // C/E
      [146.83, 220.00, 261.63, 349.23], // Dm7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];
    let chordIdx = 0;

    function triggerChord() {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.6);
      });

      synthTimer = setTimeout(triggerChord, 2400);
    }
    triggerChord();
  }

  function fadeTo(target, duration = 1200) {
    if (!audioElement) return;
    if (fadeTimer) clearInterval(fadeTimer);
    const startVol = audioElement.volume;
    const steps = 24;
    const stepDuration = duration / steps;
    const diff = target - startVol;
    let currentStep = 0;

    fadeTimer = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(1, startVol + (diff * (currentStep / steps))));
      if (audioElement) audioElement.volume = nextVol;
      if (currentStep >= steps) {
        clearInterval(fadeTimer);
        fadeTimer = null;
      }
    }, stepDuration);
  }

  function play(initialVol = 0.75) {
    initAudio();
    targetVolume = initialVol;
    isPlaying = true;

    if (audioElement) {
      audioElement.volume = 0;
      const p = audioElement.play();
      if (p !== undefined) {
        p.then(() => {
          fadeTo(targetVolume, 1500);
        }).catch(err => {
          console.warn('[BGM] 播放受阻，啟動合成器模式:', err);
          fallbackToWebAudio();
        });
      }
    } else {
      fallbackToWebAudio();
    }
    updateFloatingUI();
  }

  function duck() {
    targetVolume = 0.35;
    fadeTo(0.35, 1500);
  }

  function pause() {
    isPlaying = false;
    if (audioElement) {
      fadeTo(0, 400);
      setTimeout(() => {
        if (!isPlaying && audioElement) audioElement.pause();
      }, 420);
    }
    if (synthTimer) clearTimeout(synthTimer);
    updateFloatingUI();
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play(targetVolume || 0.6);
    }
  }

  function updateFloatingUI() {
    const btn = document.getElementById('floating-music-btn');
    if (!btn) return;
    if (isPlaying) {
      btn.innerHTML = '🔊 <span class="label-text">音樂播放中</span>';
      btn.classList.add('playing');
    } else {
      btn.innerHTML = '🔇 <span class="label-text">音樂已暫停</span>';
      btn.classList.remove('playing');
    }
  }

  return {
    play,
    duck,
    pause,
    toggle,
    isPlaying: () => isPlaying,
    updateFloatingUI
  };
})();

/**
 * ==========================================================================
 * 感性時間全螢幕動畫流程控制器 (Emotional Intro Director)
 * ==========================================================================
 */
let emotionalIntroActive = false;
let emotionalOptions = {};

function startEmotionalIntro(options = {}) {
  emotionalOptions = Object.assign({
    subject: 'mathematic',
    teacherName: '老師',
    cardTitle: '感謝信',
    onComplete: null
  }, options);

  const subjectKey = (emotionalOptions.subject === 'mathematic' || emotionalOptions.subject === 'math') ? 'math' :
                     (emotionalOptions.subject === 'history' ? 'history' : 'civics');

  // 取得或建立全螢幕遮罩層
  let overlay = document.getElementById('emotional-overlay');
  if (!overlay) {
    overlay = createEmotionalOverlayDOM();
    document.body.appendChild(overlay);
  }

  // 套用科目專屬主題 class
  overlay.classList.remove('theme-math', 'theme-history', 'theme-civics');
  overlay.classList.add(`theme-${subjectKey}`);

  // 重置狀態
  emotionalIntroActive = true;
  overlay.scrollTop = 0;
  overlay.classList.add('active');

  const promptCard = document.getElementById('emotional-prompt-card');
  const theater = document.getElementById('emotional-theater');
  const actionArea = document.getElementById('emotional-action-area');

  promptCard.classList.remove('hidden');
  theater.classList.remove('active', 'mode-2026');
  actionArea.classList.remove('visible');

  // 更新學科專屬引導標籤
  const promptBadge = overlay.querySelector('.prompt-badge');
  if (promptBadge) {
    if (subjectKey === 'history') {
      promptBadge.textContent = '青史長卷 · 師恩歲月';
    } else if (subjectKey === 'civics') {
      promptBadge.textContent = '公民講堂 · 師恩歲月';
    } else {
      promptBadge.textContent = '黑板歲月 · 師恩如歌';
    }
  }

  // 更新按鈕標題文案
  const revealBtn = document.getElementById('btn-reveal-letter');
  if (revealBtn) {
    let specificLabel = '💌 展開寫給您的感謝信';
    if (subjectKey === 'math') {
      specificLabel = `💌 展開寫給 ${emotionalOptions.teacherName} 的黑板感謝信`;
    } else if (subjectKey === 'civics') {
      specificLabel = `📖 翻開寫給 ${emotionalOptions.teacherName} 的法典感謝信`;
    } else if (subjectKey === 'history') {
      specificLabel = `📜 展開寫給 ${emotionalOptions.teacherName} 的典藏手卷`;
    }
    revealBtn.innerHTML = specificLabel;
  }
}
window.startEmotionalIntro = startEmotionalIntro;

/**
 * 動態建立感性時間 DOM 結構
 */
function createEmotionalOverlayDOM() {
  const overlay = document.createElement('div');
  overlay.id = 'emotional-overlay';
  overlay.className = 'emotional-overlay';

  const asset2024 = `${ASSET_BASE_PATH}數學無法黨_2024.jpg`;
  const asset2026 = `${ASSET_BASE_PATH}數學無法黨_2026.jpg`;

  overlay.innerHTML = `
    <!-- 背景流光氛圍 -->
    <div class="emotional-ambient-glow glow-gold"></div>
    <div class="emotional-ambient-glow glow-blue"></div>

    <!-- 階段 1：開啟聲音引導卡片 -->
    <div class="emotional-prompt-card" id="emotional-prompt-card">
      <div class="sound-equalizer-icon">
        <span class="eq-bar"></span>
        <span class="eq-bar"></span>
        <span class="eq-bar"></span>
        <span class="eq-bar"></span>
        <span class="eq-bar"></span>
      </div>
      <div class="prompt-badge">時光如歌 · 師恩歲月</div>
      <h2 class="prompt-title">即將進入感性時間</h2>
      <p class="prompt-desc">
        <strong>請確認開啟裝置聲音 🔊</strong>，戴上耳機感受更佳。
      </p>
      <button class="btn-start-emotional" id="btn-start-emotional">
        <span>開啟聲音 · 進入時光迴廊 ▶</span>
      </button>
      <button class="btn-skip-emotional" id="btn-skip-emotional">
        略過，直接閱讀感謝信 ❯
      </button>
    </div>

    <!-- 階段 2：劇院級照片動畫輪播 -->
    <div class="emotional-theater" id="emotional-theater">
      <!-- 頂部時間標籤 -->
      <div class="emotional-time-pill" id="emotional-time-pill">
        <span class="pill-year" id="pill-year">2024</span>
        <span class="pill-divider">·</span>
        <span class="pill-text" id="pill-text">懵懂初見 · 歡笑滿堂</span>
      </div>

      <!-- 相片畫框 (雙層淡入淡出漸變) -->
      <div class="emotional-frame">
        <img src="${asset2024}" alt="2024 數學無法黨照片" class="photo-layer layer-2024" id="photo-2024">
        <img src="${asset2026}" alt="2026 數學無法黨照片" class="photo-layer layer-2026" id="photo-2026">
        <div class="photo-flash-overlay" id="photo-flash"></div>
        <div class="photo-vignette"></div>
      </div>

      <!-- 感性題詞字幕 -->
      <div class="emotional-quote-box" id="emotional-quote-box">
        <p class="quote-main" id="quote-main">「那一年，我們在黑板前大聲練幹話...」</p>
        <p class="quote-sub" id="quote-sub">那是故事最初的起點。</p>
      </div>

      <!-- 時間軸進度條 -->
      <div class="emotional-timeline-bar">
        <div class="timeline-dot active" id="dot-2024" title="2024 初見"></div>
        <div class="timeline-line">
          <div class="timeline-line-progress" id="timeline-progress"></div>
        </div>
        <div class="timeline-dot active-2026" id="dot-2026" title="2026 盛夏"></div>
      </div>

      <!-- 階段 3：信件展開邀請按鈕 -->
      <div class="emotional-action-area" id="emotional-action-area">
        <button class="btn-reveal-letter" id="btn-reveal-letter">
          💌 展開寫給您的感謝信
        </button>
        <div class="reveal-auto-hint" id="reveal-auto-hint">（即將為您徐徐展開...）</div>
      </div>
    </div>
  `;

  // 綁定事件
  const btnStart = overlay.querySelector('#btn-start-emotional');
  const btnSkip = overlay.querySelector('#btn-skip-emotional');
  const btnReveal = overlay.querySelector('#btn-reveal-letter');

  btnStart.addEventListener('click', () => {
    // 1. 播放音樂
    EmotionalAudio.play(0.8);
    // 2. 啟動照片動畫旅程
    runPhotoTransitionSequence();
  });

  btnSkip.addEventListener('click', () => {
    finishEmotionalIntro();
  });

  btnReveal.addEventListener('click', () => {
    finishEmotionalIntro();
  });

  return overlay;
}

/**
 * 執行照片漸變動畫序列：
 * 2024照片慢速推進 -> 4.5秒後漸變到2026照片 -> 題詞漸變 -> 出現展開信件按鈕
 */
let sequenceTimers = [];

function clearSequenceTimers() {
  sequenceTimers.forEach(t => clearTimeout(t));
  sequenceTimers = [];
}

function runPhotoTransitionSequence() {
  clearSequenceTimers();

  const promptCard = document.getElementById('emotional-prompt-card');
  const theater = document.getElementById('emotional-theater');
  const pillYear = document.getElementById('pill-year');
  const pillText = document.getElementById('pill-text');
  const quoteMain = document.getElementById('quote-main');
  const quoteSub = document.getElementById('quote-sub');
  const flashOverlay = document.getElementById('photo-flash');
  const actionArea = document.getElementById('emotional-action-area');

  const subjectKey = (emotionalOptions.subject === 'mathematic' || emotionalOptions.subject === 'math') ? 'math' :
                     (emotionalOptions.subject === 'history' ? 'history' : 'civics');
  const teacherName = emotionalOptions.teacherName || '老師';

  // 隱藏聲音引導卡片，展示劇院舞台
  promptCard.classList.add('hidden');
  theater.classList.add('active');

  // 初始化 2024 文案（各科目專屬意象）
  pillYear.textContent = '2024';
  if (subjectKey === 'history') {
    pillText.textContent = '初翻史卷 · 墨韻青澀';
    quoteMain.textContent = '「那一年，我們在時光長河前聆聽過往...」';
    quoteSub.textContent = '那是故事最初的起點。';
  } else if (subjectKey === 'civics') {
    pillText.textContent = '論壇初鳴 · 思辨啟蒙';
    quoteMain.textContent = '「那一年，我們在公民講堂上探索世界...」';
    quoteSub.textContent = '那是故事最初的起點。';
  } else {
    pillText.textContent = '懵懂初見 · 歡笑滿堂';
    quoteMain.textContent = '「那一年，我們在黑板前大聲練幹話，...」';
    quoteSub.textContent = '那是故事最初的起點。';
  }

  // 4.8 秒後：從 2024 漸變過渡至 2026
  sequenceTimers.push(setTimeout(() => {
    // 1. 金光微閃過渡
    if (flashOverlay) {
      flashOverlay.classList.add('flash');
      setTimeout(() => flashOverlay.classList.remove('flash'), 500);
    }

    // 2. 劇院切換至 2026 模式 (CSS 觸發 1.8s crossfade)
    theater.classList.add('mode-2026');

    // 3. 平滑更新年份與文案
    pillYear.textContent = '2026';
    if (subjectKey === 'history') {
      pillText.textContent = '載入史冊 · 師恩永銘';
    } else if (subjectKey === 'civics') {
      pillText.textContent = '公民啟航 · 憲章長存';
    } else {
      pillText.textContent = '盛夏啟航 · 師恩永隨';
    }

    quoteMain.style.opacity = '0';
    quoteSub.style.opacity = '0';
    setTimeout(() => {
      quoteMain.textContent = '「轉眼兩年過去，即使畢業了還是在荼毒老師...」';
      if (subjectKey === 'history') {
        quoteSub.textContent = `畢業後的我們，依然有空就會回去學校串門子。敬祝 ${teacherName} 教師節快樂！❤️`;
      } else if (subjectKey === 'civics') {
        quoteSub.textContent = `畢業後的我們，依然有空就會回去學校串門子。敬祝 ${teacherName} 教師節快樂！❤️`;
      } else {
        quoteSub.textContent = `畢業後的我們，依然會傳幹話哏圖給老師。敬祝 ${teacherName} 教師節快樂！❤️`;
      }
      quoteMain.style.opacity = '1';
      quoteSub.style.opacity = '1';
    }, 400);

  }, 4800));

  // 9.5 秒後：顯示展開信件按鈕
  sequenceTimers.push(setTimeout(() => {
    if (actionArea) actionArea.classList.add('visible');
  }, 9500));

  // 15 秒後自動進入卡片（若老師沉浸其中未主動點擊）
  sequenceTimers.push(setTimeout(() => {
    if (emotionalIntroActive) {
      finishEmotionalIntro();
    }
  }, 15000));
}

/**
 * 結束感性時間，無縫過渡至感謝信舞台
 */
function finishEmotionalIntro() {
  clearSequenceTimers();
  emotionalIntroActive = false;

  const overlay = document.getElementById('emotional-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }

  // 音樂進入溫馨背景伴奏音量
  EmotionalAudio.duck();

  // 掛載常駐懸浮音樂與重溫控制列
  mountFloatingMediaControls();

  // 觸發外部回調（展開信件）
  if (typeof emotionalOptions.onComplete === 'function') {
    emotionalOptions.onComplete();
  }
}

/**
 * 掛載右下角常駐控制元件（音樂開關 + 重溫感性時光）
 */
function mountFloatingMediaControls() {
  const subjectKey = (emotionalOptions.subject === 'mathematic' || emotionalOptions.subject === 'math') ? 'math' :
                     (emotionalOptions.subject === 'history' ? 'history' : 'civics');

  let bar = document.getElementById('floating-media-controls');
  if (bar) {
    bar.className = `floating-media-controls theme-${subjectKey}`;
    return;
  }

  bar = document.createElement('div');
  bar.id = 'floating-media-controls';
  bar.className = `floating-media-controls theme-${subjectKey}`;

  bar.innerHTML = `
    <button class="floating-music-btn ${EmotionalAudio.isPlaying() ? 'playing' : ''}" id="floating-music-btn" title="播放 / 暫停音樂">
      ${EmotionalAudio.isPlaying() ? '🔊 <span class="label-text">音樂播放中</span>' : '🔇 <span class="label-text">背景音樂</span>'}
    </button>
    <button class="floating-replay-btn" id="floating-replay-btn" title="重新播放感性時光">
      🎬 <span class="label-text">重溫感性時光</span>
    </button>
  `;

  document.body.appendChild(bar);

  // 綁定音樂開關
  const musicBtn = bar.querySelector('#floating-music-btn');
  musicBtn.addEventListener('click', () => {
    EmotionalAudio.toggle();
  });

  // 綁定重溫按鈕
  const replayBtn = bar.querySelector('#floating-replay-btn');
  replayBtn.addEventListener('click', () => {
    startEmotionalIntro(emotionalOptions);
  });
}

// 支援 URL 參數 ?intro=1 或 ?skipQuiz=1 快速驗證
(function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('intro') === '1' || params.get('skipQuiz') === '1') {
    document.addEventListener('DOMContentLoaded', () => {
      const quizSection = document.getElementById('quiz-section');
      if (quizSection) quizSection.classList.add('hidden');
      const subject = window.location.pathname.includes('civics') ? 'civics' :
                      window.location.pathname.includes('history') ? 'history' : 'mathematic';
      startEmotionalIntro({
        subject: subject,
        teacherName: subject === 'civics' ? '鄭孟琳老師' : subject === 'history' ? '湯惠亘老師' : '楊欣璇老師',
        onComplete: () => {
          const stage = document.getElementById('card-stage');
          if (stage) stage.style.display = 'flex';
          const bookCover = document.getElementById('book-cover');
          if (bookCover) bookCover.classList.add('opened');
          const scrollHistory = document.getElementById('scroll-history');
          if (scrollHistory) scrollHistory.classList.add('opened');
        }
      });
    });
  }
})();


