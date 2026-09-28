/**
 * 2026 教師節 — 三學科動態問答資料庫 (Questions Database)
 * 格式支援多題依序作答，目前各學科配置 1 題作為 Demo 驗證。
 */

const QUIZ_ASSET_BASE_PATH = (function() {
  const script = document.currentScript;
  if (script && script.src) {
    return script.src.replace(/questions\.js(\?.*)?$/, 'src/照片素材/');
  }
  const isSubfolder = window.location.pathname.includes('/mathematic/') ||
                      window.location.pathname.includes('/history/') ||
                      window.location.pathname.includes('/civics/');
  return (isSubfolder ? '../' : '') + 'global/src/照片素材/';
})();

const TEACHER_QUIZ_DATA = {
  // 1. 數學老師
  mathematic: [
    {
      id: "math_q1",
      subject: "數學",
      themeColor: "#38BDF8",
      stepBadge: "暖身題 · 第 1 / 4 題",
      question: "請心算因式分解： X^2-37X+252",
      hint: "提示：這題出自2024教師節大挑戰。",
      options: [
        { text: "X = 6 or 31", isCorrect: false },
        { text: "X = 7 or 30", isCorrect: false },
        { text: "X = 8 or 29", isCorrect: false },
        { text: "X = 9 or 28", isCorrect: true }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "math_q2",
      subject: "數學",
      themeColor: "#38BDF8",
      stepBadge: "基礎題 · 第 2 / 4 題",
      question: "請問下列圖形是哪一種形狀？",
      hint: "提示：圖片僅供參考。",
      image: "數學Q2.jpg",
      options: [
        { text: "四邊形", isCorrect: false },
        { text: "五邊形", isCorrect: false },
        { text: "七邊形", isCorrect: false },
        { text: "三角形", isCorrect: true }
      ],
      praise: "答對了！🎉 注意到180°"
    },
    {
      id: "math_q3",
      subject: "數學",
      themeColor: "#38BDF8",
      stepBadge: "微進階題 · 第 3 / 4 題",
      question: "設 f(X)=232X^4 + 287  求此函數在X=1時的斜率",
      hint: "提示：這不是暗示，是明示。",
      options: [
        { text: "464", isCorrect: false },
        { text: "232", isCorrect: false },
        { text: "696", isCorrect: false },
        { text: "928", isCorrect: true }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "math_q4",
      subject: "數學",
      themeColor: "#38BDF8",
      stepBadge: "微進階題 · 第 4 / 4 題",
      question: "老師第一次上二班的課，第一個見到二班的人是誰？",
      hint: "提示：這題出自2025教師節大挑戰。",
      options: [
        { text: "正在推平板車的張恩愷", isCorrect: true },
        { text: "正在進教室的主席", isCorrect: false },
        { text: "走進教室才看見全班", isCorrect: false },
        { text: "沒教過這個班", isCorrect: false }
      ],
      praise: "答對了！🎉"
    }
  ],

  // 2. 歷史老師
  history: [
    {
      id: "history_q1",
      subject: "歷史",
      themeColor: "#B82222",
      stepBadge: "課前暖身 · 第 1 / 4 題",
      question: "請問下列何者日期與教師節最接近？",
      hint: "提示：黃翔生「誕辰」",
      options: [
        { text: "黃翔生誕辰", isCorrect: true },
        { text: "老師的生日", isCorrect: false },
        { text: "張恩愷生日", isCorrect: false },
        { text: "江宥辰生日", isCorrect: false }
      ],
      praise: "答對了！🎉黃翔生每天都在誕辰。"
    },
    {
      id: "history_q2",
      subject: "歷史",
      themeColor: "#B82222",
      stepBadge: "課前暖身 · 第 2 / 4 題",
      question: "請問902班目前就讀前五志願（附中、中山、松山、中崙、大直）共有幾人？",
      hint: "提示：前五志願",
      options: [
        { text: "5個", isCorrect: false },
        { text: "6個", isCorrect: false },
        { text: "8個", isCorrect: true },
        { text: "7個", isCorrect: false }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "history_q3",
      subject: "歷史",
      themeColor: "#B82222",
      stepBadge: "課前暖身 · 第 3 / 4 題",
      question: "請問902班曾經獲得以下哪一個獎項？",
      hint: "提示：。",
      options: [
        { text: "大鵬操特優", isCorrect: false },
        { text: "啦啦隊優勝", isCorrect: false },
        { text: "拔河第一名", isCorrect: false },
        { text: "表藝展演最佳演員獎", isCorrect: true }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "history_q4",
      subject: "歷史",
      themeColor: "#B82222",
      stepBadge: "課前暖身 · 第 4 / 4 題",
      question: "請問老師第一次見到我們班是下列何時？",
      hint: "提示：。",
      options: [
        { text: "2024/9/6 10:10", isCorrect: false },
        { text: "2023/9/5 08:00", isCorrect: true },
        { text: "2023/9/7 13:10", isCorrect: false },
        { text: "沒教過這個班", isCorrect: false }
      ],
      praise: "答對了！🎉"
    }
  ],

  // 3. 公民老師
  civics: [
    {
      id: "civics_q1",
      subject: "公民",
      themeColor: "#D4AF37",
      stepBadge: "課前暖身 · 第 1 / 3 題",
      question: "如果前往自首的路上被抓算不算自首？",
      hint: "提示：。",
      options: [
        { text: "算", isCorrect: false },
        { text: "不算", isCorrect: false },
        { text: "自首一半", isCorrect: true },
        { text: "依情況而定", isCorrect: false }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "civics_q2",
      subject: "公民",
      themeColor: "#D4AF37",
      stepBadge: "基礎題 · 第 2 / 3 題",
      question: "你說附屬制度究竟是憲法抄得不完全還是孫文的追求？",
      hint: "提示：。",
      options: [
        { text: "憲法抄的不完全", isCorrect: false },
        { text: "宋教仁的死亡", isCorrect: true },
        { text: "孫文的追求", isCorrect: false },
        { text: "蔣介石的念想", isCorrect: false }
      ],
      praise: "答對了！🎉"
    },
    {
      id: "civics_q3",
      subject: "公民",
      themeColor: "#D4AF37",
      stepBadge: "進階題 · 第 3 / 3 題",
      question: "下列何者資產和最高？",
      hint: "提示：。",
      options: [
        { text: "林百里、郭台銘、張忠謀", isCorrect: false },
        { text: "黃翔生、江宥辰、李沛軒、張恩愷、黃仁勳", isCorrect: true },
        { text: "阿兩、中川、麗子", isCorrect: false },
        { text: "孟琳的國民年金", isCorrect: false }
      ],
      praise: "答對了！🎉"
    }
  ]
};

/**
 * 載入指定學科的問答邏輯
 * @param {string} subjectKey - 'mathematic' | 'history' | 'civics'
 * @param {Function} onUnlockedCallback - 全數答對後的回調函式
 */
function initSubjectQuiz(subjectKey, onUnlockedCallback) {
  const quizList = TEACHER_QUIZ_DATA[subjectKey];
  if (!quizList || quizList.length === 0) {
    if (onUnlockedCallback) onUnlockedCallback();
    return;
  }

  const quizSection = document.getElementById('quiz-section');
  if (quizSection) {
    quizSection.classList.add(`quiz-${subjectKey}`);
  }
  const stepTag = document.getElementById('quiz-step-tag');
  const questionTitle = document.getElementById('quiz-title');
  const questionHint = document.getElementById('quiz-hint');
  const optionsList = document.getElementById('quiz-options-list');
  const feedback = document.getElementById('quiz-feedback');

  let currentIdx = 0;

  function renderCurrentQuestion() {
    const q = quizList[currentIdx];
    stepTag.textContent = q.stepBadge;
    if (quizSection) {
      quizSection.style.setProperty('--subject-color', q.themeColor);
    }
    questionTitle.textContent = q.question;
    questionHint.textContent = q.hint;
    feedback.textContent = '';
    optionsList.innerHTML = '';

    // 渲染附圖（如果有）
    let imageBox = document.getElementById('quiz-image-box');
    if (!imageBox) {
      imageBox = document.createElement('div');
      imageBox.id = 'quiz-image-box';
      imageBox.className = 'quiz-image-box';
      optionsList.parentNode.insertBefore(imageBox, optionsList);
    }

    if (q.image) {
      const imgSrc = (q.image.startsWith('http') || q.image.startsWith('/') || q.image.startsWith('../') || q.image.startsWith('./'))
        ? q.image
        : `${QUIZ_ASSET_BASE_PATH}${q.image}`;
      imageBox.innerHTML = `<img src="${imgSrc}" alt="${q.question}" class="quiz-image">`;
      imageBox.style.display = 'flex';
    } else {
      imageBox.innerHTML = '';
      imageBox.style.display = 'none';
    }

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span class="opt-prefix">${letters[idx]}</span><span>${opt.text}</span>`;
      btn.addEventListener('click', () => handleOptionClick(opt, btn, q));
      optionsList.appendChild(btn);
    });
  }

  function handleOptionClick(opt, btn, questionObj) {
    const allBtns = optionsList.querySelectorAll('.quiz-option-btn');
    if (opt.isCorrect) {
      btn.classList.add('correct');
      feedback.className = 'quiz-feedback success';
      feedback.textContent = questionObj.praise;
      allBtns.forEach(b => b.disabled = true);

      setTimeout(() => {
        currentIdx++;
        if (currentIdx < quizList.length) {
          renderCurrentQuestion();
        } else {
          // 全部完成，解鎖卡片
          quizSection.classList.add('hidden');
          if (onUnlockedCallback) onUnlockedCallback();
        }
      }, 1200);
    } else {
      btn.classList.add('wrong');
      feedback.className = 'quiz-feedback error';
      feedback.textContent = '差一點點！老師再想想看～ 😊';
      setTimeout(() => {
        btn.classList.remove('wrong');
        feedback.className = 'quiz-feedback';
        feedback.textContent = '';
      }, 1000);
    }
  }

  renderCurrentQuestion();
}
