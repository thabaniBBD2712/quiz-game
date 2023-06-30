function fetchQuizData() {
return fetch('https://44.211.144.227:7777/quiz/short')
  .then(response => response.json())
  .then(data => {
    return data; 
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

fetchQuizData()
.then(data => {
let quizData=data['quizShortData'];
passData(quizData);
})
.catch(error => {
  console.error('Error:', error);
});

function passData(quizData){
let currentQuestion = 0;
let score = 0;
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const resultElement = document.getElementById("result");

function loadQuestion() {
const currentQuiz = quizData[currentQuestion];
questionElement.textContent = currentQuiz.Question;
}

function checkAnswer() {
const userAnswer = answerElement.value.trim().toLowerCase();
const currentQuiz = quizData[currentQuestion];

if (userAnswer === currentQuiz.Answer.toLowerCase()) {
  score++;
  resultElement.textContent = "Correct!👍";
  resultElement.style.color = "green";
} else {
  resultElement.textContent = "Wrong! 👎";
  resultElement.style.color = "red";
}

currentQuestion++;

if (currentQuestion < quizData.length) {
  loadQuestion();
  answerElement.value = "";
} else {
  showFinalScore();
}
}
function showFinalScore() {
const totalScore = (score / (quizData.length-1)) * 100;
questionElement.textContent = `Quiz completed. 🎉 Your score is ${totalScore}%`;
answerElement.style.display = "none";
resultElement.style.display = "none";
}
loadQuestion();
var button = document.getElementById("myButton");
button.addEventListener("click", checkAnswer);
}
