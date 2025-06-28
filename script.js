let sessionQuizData = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timerInterval = null;
let isDeviceMobile = false;
let isFirstErrorOccurred = false;

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

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("keydown", handleKeyPress);
window.addEventListener("resize", () => {
  if (!isDeviceMobile) {
    if (window.innerWidth < 1200 || window.innerHeight < 700) {
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
  if (window.innerWidth < 1200 || window.innerHeight < 700) {
    document.getElementById("pleaseEnlargeScreen").style.display = "flex";
  }
  document.addEventListener("click", handleGlobalClick);
  // No more setupPrismHook() call
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
    });
  document.removeEventListener("mousemove", hideTooltipsAndListeners);
}

function toggleTooltip(container) {
  const isVisible = container.classList.contains("visible");
  hideTooltipsAndListeners();
  container.classList.toggle("visible", !isVisible);
  if (container.classList.contains("visible")) {
    document.addEventListener("mousemove", hideTooltipsAndListeners);
  }
}

function handleGlobalClick(e) {
  if (!e.target.closest(".tooltip-container")) {
    hideTooltipsAndListeners();
  }
}

function handleKeyPress(e) {
  if (document.getElementById("endScreen").classList.contains("visible")) {
    return;
  }

  const key = e.key.toLowerCase();
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
  // shuffleArray(sessionQuizData); ניבניב
  sessionQuizData.forEach((question) => {
    if (question.answers) {
      const correctAnswerText = question.answers[question.correct];
      // shuffleArray(question.answers);ניבניב
      question.correct = question.answers.indexOf(correctAnswerText);
    }
  });
  currentQuestion = 0;
  score = 0;
  isFirstErrorOccurred = false;
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
        msgElement.textContent = "חחח סתם הלחצתי אתכם. אין משמעות לטיימר";
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
    tooltipContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTooltip(tooltipContainer);
    });
  }
}

// change: 3. Handle reverse highlighting
function setupHighlightListeners() {
  // From Code -> To Answer
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

  // From Answer -> To Code
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

  // Step 1: Find, format, and replace answer slots with placeholders
  let processedText = text.replace(
    /\[\[(\d+):\s*([\s\S]+?)\]\]/g,
    (match, slotId, rawContent) => {
      let content = rawContent.trim();
      if (content.startsWith("$$") && content.endsWith("$$")) {
        content = content.substring(2, content.length - 2).trim();
      }

      // Escape HTML characters to prevent rendering issues
      const escapedContent = content
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const slotHTML = `<span class="answer-slot" data-slot-id="${slotId}">
                          <span class="answer-slot-number">${slotId}</span>
                          <code class="answer-slot-code">${escapedContent}</code>
                        </span>`;

      const placeholder = `__SLOT_PLACEHOLDER_${placeholderIndex++}__`;
      slotPlaceholders.set(placeholder, slotHTML);
      return placeholder;
    }
  );

  // Step 2: Process paragraphs for the remaining text
  processedText = processedText
    .split("\n")
    .map((paragraph) => (paragraph.trim() ? `<p>${paragraph}</p>` : ""))
    .join("");

  // Step 3: Re-insert the formatted slots back, removing wrapping <p> if necessary
  slotPlaceholders.forEach((slotHTML, placeholder) => {
    const regex = new RegExp(`<p>${placeholder}</p>|${placeholder}`, "g");
    processedText = processedText.replace(regex, slotHTML);
  });

  // Step 4: Handle simple backtick code blocks
  processedText = processedText.replace(/`([^`]+)`/g, "<code>$1</code>");

  return processedText;
}

// Replace the code display section in your loadQuestion function with this:

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

      // NEW APPROACH: Use unique placeholders that won't be tokenized by Prism
      const rawCode = question.code;
      const placeholderMap = new Map();
      let placeholderCounter = 0;

      // Replace [[n]] with unique placeholders
      const codeWithPlaceholders = rawCode.replace(
        /\[\[\s*(\d+)\s*\]\]/g,
        (match, slotId) => {
          const placeholder = `SLOT_PLACEHOLDER_${placeholderCounter++}_END`;
          placeholderMap.set(placeholder, slotId);
          return placeholder;
        }
      );

      // Highlight code with placeholders
      const highlighted = Prism.highlight(
        codeWithPlaceholders,
        Prism.languages.c,
        "c"
      );

      // Replace placeholders with slot elements
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

    // Rest of your existing code remains the same...
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

    // change: 4. Add/remove class for center alignment
    if (answersContainer.querySelector(".answer-slot")) {
      answersContainer.classList.add("center-align-answers");
    } else {
      answersContainer.classList.remove("center-align-answers");
    }

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
      setupHighlightListeners();
    }, 300);
  }, 300);
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

  if (selectedAnswer === question.correct) {
    score++;
  } else {
    options[selectedAnswer].classList.add("incorrect");

    if (question.explanation) {
      document.getElementById("explanationContainer").innerHTML = `
        <div class="tooltip-container">
          <button class="tooltip-btn">הסבר תשובה</button>
          <div class="tooltip-popup">${formatText(question.explanation)}</div>
        </div>`;
      attachTooltipListener("explanationContainer");
    }

    if (!isFirstErrorOccurred) {
      isFirstErrorOccurred = true;

      const overlay = document.createElement("div");
      overlay.id = "darkOverlay";
      document.body.appendChild(overlay);

      const banner = document.createElement("div");
      banner.id = "firstErrorBanner";
      banner.style.whiteSpace = "pre-line";
      banner.style.textAlign = "center";
      banner.textContent =
        "אופסי, נראה שבחרת את התשובה השגויה.\nלחץ על 'הסבר תשובה' כדי לעבור על הפתרון.";
      document.body.appendChild(banner);

      const originalExplanationContainer = document.querySelector(
        "#explanationContainer .tooltip-container"
      );
      let clonedExplanationContainer = null;

      if (originalExplanationContainer) {
        originalExplanationContainer.style.visibility = "hidden";
        clonedExplanationContainer =
          originalExplanationContainer.cloneNode(true);
        clonedExplanationContainer.classList.add("explanation-clone");
        clonedExplanationContainer.style.visibility = "visible";
        const originalRect =
          originalExplanationContainer.getBoundingClientRect();
        clonedExplanationContainer.style.left = originalRect.left + "px";
        clonedExplanationContainer.style.top = originalRect.top + "px";
        document.body.appendChild(clonedExplanationContainer);
        clonedExplanationContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleTooltip(clonedExplanationContainer);
        });
      }

      const hideErrorExperience = () => {
        if (document.body.contains(overlay))
          overlay.classList.remove("visible");
        if (document.body.contains(banner)) banner.classList.remove("visible");
        setTimeout(() => {
          if (document.body.contains(overlay)) overlay.remove();
          if (document.body.contains(banner)) banner.remove();
          if (clonedExplanationContainer) clonedExplanationContainer.remove();
        }, 300);
        if (originalExplanationContainer) {
          originalExplanationContainer.style.visibility = "visible";
        }
        document.removeEventListener("click", hideErrorExperience);
        clearTimeout(timeoutId);
      };

      const timeoutId = setTimeout(hideErrorExperience, 4000);
      setTimeout(() => {
        document.addEventListener("click", hideErrorExperience);
      }, 100);

      setTimeout(() => {
        overlay.classList.add("visible");
        banner.classList.add("visible");
      }, 10);
    }
  }

  document.getElementById("nextBtn").textContent =
    currentQuestion === sessionQuizData.length - 1 ? "סיום" : "השאלה הבאה";
  document.getElementById("nextBtn").disabled = false;
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
    endIconContainer.innerHTML = '<i class="fas fa-redo"></i>';
    endMessage.textContent = "אתה עושה לי דווקא?";
    endScoreDetails.textContent = "בחייאת ראבק, אין סיכוי שבאמת טעית בהכל";
  }
  showScreen("endScreen");
}
