let sessionQuizData = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timerInterval = null;

const quizTopics = [
  { name: "פוינטרים", file: "quizzes/pointers.js" },
  { name: "מחרוזות", file: "quizzes/strings.js" },
  { name: "מאקרואים", file: "quizzes/macros.js" },
  { name: "ביטוויז", file: "quizzes/bitwise.js" },
  { name: "קומפילציה", file: "quizzes/compilation.js" },
  { name: "שונות", file: "quizzes/other.js" },
];

Prism.plugins.autoloader.languages_path =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("keydown", handleKeyPress);
window.addEventListener("resize", () => {
  if (window.innerWidth < 1200 || window.innerHeight < 700) {
    document.getElementById("pleaseEnlargeScreen").style.display = "flex";
  } else {
    document.getElementById("pleaseEnlargeScreen").style.display = "none";
  }
});

function initializeApp() {
  const isMobile =
    navigator.maxTouchPoints > 0 && /Mobi|Android/i.test(navigator.userAgent);

  alert(isMobile);

  // בדיקה ראשונה: האם המשתמש גולש ממכשיר נייד?
  if (isMobile) {
    document.getElementById("mobileBlocker").style.display = "flex";
    return; // עצירת טעינת האתר
  }

  if (window.innerWidth < 1200 || window.innerHeight < 700) {
    document.getElementById("pleaseEnlargeScreen").style.display = "flex";
  }

  document.addEventListener("click", handleGlobalClick);

  initializeWelcomeScreen();
  setupScrollListeners();
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
      button.onclick = () => loadAndStartQuiz(topic.file);
      topicContainer.appendChild(button);
    });
  }
}

function setupScrollListeners() {
  const quizContent = document.getElementById("quizContent");
  const codeBlock = document.getElementById("code-block");

  if (quizContent) {
    quizContent.addEventListener("scroll", () =>
      handleScroll(quizContent, document.getElementById("quizCard"))
    );
  }
  if (codeBlock) {
    codeBlock.addEventListener("scroll", () =>
      handleScroll(codeBlock, document.getElementById("codeCard"))
    );
  }
}

function handleScroll(element, parentCard) {
  if (!element || !parentCard) return;
  const { scrollTop, scrollHeight, clientHeight } = element;

  // (ה) שליטה על נראות חץ עליון ותחתון
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

// script.js

// פונקציה שמסתירה את הבועיות ומסירה את המאזין לתזוזת העכבר
function hideTooltipsAndListeners() {
  document
    .querySelectorAll(".tooltip-container.visible")
    .forEach((container) => {
      container.classList.remove("visible");
    });
  // מסירים את המאזין כדי שלא ירוץ ללא צורך
  document.removeEventListener("mousemove", hideTooltipsAndListeners);
}

// פונקציה שמופעלת בלחיצת מקש או כפתור
function toggleTooltip(container) {
  const isVisible = container.classList.contains("visible");

  // סוגרים בועיות אחרות לפני פתיחת החדשה
  hideTooltipsAndListeners();

  container.classList.toggle("visible", !isVisible);

  // אם הבועית הוצגה, נוסיף מאזין חד-פעמי לתזוזת עכבר
  if (container.classList.contains("visible")) {
    document.addEventListener("mousemove", hideTooltipsAndListeners);
  }
}

// פונקציה גלובלית שמטפלת בקליקים כלליים
function handleGlobalClick(e) {
  // בדוק אם הקליק לא היה על כפתור שמציג בועית
  if (!e.target.closest(".tooltip-container")) {
    hideTooltipsAndListeners();
  }
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();
  if (key === "enter") {
    e.preventDefault();
    document.getElementById("nextBtn")?.click();
    return;
  }

  // Allow 'h' to work anytime for hint
  if (key === "h" || key === "י") {
    e.preventDefault();
    const hintContainer = document
      .getElementById("hintContainer")
      ?.querySelector(".tooltip-container");
    if (hintContainer && !hintContainer.classList.contains("disabled")) {
      toggleTooltip(hintContainer);
    }
    return; // Stop further execution for 'h'
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
  const oldScript = document.getElementById("quiz-data-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.src = quizFile;
  script.id = "quiz-data-script";
  script.onload = () => {
    if (typeof quizData !== "undefined" && quizData.length > 0) {
      showScreen("mainContainer");
      const quizLayoutGrid = document.getElementById("quizLayoutGrid");
      quizLayoutGrid.classList.add("initial-load");

      setTimeout(initQuiz, 50);
    } else {
      console.error("Failed to load quiz data from:", quizFile);
      alert("שגיאה בטעינת השאלון. אנא נסה שוב.");
    }
  };
  script.onerror = () => {
    console.error("Error loading script:", quizFile);
    alert("לא ניתן היה למצוא את קובץ השאלון.");
  };
  document.body.appendChild(script);
}

function initQuiz() {
  sessionQuizData = JSON.parse(JSON.stringify(quizData));
  shuffleArray(sessionQuizData);
  sessionQuizData.forEach((question) => {
    if (question.answers) {
      const correctAnswerText = question.answers[question.correct];
      shuffleArray(question.answers);
      question.correct = question.answers.indexOf(correctAnswerText);
    }
  });
  currentQuestion = 0;
  score = 0;
  document.getElementById("totalQ").textContent = sessionQuizData.length;
  loadQuestion();
  quizLayoutGrid.classList.remove("initial-load");
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = 3;
  const timerSpan = document.getElementById("timer");

  const update = () => {
    if (timeLeft < 0) {
      clearInterval(timerInterval);

      if (timerSpan) timerSpan.textContent = "00:00";

      const msgElement = document.getElementById("timerOutMessage");
      if (msgElement) {
        msgElement.textContent = "חחח סתם הלחצתי אתכם. אין משמעות לטיימר ";
        msgElement.classList.add("visible");
        setTimeout(() => {
          msgElement.classList.remove("visible");
        }, 4000);
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
    timeLeft--;
  };

  update();
  timerInterval = setInterval(update, 1000);
}

function attachTooltipListener(containerId) {
  const container = document.getElementById(containerId);
  const tooltipContainer = container?.querySelector(".tooltip-container");
  if (tooltipContainer) {
    // Listener is now only needed for click/toggle functionality
    tooltipContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTooltip(tooltipContainer);
    });
  }
}

function loadQuestion() {
  if (currentQuestion >= sessionQuizData.length) {
    showEndScreen();
    return;
  }

  const question = sessionQuizData[currentQuestion];
  const quizLayoutGrid = document.getElementById("quizLayoutGrid");

  quizLayoutGrid.classList.add("fade-out");

  setTimeout(() => {
    document.getElementById("timerOutMessage")?.classList.remove("visible");

    hideTooltipsAndListeners();
    document.getElementById("quizContent").scrollTop = 0;
    document.getElementById("code-block").scrollTop = 0;

    document.getElementById("currentQ").textContent = currentQuestion + 1;
    const codeDisplay = document.getElementById("codeDisplay");

    if (question.code && question.code.trim() !== "") {
      quizLayoutGrid.classList.remove("no-code-mode");
      codeDisplay.textContent = question.code;
      Prism.highlightElement(codeDisplay);
    } else {
      quizLayoutGrid.classList.add("no-code-mode");
      codeDisplay.textContent = "";
    }

    document.getElementById("hintContainer").innerHTML = "";
    document.getElementById("explanationContainer").innerHTML = "";

    if (question.hint) {
      document.getElementById("hintContainer").innerHTML = `
        <div class="tooltip-container">
            <button class="tooltip-btn">רמז</button>
            <div class="tooltip-popup">${formatAnswerText(question.hint)}</div>
        </div>`;
      attachTooltipListener("hintContainer");
    }

    document.getElementById("questionTitle").innerHTML = formatAnswerText(
      question.question
    );

    const answersContainer = document.getElementById("answersContainer");
    answersContainer.innerHTML = "";
    question.answers.forEach((answer, index) => {
      const option = document.createElement("div");
      option.className = "answer-option";
      if (isLtrText(answer)) option.classList.add("ltr-answer");
      option.setAttribute("data-answer", index);
      option.innerHTML = `<div class="answer-text">${formatAnswerText(
        answer
      )}</div>`;
      option.addEventListener("click", () => selectAnswer(index));
      answersContainer.appendChild(option);
    });

    selectedAnswer = null;
    answered = false;
    document.getElementById("nextBtn").textContent = "בדיקה";
    document.getElementById("nextBtn").disabled = true;

    startTimer();

    quizLayoutGrid.classList.remove("fade-out");
    quizLayoutGrid.classList.add("fade-in");

    setTimeout(() => {
      quizLayoutGrid.classList.remove("fade-in");
      checkScrollability();
    }, 300);
  }, 300); // Duration matches CSS transition
}

function checkAnswer() {
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

  const explanationContainer = document.getElementById("explanationContainer");

  if (selectedAnswer === question.correct) {
    score++;
  } else {
    options[selectedAnswer].classList.add("incorrect");
    if (question.explanation) {
      explanationContainer.innerHTML = `
        <div class="tooltip-container">
          <button class="tooltip-btn">הסבר תשובה</button>
          <div class="tooltip-popup">${formatAnswerText(
            question.explanation
          )}</div>
        </div>`;
      // No listener needed if it's pure hover, but we keep it for click support
      attachTooltipListener("explanationContainer");
    }
  }

  document.getElementById("nextBtn").textContent =
    currentQuestion === sessionQuizData.length - 1 ? "סיום" : "השאלה הבאה";
  document.getElementById("nextBtn").disabled = false;
}

function formatAnswerText(text) {
  if (typeof text !== "string") return String(text);
  return text.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\\n/g, "<br>");
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
  if (!answered) {
    checkAnswer();
  } else {
    currentQuestion++;
    loadQuestion();
  }
}
document.getElementById("nextBtn").onclick = handleNextAction;

function showEndScreen() {
  const endIconContainer = document.getElementById("endIconContainer");
  const endMessage = document.getElementById("endMessage");
  const endScoreDetails = document.getElementById("endScoreDetails");
  const totalQuestions = sessionQuizData.length;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  // (בונוס) إعادة تشغيل האנימציה
  endIconContainer.classList.remove("animate-pop");
  void endIconContainer.offsetWidth; // Trigger reflow
  endIconContainer.classList.add("animate-pop");

  if (percentage === 100) {
    endIconContainer.innerHTML = '<i class="fas fa-trophy"></i>';
    endMessage.textContent = "אתה תותח אמיתי!";
    endScoreDetails.textContent = `ענית נכון על כל ${totalQuestions} השאלות!`;
  } else if (percentage >= 80) {
    endIconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
    endMessage.textContent = "כל הכבוד!";
    endScoreDetails.textContent = `צדקת ב-${score} מתוך ${totalQuestions} שאלות.`;
  } else if (percentage >= 40) {
    endIconContainer.innerHTML = '<i class="fas fa-thumbs-up"></i>';
    endMessage.textContent = "לא רע בכלל!";
    endScoreDetails.textContent = `צדקת ב-${score} מתוך ${totalQuestions} שאלות, יש מקום לשיפור.`;
  } else if (percentage > 0) {
    endIconContainer.innerHTML = '<i class="fas fa-redo"></i>';
    endMessage.textContent = "אפשר להשתפר";
    endScoreDetails.textContent = `צדקת ב-${score} מתוך ${totalQuestions}. נסה שוב, בטוח שתצליח יותר!`;
  } else {
    // 0%
    endIconContainer.innerHTML = '<i class="fas fa-poo"></i>';
    endMessage.textContent = "אוי ואבוי...";
    endScoreDetails.textContent =
      "לא נורא, פעם הבאה תצליח. הכי חשוב זה ללמוד מהטעויות!";
  }
  showScreen("endScreen");
}
