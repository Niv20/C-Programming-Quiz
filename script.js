let sessionQuizData = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timerInterval = null;
let isDeviceMobile = false;
let isTransitioning = false;
let activePanel = null;
const backgroundMusic = document.getElementById("backgroundMusic");
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");

const palettes = {
  blue: {
    name: "כחול קלאסי",
    colors: {
      "--primary-color": "#3b82f6",
      "--primary-color-light": "#60a5fa",
      "--text-key-display": "#bfdbfe",
      "--key-display-bg": "#60a5fa26",
      "--key-display-border": "#3b82f666",
      "--selected-answer-bg": "#22334f",
    },
  },
  Purple: {
    name: "סגול",
    colors: {
      "--primary-color": "#8b5cf6",
      "--primary-color-light": "#a78bfa",
      "--text-key-display": "#c4b5fd",
      "--key-display-bg": "#a78bfa26",
      "--key-display-border": "#8b5cf666",
      "--selected-answer-bg": "#30254d",
    },
  },
  bubblegum: {
    name: "ורוד מסטיק",
    colors: {
      "--primary-color": "#fb6f92",
      "--primary-color-light": "#ffb3c6",
      "--text-key-display": "#ffe0ec",
      "--key-display-bg": "#ffb3c626",
      "--key-display-border": "#fb6f9266",
      "--selected-answer-bg": "#412630",
    },
  },
  orange: {
    name: "כתום נועז",
    colors: {
      "--primary-color": "#f97316",
      "--primary-color-light": "#fb923c",
      "--text-key-display": "#fed7aa",
      "--key-display-bg": "#fb923c26",
      "--key-display-border": "#f9731666",
      "--selected-answer-bg": "#402c20",
    },
  },
};

const timerOptions = {
  180: "3 דקות",
  300: "5 דקות",
  600: "10 דקות",
  900: "15 דקות",
};

// Default settings
let currentSettings = {
  theme: "blue",
  timerDuration: 600,
  numQuestions: "all",
  playMusic: false,
};

const quizTopics = [
  {
    name: "ביטוויז",
    difficulties: [
      { name: "שאלות קלות", file: "quizzes/bitwise_easy.js" },
      { name: "שאלות קשות", file: "quizzes/bitwise_hard.js" },
    ],
  },
  { name: "תהליך הקומפילציה", file: "quizzes/compilation.js" },
  { name: "תווים ומחרוזות", file: "quizzes/strings.js" },
  { name: "מאקרו", file: "quizzes/macros.js" },
  { name: "פונקציות", file: "quizzes/functions.js" },
  { name: "פוינטרים", file: "quizzes/pointers.js" },
];

Prism.plugins.autoloader.languages_path =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";

document.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("keydown", handleKeyPress);
window.addEventListener("resize", () => {
  if (!isDeviceMobile) {
    if (window.innerWidth < 1100 || window.innerHeight < 600) {
      document.getElementById("pleaseEnlargeScreen").style.display = "flex";
    } else {
      document.getElementById("pleaseEnlargeScreen").style.display = "none";
    }
  }
});

function initializeApp() {
  const isMobile =
    navigator.maxTouchPoints > 0 && /Mobi|Android/i.test(navigator.userAgent);
  isDeviceMobile = isMobile;
  if (isMobile) {
    document.getElementById("mobileBlocker").style.display = "flex";
    return;
  }
  if (window.innerWidth < 1100 || window.innerHeight < 600) {
    document.getElementById("pleaseEnlargeScreen").style.display = "flex";
  }
  document.addEventListener("click", handleGlobalClick);

  loadSettings();
  buildPanels(); // Renamed and refactored
  initializeWelcomeScreen();
  setupScrollListeners();
}

function saveSettings() {
  localStorage.setItem("quizSettings", JSON.stringify(currentSettings));
}

function loadSettings() {
  const savedSettings = localStorage.getItem("quizSettings");
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    currentSettings = {
      theme: parsedSettings.theme ?? "default",
      timerDuration: parsedSettings.timerDuration ?? 600,
      numQuestions: parsedSettings.numQuestions ?? "all",
      playMusic: parsedSettings.playMusic ?? false,
    };
  }
  applyTheme(currentSettings.theme);
}

function applyTheme(themeName) {
  const palette = palettes[themeName];
  if (!palette) return;

  currentSettings.theme = themeName;
  for (const [property, value] of Object.entries(palette.colors)) {
    document.documentElement.style.setProperty(property, value);
  }

  document.querySelectorAll(".palette-option").forEach((opt) => {
    opt.classList.toggle("selected", opt.dataset.theme === themeName);
  });
}

function setTimer(duration, element) {
  currentSettings.timerDuration = parseInt(duration, 10);
  document
    .querySelectorAll(".time-option")
    .forEach((opt) => opt.classList.remove("selected"));
  element.classList.add("selected");
  saveSettings();
}

function setQuestionAmount(amount, element) {
  currentSettings.numQuestions = amount;
  document
    .querySelectorAll(".amount-option")
    .forEach((opt) => opt.classList.remove("selected"));
  element.classList.add("selected");
  saveSettings();
}

/**
 * Creates a confetti-like explosion of Python icons from the cursor's position.
 * @param {MouseEvent} e - The mouse event from the click.
 */
function createPythonConfetti(e) {
  const confettiCount = 15; // יותר אייקונים
  const style = getComputedStyle(document.documentElement);
  const colors = [
    style.getPropertyValue("--primary-color").trim(),
    style.getPropertyValue("--primary-color-light").trim(),
    style.getPropertyValue("--selected-answer-bg").trim(),
  ];

  for (let i = 0; i < confettiCount; i++) {
    // Stagger the creation of each icon for a more dynamic effect
    setTimeout(() => {
      const confetti = document.createElement("i");
      // שימוש באייקון הפייתון הנכון
      confetti.className = "fa-brands fa-python python-confetti";

      // Position the icon at the cursor's click location
      confetti.style.left = e.clientX + "px";
      confetti.style.top = e.clientY + "px";

      // Assign a random color from the current theme's palette
      confetti.style.color = colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(confetti);

      // Define random animation parameters
      const endX = (Math.random() - 0.5) * 400; // Horizontal travel
      const endY = (Math.random() - 0.8) * 400; // Vertical travel (more upwards)
      const rotation = Math.random() * 540;
      const duration = 2500 + Math.random() * 1500; // תנועה איטית יותר

      // Animate using the Web Animations API
      const animation = confetti.animate(
        [
          { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.1, 0.9, 0.2, 1)",
          fill: "forwards",
        }
      );

      // Remove the icon from the DOM after the animation completes
      animation.onfinish = () => {
        confetti.remove();
      };
    }, i * 60); // Stagger delay
  }
}

function buildPanels() {
  buildSettingsPanel();
  buildInstructionsPanel();
  buildTestPanel(); // New: Build test panel

  // Attach event listeners to footer buttons
  document
    .querySelectorAll(".welcome-footer-buttons .footer-btn")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const panelId = btn.dataset.panel;
        togglePanel(panelId);
      });
    });
}

function buildSettingsPanel() {
  const container = document.getElementById("settingsPanelContainer");
  if (!container) return;

  const panel = document.createElement("div");
  panel.id = "settingsPanel";
  panel.className = "settings-panel";

  // 1. Timer
  let timerHTML = `<div class="settings-section">
        <h3 class="settings-title">כמות זמן לכל שאלה</h3>
        <div class="settings-options-grid">`;
  for (const [seconds, text] of Object.entries(timerOptions)) {
    const isSelected =
      parseInt(seconds, 10) === currentSettings.timerDuration ? "selected" : "";
    timerHTML += `<button class="time-option ${isSelected}" data-duration="${seconds}">${text}</button>`;
  }
  timerHTML += `</div></div>`;

  // 2. Number of Questions
  const questionAmountOptions = {
    3: "3 שאלות",
    5: "5 שאלות",
    7: "7 שאלות",
    all: "כל השאלות בנושא",
  };
  let amountHTML = `<div class="settings-section">
        <h3 class="settings-title">כמות שאלות בכל חידון</h3>
        <div class="settings-options-grid">`;
  for (const [amount, text] of Object.entries(questionAmountOptions)) {
    const isSelected =
      String(currentSettings.numQuestions) === amount ? "selected" : "";
    amountHTML += `<button class="amount-option ${isSelected}" data-amount="${amount}">${text}</button>`;
  }
  amountHTML += `</div></div>`;

  // 3. Palettes
  let paletteHTML = `<div class="settings-section">
        <h3 class="settings-title">בחירת צבע לאתר</h3>
        <div class="settings-options-grid">`;
  Object.entries(palettes).forEach(([key, palette], index) => {
    const isSelected = key === currentSettings.theme ? "selected" : "";
    paletteHTML += `<div class="palette-option ${isSelected}" data-theme="${key}">
            <div class="palette-colors">
                <span class="palette-color" style="background-color: ${palette.colors["--primary-color"]};"></span>
                <span class="palette-color" style="background-color: ${palette.colors["--primary-color-light"]};"></span>
                <span class="palette-color" style="background-color: ${palette.colors["--text-key-display"]};"></span>
            </div>
        </div>`;
    if ((index + 1) % 4 === 0 && index + 1 < Object.keys(palettes).length) {
      paletteHTML += `</div><div class="settings-options-grid" style="margin-top: 10px;">`;
    }
  });
  paletteHTML += `</div></div>`;

  // 4. Music Setting
  let musicSettingHTML = `<div class="settings-section">
        <h3 class="settings-title">מוזיקה</h3>
        <div class="settings-options-list">
            <div class="settings-option-toggle" id="togglePlayMusic">
                <span>הפעלת מוזיקת רקע שתעשה לכם סיוטים בלילות</span>
                <label class="switch">
                    <input type="checkbox" id="playMusic" ${
                      currentSettings.playMusic ? "checked" : ""
                    }>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>`;

  panel.innerHTML = [paletteHTML, timerHTML, amountHTML, musicSettingHTML].join(
    "<hr>"
  );

  container.appendChild(panel);

  // Add event listeners for settings
  document.querySelectorAll(".time-option").forEach((btn) => {
    btn.addEventListener("click", () => setTimer(btn.dataset.duration, btn));
  });

  document.querySelectorAll(".amount-option").forEach((btn) => {
    btn.addEventListener("click", () =>
      setQuestionAmount(btn.dataset.amount, btn)
    );
  });

  document.querySelectorAll(".palette-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      applyTheme(opt.dataset.theme);
      saveSettings();
    });
  });

  // --- New Easter Egg Logic ---
  const musicToggle = document.getElementById("togglePlayMusic");
  const pythonFollower = document.getElementById("python-follower");
  // ✅ תפיסת האלמנטים החדשים
  const bgIconLeft = document.getElementById("bg-icon-left");
  const bgIconRight = document.getElementById("bg-icon-right");

  if (musicToggle && pythonFollower) {
    musicToggle.addEventListener("mouseenter", () => {
      // --- ✅ לוגיקה חדשה לקביעת גובה רנדומלי ---
      const randomBottom = Math.floor(Math.random() * 35) + 5; // יוצר מספר בין 5 ל-40
      const randomTop = Math.floor(Math.random() * 35) + 5; // יוצר מספר בין 5 ל-40

      // קביעת הגובה החדש לפני שהאייקונים מופיעים
      bgIconLeft.style.bottom = `${randomBottom}%`;
      bgIconLeft.style.top = `auto`; // איפוס הגדרת top למניעת התנגשות

      bgIconRight.style.top = `${randomTop}%`;
      bgIconRight.style.bottom = `auto`; // איפוס הגדרת bottom למניעת התנגשות

      pythonFollower.classList.remove("hidden");
      // ✅ הצגת אייקוני הרקע
      bgIconLeft.classList.remove("hidden");
      bgIconRight.classList.remove("hidden");
      musicToggle.style.cursor = "none";
    });

    musicToggle.addEventListener("mouseleave", () => {
      pythonFollower.classList.add("hidden");
      // ✅ הסתרת אייקוני הרקע
      bgIconLeft.classList.add("hidden");
      bgIconRight.classList.add("hidden");
      musicToggle.style.cursor = "auto";
    });

    musicToggle.addEventListener("mousemove", (e) => {
      pythonFollower.style.left = `${e.clientX}px`;
      pythonFollower.style.top = `${e.clientY}px`;
    });

    musicToggle.addEventListener("click", (e) => {
      createPythonConfetti(e);

      // Original logic for toggling the setting
      const input = document.getElementById("playMusic");
      const switchLabel = input.closest(".switch");

      if (!switchLabel.contains(e.target)) {
        input.checked = !input.checked;
      }

      currentSettings.playMusic = input.checked;
      saveSettings();
    });
  }
}

function buildInstructionsPanel() {
  const container = document.getElementById("instructionsPanelContainer");
  if (!container) return;

  const panel = document.createElement("div");
  panel.id = "instructionsPanel";
  panel.className = "instructions-panel";

  panel.innerHTML = `
    <div class="panel-content">
        <h3 class="settings-title">ברוכים הבאים!</h3>
        <p>
        האתר הזה מכיל 70 שאלות אמריקאיות מתוך 50 המבחנים האחרונים שמצאתי בדרייב.
        </p>
        <p>
        כשאתם בוחרים נושא, יוצגו בפניכם כל השאלות שבמאגר הקשורות אליו. אם תעדיפו תרגול קצר יותר, תוכלו לשנות את מספר השאלות דרך ההגדרות.        </p>
        <p>אם נתקעתם, תוכלו להשתמש בכפתור ה"רמז" שנמצא בפינה הימנית למטה.</p>
        <p>
        בסיום כל שאלה, יופיע כפתור נוסף עם הסבר לתשובה (שנכתב בעזרת Ai, אז קחו אותו בערבון מוגבל). </p>
        <hr>
        <p>
        אמיצים? לחצו על כפתור ה"ערבוב" במסך הבית (שמאל למטה) כדי לקבל חידון עם מספר שאלות לבחירתכם, מכל הנושאים יחד. </p>        <hr>
        <div class="how-to-play">
            <h3 class="settings-title">קיצורי מקשים למגניבים</h3>
            <ul class="instructions-list">
                <li><span class="key-display">1</span> - <span class="key-display">6</span> לבחירת תשובה</li>
                <li><span class="key-display">Enter</span> לבדיקה ולמעבר שאלה</li>
                <li><span class="key-display">H</span> לקבלת רמז</li>
            </ul>
        </div>
    </div>
  `;
  container.appendChild(panel);
}

function buildTestPanel() {
  const container = document.getElementById("testPanelContainer");
  if (!container) return;

  const panel = document.createElement("div");
  panel.id = "testPanel";
  panel.className = "test-panel";

  panel.innerHTML = `
    <div class="test-panel-content">
        <h3 class="settings-title">מקבץ שאלות אקראי</h3>
        <p>בחרו את כמות השאלות שתרצו בחידון</p>
        <div class="test-options-grid">
            <button class="test-option-btn" data-num-questions="3">3 שאלות</button>
            <button class="test-option-btn" data-num-questions="5">5 שאלות</button>
            <button class="test-option-btn" data-num-questions="7">7 שאלות</button>
        </div>
    </div>
  `;
  container.appendChild(panel);

  document.querySelectorAll("#testPanel .test-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const numQuestions = parseInt(btn.dataset.numQuestions, 10);
      togglePanel("testPanel"); // סגור את הפאנל
      loadAndStartMixedQuiz(numQuestions); // הפעל את לוגיקת הערבוב
    });
  });
}

function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById("settingsOverlay"); // Reusing the overlay

  if (!panel) return;

  const isVisible = panel.classList.contains("visible");

  // Close any currently active panel first
  if (activePanel && activePanel !== panel) {
    activePanel.classList.remove("visible");
  }

  panel.classList.toggle("visible", !isVisible);
  overlay.classList.toggle("visible", !isVisible);
  activePanel = isVisible ? null : panel; // Update active panel reference
}

function initializeWelcomeScreen() {
  showScreen("welcomeScreen");
  const topicContainer = document.getElementById("topicContainer");
  if (topicContainer) {
    topicContainer.innerHTML = "";
    quizTopics.forEach((topic) => {
      const button = document.createElement("button");
      button.className = "topic-btn";
      button.textContent = topic.name;
      if (topic.difficulties) {
        button.onclick = () => showDifficultyModal(topic);
      } else {
        button.onclick = () => loadAndStartQuiz(topic.file);
      }
      topicContainer.appendChild(button);
    });
  }
}

function showDifficultyModal(topic) {
  const overlay = document.createElement("div");
  overlay.className = "difficulty-modal-overlay";

  const modal = document.createElement("div");
  modal.className = "difficulty-modal";

  const title = document.createElement("h3");
  title.className = "difficulty-modal-title";
  title.textContent = "בחר רמת קושי";
  modal.appendChild(title);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "difficulty-modal-buttons";

  topic.difficulties.forEach((difficulty) => {
    const button = document.createElement("button");
    button.className = "topic-btn";
    button.textContent = difficulty.name;
    button.onclick = () => {
      document.body.removeChild(overlay);
      loadAndStartQuiz(difficulty.file);
    };
    buttonContainer.appendChild(button);
  });

  modal.appendChild(buttonContainer);
  overlay.appendChild(modal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  document.body.appendChild(overlay);
}

function setupScrollListeners() {
  const quizContent = document.getElementById("quizContent");
  const codeBlockEl = document.getElementById("code-block");

  // Vertical scroll for quiz card
  if (quizContent) {
    quizContent.addEventListener("scroll", () =>
      handleScroll(quizContent, document.getElementById("quizCard"))
    );
  }

  // Vertical scroll for code card
  if (codeBlockEl) {
    codeBlockEl.addEventListener("scroll", () =>
      handleScroll(codeBlockEl, document.getElementById("codeCard"))
    );
  }
}

function handleScroll(element, parentCard) {
  if (!element || !parentCard) return;
  const { scrollTop, scrollHeight, clientHeight } = element;

  parentCard.classList.toggle("has-scrolled", scrollTop > 10);
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
  parentCard.classList.toggle("scrolled-to-end", isAtBottom);
}

function checkScrollability() {
  const quizContent = document.getElementById("quizContent");
  const codeBlock = document.getElementById("code-block");
  const quizCard = document.getElementById("quizCard");
  const codeCard = document.getElementById("codeCard");

  if (quizContent && quizCard) {
    const isQuizScrollable =
      quizContent.scrollHeight > quizContent.clientHeight;
    quizCard.classList.toggle("is-scrollable", isQuizScrollable);
    handleScroll(quizContent, quizCard);
  }

  if (codeBlock && codeCard) {
    const isCodeScrollable = codeBlock.scrollHeight > codeBlock.clientHeight;
    codeCard.classList.toggle("is-scrollable", isCodeScrollable);
    handleScroll(codeBlock, codeCard);
  }
}

function hideTooltipsAndListeners() {
  document
    .querySelectorAll(".tooltip-container.visible")
    .forEach((container) => {
      container.classList.remove("visible");
      // הסר את הקלאס הפעיל מהכפתור שבתוך התיבה שנסגרת
      container.querySelector(".tooltip-btn")?.classList.remove("active");
    });
}

function toggleTooltip(container) {
  // שמור את המצב הנוכחי של התיבה שעליה לחצו
  const isCurrentlyVisible = container.classList.contains("visible");

  // ראשית, סגור את כל שאר התיבות הפתוחות ובטל את הכפתורים שלהן
  hideTooltipsAndListeners();

  // כעת, הפוך את המצב של התיבה הנוכחית
  if (!isCurrentlyVisible) {
    container.classList.add("visible");
    container.querySelector(".tooltip-btn")?.classList.add("active");
  }
}
function handleGlobalClick(e) {
  if (!e.target.closest(".tooltip-container")) {
    hideTooltipsAndListeners();
  }

  const overlay = document.getElementById("settingsOverlay");
  // Check if an active panel is open and the click is outside it
  if (
    activePanel &&
    !e.target.closest(`#${activePanel.id}`) &&
    !e.target.closest(".footer-btn")
  ) {
    togglePanel(activePanel.id); // Close the active panel
  }
}

function handleKeyPress(e) {
  if (document.getElementById("endScreen").classList.contains("visible")) {
    return;
  }

  const key = e.key.toLowerCase();

  // Close active panel on Enter if a panel is open and Enter is not for quiz navigation
  if (key === "enter" && activePanel) {
    e.preventDefault();
    togglePanel(activePanel.id);
    return;
  }

  if (key === "enter") {
    e.preventDefault();
    document.getElementById("nextBtn")?.click();
    return;
  }

  if (key === "h" || key === "י") {
    e.preventDefault();
    const hintContainer = document
      .getElementById("hintContainer")
      ?.querySelector(".tooltip-container");
    if (hintContainer && !hintContainer.classList.contains("disabled")) {
      toggleTooltip(hintContainer);
    }
    return;
  }

  if (answered) return;

  if (["1", "2", "3", "4", "5", "6"].includes(key)) {
    e.preventDefault();
    hideTooltipsAndListeners();
    const answerIndex = parseInt(key, 10) - 1;
    document
      .querySelector(`.answer-option[data-answer="${answerIndex}"]`)
      ?.click();
  }
}

function showScreen(screenId) {
  document
    .querySelectorAll(".welcome-screen, .container, .end-screen")
    .forEach((screen) => {
      screen.classList.remove("visible");
    });
  const screenElement = document.getElementById(screenId);
  screenElement.classList.add("visible");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isLtrText(text) {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return !hebrewRegex.test(String(text));
}

function loadAndStartQuiz(quizFile) {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.classList.add("visible"); // הצג מסך טעינה מיד

  const oldScript = document.getElementById("quiz-data-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.src = quizFile;
  script.id = "quiz-data-script";

  script.onload = async () => {
    if (typeof quizData !== "undefined" && quizData.length > 0) {
      initQuiz();
      await loadQuestion(); // המתן לטעינת השאלה

      loadingOverlay.classList.remove("visible"); // הסתר את מסך הטעינה
      showScreen("mainContainer"); // הצג את מסך החידון המוכן

      const quizLayoutGrid = document.getElementById("quizLayoutGrid");
      quizLayoutGrid.classList.add("initial-load");
      setTimeout(() => {
        quizLayoutGrid.classList.remove("initial-load");
        checkScrollability();
      }, 400);
    } else {
      loadingOverlay.classList.remove("visible");
      console.error("Failed to load quiz data from:", quizFile);
      alert("שגיאה בטעינת השאלון. אנא נסה שוב.");
    }
  };
  script.onerror = () => {
    loadingOverlay.classList.remove("visible");
    console.error("Error loading script:", quizFile);
    alert("לא ניתן היה למצוא את קובץ השאלון.");
  };
  document.body.appendChild(script);
}

function initQuiz() {
  sessionQuizData = JSON.parse(JSON.stringify(quizData));

  shuffleArray(sessionQuizData);

  // Slice the array based on settings
  if (currentSettings.numQuestions !== "all") {
    const num = parseInt(currentSettings.numQuestions, 10);
    if (sessionQuizData.length > num) {
      sessionQuizData = sessionQuizData.slice(0, num);
    }
  }

  sessionQuizData.forEach((question) => {
    if (question.answers) {
      const correctAnswerText = question.answers[question.correct];
      shuffleArray(question.answers);
      question.correct = question.answers.indexOf(correctAnswerText);
    }
  });

  currentQuestion = 0;
  score = 0;
  isFirstErrorOccurred = false;
  document.getElementById("totalQ").textContent = sessionQuizData.length;
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = currentSettings.timerDuration;
  const timerSpan = document.getElementById("timer");
  const timerContainer = timerSpan.closest(".timer"); // Get the parent .timer element
  const timerIcon = timerContainer.querySelector(".icon-purple"); // Get the icon

  // Reset any previous states
  timerContainer.style.animation = "";
  timerContainer.classList.remove("critical-time");
  timerIcon.classList.remove("fa-bomb");
  timerIcon.classList.add("fa-clock");

  const update = () => {
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      if (timerSpan) timerSpan.textContent = "00:00";
      timerContainer.style.animation = ""; // Stop animation
      timerContainer.classList.remove("critical-time"); // Remove red text
      timerIcon.classList.remove("fa-bomb"); // Remove bomb icon
      timerIcon.classList.add("fa-clock"); // Restore clock icon

      const msgElement = document.getElementById("timerOutMessage");
      if (msgElement) {
        msgElement.textContent = "חחחח סתם רציתי להלחיץ, אין משמעות לטיימר";
        msgElement.classList.add("visible");
        setTimeout(() => msgElement.classList.remove("visible"), 4000);
      }

      return;
    }

    if (timerSpan) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerSpan.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    // Timer flashing logic
    if (timeLeft <= 30 && timeLeft > 10) {
      timerContainer.style.animation =
        "timerFlashWarning 1s infinite steps(2, start)";
      timerContainer.classList.remove("critical-time");
      timerIcon.classList.remove("fa-bomb");
      timerIcon.classList.add("fa-clock");
    } else if (timeLeft <= 10) {
      timerContainer.style.animation =
        "timerFlashCritical 0.5s infinite steps(2, start)";
      timerContainer.classList.add("critical-time"); // Red text
      timerIcon.classList.remove("fa-clock");
      timerIcon.classList.add("fa-bomb"); // Bomb icon
    } else {
      timerContainer.style.animation = ""; // No animation
      timerContainer.classList.remove("critical-time");
      timerIcon.classList.remove("fa-bomb");
      timerIcon.classList.add("fa-clock");
    }

    timeLeft--;
  };
  update();
  timerInterval = setInterval(update, 1000);
}

function attachTooltipListener(containerId) {
  const container = document.getElementById(containerId);
  const tooltipContainer = container?.querySelector(".tooltip-container");
  if (tooltipContainer) {
    tooltipContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTooltip(tooltipContainer);
    });
  }
}

function setupHighlightListeners() {
  const codeSlots = document.querySelectorAll("#codeDisplay .code-slot");
  codeSlots.forEach((slot) => {
    const slotId = slot.dataset.slotId;
    if (!slotId) return;

    slot.addEventListener("mouseenter", () => {
      const answerSlots = document.querySelectorAll(
        `.answer-slot[data-slot-id="${slotId}"]`
      );
      answerSlots.forEach((answerSlot) =>
        answerSlot.classList.add("highlight")
      );
    });

    slot.addEventListener("mouseleave", () => {
      const answerSlots = document.querySelectorAll(
        `.answer-slot[data-slot-id="${slotId}"]`
      );
      answerSlots.forEach((answerSlot) =>
        answerSlot.classList.remove("highlight")
      );
    });
  });

  const allAnswerSlots = document.querySelectorAll(".answer-slot");
  allAnswerSlots.forEach((slot) => {
    const slotId = slot.dataset.slotId;
    if (!slotId) return;

    slot.addEventListener("mouseenter", () => {
      const codeSlot = document.querySelector(
        `.code-slot[data-slot-id="${slotId}"]`
      );
      if (codeSlot) {
        codeSlot.classList.add("highlight");
      }
    });

    slot.addEventListener("mouseleave", () => {
      const codeSlot = document.querySelector(
        `.code-slot[data-slot-id="${slotId}"]`
      );
      if (codeSlot) {
        codeSlot.classList.remove("highlight");
      }
    });
  });
}

function formatText(text) {
  if (typeof text !== "string") {
    return String(text);
  }

  const slotPlaceholders = new Map();
  let placeholderIndex = 0;

  let processedText = text.replace(
    /\[\[(\d+):\s*([\s\S]+?)\]\]/g,
    (match, slotId, rawContent) => {
      let content = rawContent.trim();
      if (content.startsWith("$$") && content.endsWith("$$")) {
        content = content.substring(2, content.length - 2).trim();
      }

      const escapedContent = content.replace(/</g, "<").replace(/>/g, ">");

      const slotHTML = `<span class="answer-slot" data-slot-id="${slotId}">
                          <span class="answer-slot-number">${slotId}</span>
                          <code class="answer-slot-code">${escapedContent}</code>
                        </span>`;

      const placeholder = `__SLOT_PLACEHOLDER_${placeholderIndex++}__`;
      slotPlaceholders.set(placeholder, slotHTML);
      return placeholder;
    }
  );

  processedText = processedText
    .split("\n")
    .map((paragraph) => (paragraph.trim() ? `<p>${paragraph}</p>` : ""))
    .join("");

  slotPlaceholders.forEach((slotHTML, placeholder) => {
    const regex = new RegExp(`<p>${placeholder}</p>|${placeholder}`, "g");
    processedText = processedText.replace(regex, slotHTML);
  });

  processedText = processedText.replace(/`([^`]+)`/g, "<code>$1</code>");

  return processedText;
}

function loadQuestion() {
  const quizCard = document.getElementById("quizCard");
  const codeCard = document.getElementById("codeCard");
  if (quizCard)
    quizCard.classList.remove(
      "is-scrollable",
      "has-scrolled",
      "scrolled-to-end"
    );
  if (codeCard)
    codeCard.classList.remove(
      "is-scrollable",
      "has-scrolled",
      "scrolled-to-end"
    );

  return new Promise((resolve) => {
    if (currentQuestion >= sessionQuizData.length) {
      showEndScreen();
      resolve(); // נפתור את ההבטחה גם במסך הסיום
      return;
    }

    const quizLayoutGrid = document.getElementById("quizLayoutGrid");
    quizLayoutGrid.classList.add("fade-out");

    setTimeout(() => {
      document.getElementById("timerOutMessage")?.classList.remove("visible");
      hideTooltipsAndListeners();
      document.getElementById("quizContent").scrollTop = 0;
      const codeBlock = document.getElementById("code-block");
      if (codeBlock) codeBlock.scrollTop = 0;

      document.getElementById("currentQ").textContent = currentQuestion + 1;

      const question = sessionQuizData[currentQuestion];
      const codeDisplay = document.getElementById("codeDisplay");
      if (question.code && question.code.trim() !== "") {
        quizLayoutGrid.classList.remove("no-code-mode");
        const rawCode = question.code;
        const placeholderMap = new Map();
        let placeholderCounter = 0;
        const codeWithPlaceholders = rawCode.replace(
          /\[\[\s*(\d+)\s*\]\]/g,
          (match, slotId) => {
            const placeholder = `SLOT_PLACEHOLDER_${placeholderCounter++}_END`;
            placeholderMap.set(placeholder, slotId);
            return placeholder;
          }
        );
        const highlighted = Prism.highlight(
          codeWithPlaceholders,
          Prism.languages.c,
          "c"
        );
        let finalHTML = highlighted;
        placeholderMap.forEach((slotId, placeholder) => {
          const slotHTML = `<span class="code-slot" data-slot-id="${slotId}">${slotId}</span>`;
          finalHTML = finalHTML.replace(new RegExp(placeholder, "g"), slotHTML);
        });
        codeDisplay.innerHTML = finalHTML;
      } else {
        quizLayoutGrid.classList.add("no-code-mode");
        codeDisplay.innerHTML = "";
      }

      document.getElementById("hintContainer").innerHTML = "";
      document.getElementById("explanationContainer").innerHTML = "";

      if (question.hint) {
        document.getElementById("hintContainer").innerHTML = `
          <div class="tooltip-container">
              <button class="tooltip-btn">רמז</button>
              <div class="tooltip-popup">${formatText(question.hint)}</div>
          </div>`;
        attachTooltipListener("hintContainer");
      }

      document.getElementById("questionTitle").innerHTML = formatText(
        question.question
      );

      const answersContainer = document.getElementById("answersContainer");
      answersContainer.innerHTML = "";
      question.answers.forEach((answer, index) => {
        const option = document.createElement("div");
        option.className = "answer-option";
        if (isLtrText(answer)) option.classList.add("ltr-answer");
        option.setAttribute("data-answer", index);
        option.innerHTML = `<span class="answer-text">${formatText(
          answer
        )}</span>`;
        option.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(option);
      });

      if (answersContainer.querySelector(".answer-slot")) {
        answersContainer.classList.add("center-align-answers");
      } else {
        answersContainer.classList.remove("center-align-answers");
      }

      selectedAnswer = null;
      answered = false;
      document.getElementById("nextBtn").textContent = "בדיקה";
      document.getElementById("nextBtn").disabled = true;

      // הפעלת המוזיקה אם האפשרות פעילה
      if (currentSettings.playMusic && backgroundMusic) {
        // המשתמש ביצע אינטראקציה, לכן הניגון אמור לעבוד
        backgroundMusic
          .play()
          .catch((e) => console.error("Audio play failed:", e));
      }

      startTimer();
      quizLayoutGrid.classList.remove("fade-out");
      quizLayoutGrid.classList.add("fade-in");
      setTimeout(() => {
        quizLayoutGrid.classList.remove("fade-in");
        checkScrollability();
        setupHighlightListeners();
        isTransitioning = false;
        resolve(); // נפתור את ההבטחה רק אחרי שהכל באמת הסתיים
      }, 300);
    }, 300);
  });
}

function checkAnswer() {
  // 1. עצירת מוזיקת הרקע
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  if (selectedAnswer === null) return;
  clearInterval(timerInterval);
  answered = true;
  hideTooltipsAndListeners();

  const hintTooltip = document
    .getElementById("hintContainer")
    ?.querySelector(".tooltip-container");
  if (hintTooltip) hintTooltip.classList.add("disabled");

  const question = sessionQuizData[currentQuestion];
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option) => (option.style.pointerEvents = "none"));
  options[question.correct].classList.add("correct");

  if (selectedAnswer === question.correct) {
    // 2. הפעלת סאונד של תשובה נכונה
    if (correctSound && currentSettings.playMusic) {
      correctSound.currentTime = 0;
      correctSound.play();
    }

    score++;
    // הצגת הסבר אם קיים
    if (question.explanation) {
      document.getElementById("explanationContainer").innerHTML = `
        <div class="tooltip-container">
          <button class="tooltip-btn">הסבר תשובה</button>
          <div class="tooltip-popup">${formatText(question.explanation)}</div>
        </div>`;
      attachTooltipListener("explanationContainer");
    }
  } else {
    // 3. הפעלת סאונד של תשובה שגויה
    if (incorrectSound && currentSettings.playMusic) {
      incorrectSound.currentTime = 0;
      incorrectSound.play();
    }

    options[selectedAnswer].classList.add("incorrect");

    if (question.explanation) {
      document.getElementById("explanationContainer").innerHTML = `
      <div class="tooltip-container">
          <button class="tooltip-btn">הסבר תשובה</button>
          <div class="tooltip-popup">${formatText(question.explanation)}</div>
        </div>`;
      attachTooltipListener("explanationContainer");
    }
  }

  const nextBtn = document.getElementById("nextBtn");
  const newText =
    currentQuestion === sessionQuizData.length - 1 ? "סיום" : "השאלה הבאה";
  nextBtn.textContent = newText;

  nextBtn.classList.add("button-pop");

  nextBtn.addEventListener(
    "animationend",
    () => {
      nextBtn.classList.remove("button-pop");
    },
    { once: true }
  );
}
function selectAnswer(index) {
  if (answered) return;
  hideTooltipsAndListeners();
  document
    .querySelectorAll(".answer-option")
    .forEach((option) => option.classList.remove("selected"));
  document.querySelector(`[data-answer="${index}"]`).classList.add("selected");
  selectedAnswer = index;
  document.getElementById("nextBtn").disabled = false;
}

function handleNextAction() {
  if (isTransitioning) return;

  if (!answered) {
    checkAnswer();
  } else {
    isTransitioning = true;
    currentQuestion++;
    loadQuestion();
  }
}
document.getElementById("nextBtn").onclick = handleNextAction;

async function fetchQuizData(quizFile) {
  try {
    const response = await fetch(quizFile);
    if (!response.ok) {
      throw new Error(`שגיאת HTTP! סטטוס: ${response.status}`);
    }
    const scriptText = await response.text();

    // ניצור פונקציה שמריצה את קוד השאלון באופן מבודד
    // ומחזירה את המשתנה quizData מתוכו
    const getData = new Function(`${scriptText}; return quizData;`);
    const data = getData();

    if (Array.isArray(data)) {
      return data; // אין צורך בעותק עמוק כי אין משתנה גלובלי משותף
    } else {
      console.error("שגיאת פורמט נתונים בקובץ:", quizFile);
      return [];
    }
  } catch (error) {
    console.error(`נכשל בטעינה או ניתוח של קובץ ${quizFile}:`, error);
    return []; // החזר מערך ריק כדי למנוע קריסה של כל התהליך
  }
}

async function loadAndStartMixedQuiz(numQuestions) {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.classList.add("visible"); // הצג מסך טעינה מיד

  try {
    const allFiles = quizTopics.flatMap((topic) =>
      topic.difficulties ? topic.difficulties.map((d) => d.file) : topic.file
    );

    const allQuestionArrays = await Promise.all(
      allFiles.map((file) => fetchQuizData(file))
    );

    let allQuestions = allQuestionArrays.flat();
    shuffleArray(allQuestions);
    const selectedQuestions = allQuestions.slice(0, numQuestions);

    if (selectedQuestions.length < numQuestions) {
      alert(
        `שימו לב: נמצאו רק ${selectedQuestions.length} שאלות מתוך ה-${numQuestions} שביקשתם.`
      );
    }
    if (selectedQuestions.length === 0) {
      alert("שגיאה: לא נמצאו שאלות זמינות.");
      loadingOverlay.classList.remove("visible");
      return;
    }

    startQuizWithData(selectedQuestions); // הכן את הנתונים
    await loadQuestion(); // המתן לטעינת השאלה

    loadingOverlay.classList.remove("visible"); // הסתר את מסך הטעינה
    showScreen("mainContainer"); // הצג את מסך החידון המוכן

    const quizLayoutGrid = document.getElementById("quizLayoutGrid");
    quizLayoutGrid.classList.add("initial-load");
    setTimeout(() => quizLayoutGrid.classList.remove("initial-load"), 400);
  } catch (error) {
    loadingOverlay.classList.remove("visible");
    console.error("נכשל בטעינת קובץ אחד או יותר:", error);
    alert("שגיאה בטעינת קבצי השאלונים. אנא נסו שוב.");
  }
}

function startQuizWithData(questions) {
  sessionQuizData = questions;

  sessionQuizData.forEach((question) => {
    if (question.answers) {
      const correctAnswerText = question.answers[question.correct];
      shuffleArray(question.answers);
      question.correct = question.answers.indexOf(correctAnswerText);
    }
  });

  currentQuestion = 0;
  score = 0;
  isFirstErrorOccurred = false;
  document.getElementById("totalQ").textContent = sessionQuizData.length;
}

function showEndScreen() {
  // הוספה חדשה: עצירת המוזיקה
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  const endIconContainer = document.getElementById("endIconContainer");
  const endMessage = document.getElementById("endMessage");
  const endScoreDetails = document.getElementById("endScoreDetails");
  const totalQuestions = sessionQuizData.length;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  endIconContainer.classList.remove("animate-pop");
  void endIconContainer.offsetWidth;
  endIconContainer.classList.add("animate-pop");

  if (percentage === 100) {
    endIconContainer.innerHTML = '<i class="fas fa-trophy"></i>';
    endMessage.textContent = "אתה תותח אמיתי!";
    endScoreDetails.textContent = "ענית נכון על כל השאלות";
  } else if (percentage >= 80) {
    endIconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
    endMessage.textContent = "כל הכבוד!";
    endScoreDetails.textContent = `צדקת ב־${score} מתוך ${totalQuestions} שאלות`;
  } else if (percentage >= 30) {
    endIconContainer.innerHTML = '<i class="fas fa-thumbs-up"></i>';
    endMessage.textContent = "עבודה טובה";
    endScoreDetails.textContent = `צדקת ב־${score} מתוך ${totalQuestions} שאלות`;
  } else if (percentage > 0) {
    endIconContainer.innerHTML = '<i class="fas fa-poo"></i>';
    endMessage.textContent = "איזה מזל נאחס";
    endScoreDetails.textContent =
      "טעית בכל־כך הרבה שאלות, שסטטיסטית היה עדיף שתנחש";
  } else {
    endIconContainer.innerHTML = '<i class="fas fa-face-angry"></i>';
    endMessage.textContent = "אתה עושה לי דווקא?";
    endScoreDetails.textContent = "בחייאת ראבק, אין סיכוי שבאמת טעית בהכל";
  }
  showScreen("endScreen");
}
