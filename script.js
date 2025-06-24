let sessionQuizData = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timeLeft = 600;
let timerInterval = null;

const quizTopics = [
  { name: "פוינטרים", file: "quizzes/pointers.js" },
  { name: "מחרוזות", file: "quizzes/strings.js" },
  { name: "מאקרואים", file: "quizzes/macros.js" },
  { name: "פעולות על ביטים", file: "quizzes/bitwise.js" },
  { name: "קומפילציה", file: "quizzes/compilation.js" },
  { name: "שונות", file: "quizzes/other.js" }, // <-- הוסף את השורה הזו
];

Prism.plugins.autoloader.languages_path =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  // Handle Enter key for starting/progressing
  if (key === "enter") {
    e.preventDefault();
    if (
      document.getElementById("welcomeScreen").classList.contains("visible")
    ) {
      document.getElementById("startBtn").click();
    } else if (
      document.getElementById("mainContainer").classList.contains("visible")
    ) {
      const nextBtn = document.getElementById("nextBtn");
      if (!nextBtn.disabled) {
        nextBtn.click();
      }
    }
  }

  // Handle number key presses for answer selection
  if (["1", "2", "3", "4", "5", "6"].includes(key)) {
    if (answered) return; // Don't allow selection if already answered
    e.preventDefault();
    const answerIndex = parseInt(key, 10) - 1;
    const answerButton = document.querySelector(
      `.answer-option[data-answer="${answerIndex}"]`
    );
    if (answerButton) {
      answerButton.click();
    }
  }

  // Handle 'h' or 'י' for hint
  if (key === "h" || key === "י") {
    if (answered) return;
    e.preventDefault();
    const hintContainer = document.getElementById("hintContainer");
    const tooltipContainer = hintContainer.querySelector(".tooltip-container");
    if (!tooltipContainer) return;

    const isVisible = tooltipContainer.classList.contains("hint-visible");

    if (isVisible) {
      tooltipContainer.classList.remove("hint-visible");
    } else {
      tooltipContainer.classList.add("hint-visible");
      // Add a one-time event listener to hide the hint on mouse move
      document.addEventListener(
        "mousemove",
        () => {
          tooltipContainer.classList.remove("hint-visible");
        },
        { once: true }
      );
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Immediately tell the welcome screen to appear.
  // This is the most important change - we make the screen visible FIRST.
  showScreen("welcomeScreen");

  // Step 2: Now that the screen is visible, find the container inside it.
  const topicContainer = document.getElementById("topicContainer");

  // Step 3: Populate the container with the topic buttons.
  // We also add a check to make sure the container was found, just to be safe.
  if (topicContainer) {
    quizTopics.forEach((topic) => {
      const button = document.createElement("button");
      button.className = "topic-btn";
      button.textContent = topic.name;
      button.onclick = () => loadAndStartQuiz(topic.file);
      topicContainer.appendChild(button);
    });
  }
});
function showScreen(screenId) {
  document
    .querySelectorAll(".welcome-screen, .container, .end-screen")
    .forEach((screen) => {
      screen.classList.remove("visible", "show");
      screen.style.display = "none";
    });

  const screenElement = document.getElementById(screenId);
  screenElement.style.display = "flex";

  setTimeout(() => {
    screenElement.classList.add("visible");
  }, 10);
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
  // הסר תג סקריפט קודם אם קיים כדי למנוע התנגשויות
  const oldScript = document.getElementById("quiz-data-script");
  if (oldScript) {
    oldScript.remove();
  }

  // צור תג סקריפט חדש
  const script = document.createElement("script");
  script.src = quizFile;
  script.id = "quiz-data-script";

  // הגדר מה יקרה כשהסקריפט ייטען
  script.onload = () => {
    // ודא שהמשתנה quizData אכן נטען
    if (typeof quizData !== "undefined" && quizData.length > 0) {
      showScreen("mainContainer");
      setTimeout(initQuiz, 50); // קרא ל-initQuiz רק אחרי שהמסך הוחלף
    } else {
      console.error("Failed to load quiz data from:", quizFile);
      alert("שגיאה בטעינת השאלון. אנא נסה שוב.");
    }
  };

  // טפל במקרה של שגיאה בטעינה
  script.onerror = () => {
    console.error("Error loading script:", quizFile);
    alert("לא ניתן היה למצוא את קובץ השאלון.");
  };

  // הוסף את הסקריפט ל-DOM כדי להתחיל את הטעינה
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
  updateTimerDisplay();

  const timerMessageContainer = document.getElementById(
    "timerMessageContainer"
  );

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (timerMessageContainer) {
        timerMessageContainer.classList.add("visible");
        setTimeout(() => {
          timerMessageContainer.classList.remove("visible");
        }, 3000); // Hide after 3 seconds
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerSpan = document.getElementById("timer");
  if (timerSpan) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerSpan.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

function animateQuizCard(show, callback) {
  const quizCard = document.getElementById("quizCard");
  if (show) {
    quizCard.classList.remove("show");
    void quizCard.offsetWidth;
    quizCard.classList.add("show");
  } else {
    quizCard.classList.remove("show");
  }
  if (callback) setTimeout(callback, 500);
}

function loadQuestion() {
  if (currentQuestion >= sessionQuizData.length) {
    showEndScreen();
    return;
  }

  animateQuizCard(false, () => {
    const question = sessionQuizData[currentQuestion];
    document.getElementById("currentQ").textContent = currentQuestion + 1;
    document
      .getElementById("timerMessageContainer")
      .classList.remove("visible");

    const quizContent = document.getElementById("quizContent");
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
    if (question.hint) {
      hintContainer.innerHTML = `
        <div class="tooltip-container">
          <button class="tooltip-btn">רמז</button>
          <div class="tooltip-popup">${formatAnswerText(question.hint)}</div>
        </div>`;
    }

    document.getElementById("explanationContainer").innerHTML = "";

    const questionTitle = document.getElementById("questionTitle");
    questionTitle.innerHTML = formatAnswerText(question.question);

    const container = document.getElementById("answersContainer");
    container.innerHTML = "";
    question.answers.forEach((answer, index) => {
      const option = document.createElement("div");
      option.className = "answer-option";
      if (isLtrText(answer)) {
        option.classList.add("ltr-answer");
      }
      option.setAttribute("data-answer", index);
      option.innerHTML = `<div class="answer-text">${formatAnswerText(
        answer
      )}</div>`;
      option.addEventListener("click", () => selectAnswer(index));
      container.appendChild(option);
      setTimeout(() => {
        option.classList.add("visible");
      }, 150 + index * 50);
    });

    selectedAnswer = null;
    answered = false;
    document.getElementById("nextBtn").textContent = "בדיקה";
    document.getElementById("nextBtn").disabled = true;

    startTimer();
    animateQuizCard(true);
  });
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

function checkAnswer() {
  if (selectedAnswer === null) return;
  answered = true;
  clearInterval(timerInterval);
  const hintContainer = document
    .getElementById("hintContainer")
    .querySelector(".tooltip-container");
  if (hintContainer) {
    hintContainer.classList.add("disabled");
  }

  const question = sessionQuizData[currentQuestion];
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  options[question.correct].classList.add("correct");

  // בדוק אם התשובה שנבחרה נכונה
  if (selectedAnswer === question.correct) {
    score++; // <--- כאן התיקון! הוספת נקודה לניקוד
  } else {
    // אם התשובה לא נכונה
    options[selectedAnswer].classList.add("incorrect");
    if (question.explanation) {
      const explanationContainer = document.getElementById(
        "explanationContainer"
      );
      explanationContainer.innerHTML = `
          <div class="tooltip-container">
            <button class="tooltip-btn">הצג הסבר</button>
            <div class="tooltip-popup">${formatAnswerText(
              question.explanation
            )}</div>
          </div>`;
    }
  }

  if (currentQuestion === sessionQuizData.length - 1) {
    document.getElementById("nextBtn").textContent = "סיום";
  } else {
    document.getElementById("nextBtn").textContent = "השאלה הבאה";
  }
  document.getElementById("nextBtn").disabled = false;
}

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
