var startButton = document.getElementById('start-btn');
var questionText = document.getElementById('question-text');
var answersContainer = document.getElementById('answers-container');
var endPage = document.getElementById('end-page');
var finalScore = document.getElementById('final-score');
var initialsInput = document.getElementById('initials');
var submitForm = document.getElementById('submit-form');
var leaderboardContainer = document.getElementById('leaderboard');
var clearScoresButton = document.getElementById('clear-scores');

var currentQuestionIndex = 0;
var score = 0;
var timeLeft = 60;
var timerInterval;

// Quiz questions
var questions = [
  {
    question: 'Which programming language is used for web development?',
    answers: [
      { text: 'Java', correct: false },
      { text: 'Python', correct: false },
      { text: 'JavaScript', correct: true },
      { text: 'C++', correct: false }
    ]
  },
  {
    question: 'Which of the following is a falsy value in JavaScript?',
    answers: [
      { text: 'null', correct: true },
      { text: 'NaN', correct: true },
      { text: 'undefined', correct: true },
      { text: '0', correct: true }
    ]
  },
  {
    question: 'What is the result of the expression 4 + 5 * 2?',
    answers: [
      { text: '18', correct: false },
      { text: '14', correct: false },
      { text: '13', correct: true },
      { text: '9', correct: false }
    ]
  }
];

startButton.addEventListener('click', startQuiz);
submitForm.addEventListener('submit', saveHighScore);
clearScoresButton.addEventListener('click', clearScores);

function startQuiz() {
  startButton.disabled = true;
  startButton.classList.add('hide');
  endPage.classList.add('hide');
  document.getElementById('start-page').classList.add('hide');
  document.getElementById('quiz-page').classList.remove('hide');
  setNextQuestion();
  startTimer();
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  var question = questions[currentQuestionIndex];
  questionText.textContent = question.question;
  question.answers.forEach(function(answer) {
    var button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = true;
    }
    button.addEventListener('click', selectAnswer);
    answersContainer.appendChild(button);
  });
  currentQuestionIndex++;
}

function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;
  if (correct) {
    score++;
  } else {
    timeLeft -= 10; // Penalty for incorrect answer
  }
  setNextQuestion();
}

function resetState() {
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild);
  }
}

function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft--;
    document.getElementById('time-left').textContent = timeLeft;
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById('quiz-page').classList.add('hide');
  endPage.classList.remove('hide');
  finalScore.textContent = score;
  displayLeaderboard();
}

function saveHighScore(e) {
  e.preventDefault();
  var initials = initialsInput.value.trim();
  if (initials !== '') {
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    var newScore = {
      initials: initials,
      score: score
    };
    highScores.push(newScore);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    initialsInput.value = '';
    displayLeaderboard();
  }
}

function displayLeaderboard() {
  var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  leaderboardContainer.innerHTML = '';
  highScores.sort(function(a, b) {
    return b.score - a.score;
  });
  highScores.forEach(function(score, index) {
    var listItem = document.createElement('li');
    listItem.textContent = score.initials + ' - ' + score.score;
    leaderboardContainer.appendChild(listItem);
  });
}

function clearScores() {
  localStorage.removeItem('highScores');
  leaderboardContainer.innerHTML = '';
}