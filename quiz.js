import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGP9EXBU1HOK9Hm5q5SetXYqG2DjRdBr4",
    authDomain: "realtimedatabase-98181.firebaseapp.com",
    databaseURL: "https://realtimedatabase-98181-default-rtdb.firebaseio.com",
    projectId: "realtimedatabase-98181",
    storageBucket: "realtimedatabase-98181.appspot.com",
    messagingSenderId: "169892823409",
    appId: "1:169892823409:web:0a8052a7a1d57c4c4676d0",
    measurementId: "G-F8RVHR3C6Q",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedTimeLimit = 0;
let timerInterval;
let progressBarInterval;

// Fetch questions from Firestore
async function fetchQuestions(subject, difficulty) {
    const questionsRef = collection(db, "questions");
    const snapshot = await getDocs(questionsRef);

    const questions = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.subject === subject && data.difficulty === difficulty) {
            questions.push({
                id: doc.id,
                text: data.text,
                answers: data.answers,
            });
        }
    });

    return questions;
}

// Play sound based on correctness
function playSound(isCorrect) {
    const gender = document.getElementById("sound-effects").value;
    const soundPath = isCorrect
        ? `sounds/${gender}/correct.mp3`
        : `sounds/${gender}/wrong.mp3`;

    console.log("Playing sound from:", soundPath); // Debug log to verify path
    const audio = new Audio(soundPath);
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

// Event listeners and logic
document.getElementById("start-quiz").addEventListener("click", async () => {
    const subject = document.getElementById("subject").value;
    const difficulty = document.getElementById("difficulty").value;
    selectedTimeLimit = parseInt(document.getElementById("time-limit").value) * 1000; // Convert to milliseconds

    const questions = await fetchQuestions(subject, difficulty);

    if (questions.length === 0) {
        alert("No questions available for the selected subject and difficulty.");
        return;
    }

    document.getElementById("quiz-setup").style.display = "none";
    document.getElementById("quiz-questions").style.display = "block";

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    function resetTimer() {
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = "100%";
        progressBarInterval = setInterval(() => {
            const currentWidth = parseInt(progressBar.style.width);
            const newWidth = currentWidth - 1;
            if (newWidth <= 0) {
                clearInterval(progressBarInterval);
                handleNextQuestion(false); // Automatically mark as incorrect
            } else {
                progressBar.style.width = `${newWidth}%`;
            }
        }, selectedTimeLimit / 100);
    }

    function displayQuestion(question) {
        document.getElementById("question-text").textContent = question.text;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        question.answers.forEach((answer) => {
            const button = document.createElement("button");
            button.textContent = answer.text;
            button.className = "option-button";
            button.dataset.correct = answer.correct;  // Assume 'correct' is boolean

            button.addEventListener("click", () => {
                clearInterval(timerInterval);
                clearInterval(progressBarInterval);

                // Highlight correct/incorrect answers
                const allButtons = document.querySelectorAll(".option-button");
                allButtons.forEach((btn) => {
                    btn.disabled = true;
                    if (btn.dataset.correct === "true") {
                        btn.classList.add("correct-answer");
                    } else if (btn === button) {
                        btn.classList.add("wrong-answer");
                    }
                });

                // Update score and play sound
                const isCorrect = button.dataset.correct === "true";
                if (isCorrect) {
                    correctAnswers++;
                    playSound(true); // Play correct sound
                } else {
                    wrongAnswers++;
                    playSound(false); // Play wrong sound
                }

                // Move to next question after 1 second
                setTimeout(() => {
                    handleNextQuestion(true);
                }, 1000);
            });

            optionsContainer.appendChild(button);
        });

        resetTimer();
    }

    function handleNextQuestion(answerSelected) {
        if (!answerSelected) {
            wrongAnswers++; // Increment wrong answer if no answer selected
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            clearInterval(timerInterval);
            clearInterval(progressBarInterval);
            document.getElementById("quiz-questions").style.display = "none";
            document.getElementById("quiz-results").style.display = "block";

            // Display results
            document.getElementById("score").textContent = `Your Score: ${correctAnswers} / ${questions.length}`;
            document.getElementById("correct-questions").textContent = `Correct Questions: ${correctAnswers}`;
            document.getElementById("wrong-questions").textContent = `Wrong Questions: ${wrongAnswers}`;
        }
    }

    displayQuestion(questions[currentQuestionIndex]);
});

document.getElementById("restart-quiz").addEventListener("click", () => {
    document.getElementById("quiz-results").style.display = "none";
    document.getElementById("quiz-setup").style.display = "block";

    document.getElementById("score").textContent = "";
    document.getElementById("correct-questions").textContent = "";
    document.getElementById("wrong-questions").textContent = "";
});
