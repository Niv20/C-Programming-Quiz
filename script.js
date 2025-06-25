let sessionQuizData = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timeLeft = 600;
let timerInterval = null;
let hintExplanationState = "hint"; // 'hint', 'explanation', or 'disabled'

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

// General Event Listeners
document.addEventListener("keydown", (e) => handleKeyPress(e));
document.addEventListener("DOMContentLoaded", () => {
  initializeWelcomeScreen();
  setupDynamicBehaviors();
});

function initializeWelcomeScreen() {
  showScreen("welcomeScreen");
  const topicContainer = document.getElementById("topicContainer");
  if (topicContainer) {
    quizTopics.forEach((topic) => {
      const button = document.createElement("button");
      button.className = "topic-btn";
      button.textContent = topic.name;
      button.onclick = () => loadAndStartQuiz(topic.file);
      topicContainer.appendChild(button);
    });
  }
}

function setupDynamicBehaviors() {
  const quizContent = document.getElementById("quizContent");
  if (quizContent) {
    // Desktop scroll effects logic
    quizContent.addEventListener("scroll", () => {
      const quizCard = document.getElementById("quizCard");
      const scrollTop = quizContent.scrollTop;
      const scrollHeight = quizContent.scrollHeight;
      const clientHeight = quizContent.clientHeight;

      // For top border (matches existing CSS .has-scrolled)
      quizCard.classList.toggle("has-scrolled", scrollTop > 5);

      // For bottom border (hides border when at the end)
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;
      quizCard.classList.toggle("scrolled-to-end", isAtBottom);
    });

    // Mobile tooltip scroll hide
    quizContent.addEventListener(
      "scroll",
      () => {
        if (window.innerWidth <= 768) {
          hideMobileTooltip();
        }
      },
      { passive: true }
    );
  }

  // Mobile tooltip button logic
  const hintExplanationBtn = document.getElementById("hintExplanationBtn");
  if (hintExplanationBtn) {
    hintExplanationBtn.addEventListener("click", toggleMobileTooltip);
  }

  // Hide mobile tooltip on outside click
  document.addEventListener("click", (event) => {
    const tooltipPopup = document.getElementById("tooltipPopup");
    const hintBtn = document.getElementById("hintExplanationBtn");
    if (hintBtn && tooltipPopup) {
      const isClickInside =
        hintBtn.contains(event.target) || tooltipPopup.contains(event.target);
      if (!isClickInside && tooltipPopup.classList.contains("visible")) {
        hideMobileTooltip();
      }
    }
  });
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();
  if (key === "enter") {
    e.preventDefault();
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn && !nextBtn.disabled) nextBtn.click();
  }
  if (["1", "2", "3", "4", "5", "6"].includes(key) && !answered) {
    e.preventDefault();
    const answerIndex = parseInt(key, 10) - 1;
    const answerButton = document.querySelector(
      `.answer-option[data-answer="${answerIndex}"]`
    );
    if (answerButton) answerButton.click();
  }
  if ((key === "h" || key === "י") && !answered) {
    e.preventDefault();
    const hintContainer = document
      .getElementById("hintContainer")
      ?.querySelector(".tooltip-container");
    if (hintContainer) {
      hintContainer.classList.toggle("hint-visible");
    }
  }
}

function showScreen(screenId) {
  document
    .querySelectorAll(".welcome-screen, .container, .end-screen")
    .forEach((screen) => {
      screen.classList.remove("visible");
      screen.style.display = "none";
    });
  const screenElement = document.getElementById(screenId);
  screenElement.style.display = "flex";
  setTimeout(() => screenElement.classList.add("visible"), 10);
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
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  const timerSpan = document.getElementById("timer");

  const update = () => {
    if (timerSpan) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerSpan.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    timeLeft--;
  };

  update(); // Update immediately
  timerInterval = setInterval(update, 1000);
}

function animateQuizCard(show, callback) {
  const quizCard = document.getElementById("quizCard");
  quizCard.classList.toggle("show", show);
  if (callback) setTimeout(callback, 300);
}

function loadQuestion() {
  if (currentQuestion >= sessionQuizData.length) {
    showEndScreen();
    return;
  }

  animateQuizCard(false, () => {
    const quizCard = document.getElementById("quizCard");
    const quizContent = document.getElementById("quizContent");
    const question = sessionQuizData[currentQuestion];

    quizCard.classList.remove(
      "has-scrolled",
      "is-scrollable",
      "scrolled-to-end"
    );
    quizContent.scrollTop = 0;

    document.getElementById("currentQ").textContent = currentQuestion + 1;

    const codeSection = document.getElementById("codeSection");
    const codeDisplay = document.getElementById("codeDisplay");

    if (question.code && question.code.trim() !== "") {
      quizContent.classList.remove("no-code-layout");
      codeSection.style.display = "flex";
      codeDisplay.textContent = question.code;
      Prism.highlightElement(codeDisplay);
    } else {
      quizContent.classList.add("no-code-layout");
      codeSection.style.display = "none";
      codeDisplay.textContent = "";
    }

    const hintContainer = document.getElementById("hintContainer");
    hintContainer.innerHTML = "";
    document.getElementById("explanationContainer").innerHTML = "";

    // Fix for Desktop Hint Tooltip
    if (question.hint) {
      hintContainer.innerHTML = `
        <div class="tooltip-container">
            <button class="tooltip-btn">רמז</button>
            <div class="tooltip-popup">${formatAnswerText(question.hint)}</div>
        </div>`;
    }

    hintExplanationState = "hint";
    const hintExplanationBtn = document.getElementById("hintExplanationBtn");
    if (hintExplanationBtn) {
      hintExplanationBtn.textContent = "רמז";
      hintExplanationBtn.disabled = !question.hint;
    }
    hideMobileTooltip();

    document.getElementById("questionTitle").innerHTML = formatAnswerText(
      question.question
    );

    const answersContainer = document.getElementById("answersContainer");
    answersContainer.innerHTML = "";
    question.answers.forEach((answer, index) => {
      const option = document.createElement("div");
      option.className = "answer-option";

      // השורה שמפעילה את האנימציה המדורגת
      option.style.setProperty("--animation-order", index);

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

    setTimeout(() => {
      if (quizContent.scrollHeight > quizContent.clientHeight) {
        quizCard.classList.add("is-scrollable");
      }
    }, 150);

    animateQuizCard(true);
  });
}

function checkAnswer() {
  if (selectedAnswer === null) return;

  clearInterval(timerInterval); // Stop the timer

  answered = true;

  const desktopHintContainer = document
    .getElementById("hintContainer")
    ?.querySelector(".tooltip-container");
  if (desktopHintContainer) desktopHintContainer.classList.add("disabled");

  const question = sessionQuizData[currentQuestion];
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option) => (option.style.pointerEvents = "none"));
  options[question.correct].classList.add("correct");

  const hintExplanationBtn = document.getElementById("hintExplanationBtn");
  const explanationContainer = document.getElementById("explanationContainer");

  if (selectedAnswer === question.correct) {
    score++;
    if (hintExplanationBtn) hintExplanationBtn.disabled = true;
    hintExplanationState = "disabled";
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

      if (hintExplanationBtn) {
        hintExplanationBtn.textContent = "הסבר תשובה";
        hintExplanationBtn.disabled = false;
      }
      hintExplanationState = "explanation";
    } else {
      if (hintExplanationBtn) hintExplanationBtn.disabled = true;
      hintExplanationState = "disabled";
    }
  }

  document.getElementById("nextBtn").textContent =
    currentQuestion === sessionQuizData.length - 1 ? "סיום" : "השאלה הבאה";
  document.getElementById("nextBtn").disabled = false;

  // ===>>> תוספת חדשה: גלילה אוטומטית לחלק התחתון <<<===
  const quizContent = document.getElementById("quizContent");
  setTimeout(() => {
    quizContent.scrollTo({
      top: quizContent.scrollHeight,
      behavior: "smooth",
    });
  }, 100); // השהיה קטנה לחוויה חלקה יותר
}
function toggleMobileTooltip() {
  const tooltipPopup = document.getElementById("tooltipPopup");
  if (tooltipPopup.classList.contains("visible")) {
    hideMobileTooltip();
  } else {
    showMobileTooltip();
  }
}

function showMobileTooltip() {
  const question = sessionQuizData[currentQuestion];
  const tooltipPopup = document.getElementById("tooltipPopup");
  let content = "";

  if (hintExplanationState === "hint" && question.hint) {
    content = question.hint;
  } else if (hintExplanationState === "explanation" && question.explanation) {
    content = question.explanation;
  }

  if (content) {
    tooltipPopup.innerHTML = formatAnswerText(content);
    tooltipPopup.classList.add("visible");
  }
}

function hideMobileTooltip() {
  const tooltipPopup = document.getElementById("tooltipPopup");
  if (tooltipPopup) {
    tooltipPopup.classList.remove("visible");
  }
}

function formatAnswerText(text) {
  if (typeof text !== "string") return String(text);
  return text.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\\n/g, "<br>");
}

function selectAnswer(index) {
  if (answered) return;
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
  const quarter = totalQuestions / 4;

  if (score === totalQuestions) {
    endIconContainer.innerHTML = '<i class="fas fa-trophy"></i>';
    endMessage.textContent = "אתה תותח אמיתי!";
    endScoreDetails.textContent = "ענית נכון על כל השאלות.";
  } else if (score === 0) {
    endIconContainer.innerHTML = '<i class="fas fa-poo"></i>';
    endMessage.textContent = "אתה עושה לי דווקא?";
    endScoreDetails.textContent = "בחייאת ראבק, אין סיכוי שבאמת טעית בהכל.";
  } else if (score <= quarter) {
    endIconContainer.innerHTML = '<i class="fas fa-redo"></i>';
    endMessage.textContent = "איזה מזל נאחס";
    endScoreDetails.textContent =
      "טעית בכל־כך הרבה שאלות, שסטטיסטית היה עדיף שתנחש";
  } else {
    endIconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
    endMessage.textContent = "כל הכבוד!";
    endScoreDetails.textContent = `צדקת ב-${score} מתוך ${totalQuestions} שאלות.`;
  }
  showScreen("endScreen");
}
