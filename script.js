// JavaScript Document

// --- 1. QUESTIONS DATA STRUCTURE ---
const questions = [
  {
    question: "What is my absolute favorite color?",
    options: ["Red", "Blue", "Green", "Purple"],
    correct: 1 // Index 1 represents "Blue"
  },
  {
    question: "When did I officially launch my YouTube channel?",
    options: ["2020", "2021", "2022", "2023"],
    correct: 2
  },
  {
    question: "Which code editor do I use most often?",
    options: ["Dreamweaver", "Visual Studio Code", "Sublime Text", "Notepad++"],
    correct: 1
  },
  {
    question: "What type of games do I enjoy playing the most?",
    options: ["Action / FPS", "Strategy", "RPG", "Sports"],
    correct: 0
  },
  {
    question: "Which programming language am I currently intermediate at?",
    options: ["Java", "C++", "Python", "Ruby"],
    correct: 2
  }
];

// --- 2. DOM ELEMENTS ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const finalMessage = document.getElementById("final-message");
const finalScore = document.getElementById("final-score");
const totalQuestions = document.getElementById("total-questions");

// --- 3. STATE VARIABLES ---
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// --- 4. EVENT LISTENERS ---
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});
restartBtn.addEventListener("click", restartQuiz);

// --- 5. FUNCTIONS ---
function startQuiz() {
  playerName = usernameInput.value.trim();
  
  if (playerName === "") {
    alert("Please enter your name to start the quiz!");
    return;
  }

  // Switch from Start Screen to Quiz Screen
  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");

  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;

  // Update progress text and bar
  progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Render option buttons dynamically
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () => selectOption(button, index));
    optionsContainer.appendChild(button);
  });
}

function resetState() {
  nextBtn.classList.add("hide");
  optionsContainer.innerHTML = "";
}

function selectOption(selectedBtn, selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.correct;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
    
    // Highlight the correct answer for visual feedback
    const allButtons = optionsContainer.children;
    allButtons[currentQuestion.correct].classList.add("correct");
  }

  // Disable all buttons once an option is picked
  Array.from(optionsContainer.children).forEach(button => {
    button.disabled = true;
  });

  // Reveal the Next button
  nextBtn.classList.remove("hide");
}

function showResults() {
  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");

  finalScore.innerText = score;
  totalQuestions.innerText = questions.length;

  // Custom result message based on performance
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    finalMessage.innerText = `Incredible, ${playerName}! You know me perfectly! 🏆`;
  } else if (percentage >= 60) {
    finalMessage.innerText = `Good job, ${playerName}! You know me pretty well! 👍`;
  } else {
    finalMessage.innerText = `Nice try, ${playerName}! We should hangout more often! 😄`;
  }

  // Send the score to your Python server
  sendScoreToPython(playerName, score);
}

function sendScoreToPython(playerName, playerScore) {
  fetch('/submit-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: playerName, score: playerScore })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Python Backend Response:", data);
  })
  .catch(error => {
    console.error("Error saving score to Python:", error);
  });
}

function restartQuiz() {
  resultScreen.classList.add("hide");
  startScreen.classList.remove("hide");
  usernameInput.value = "";
}