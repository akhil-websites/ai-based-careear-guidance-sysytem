import React, { useState, useEffect } from "react";
import "./CareerQuiz.css";

const CareerQuiz = () => {
  const [categories, setCategories] = useState(["Python", "Data Science"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:5000/get_quiz?category=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.questions) {
            setQuestions(data.questions);
            setAnswers({});
            setCurrentQuestion(0);
            setShowSubmitButton(false);
            setShowResults(false);
          }
        })
        .catch((err) => console.error("Error fetching quiz:", err));
    }
  }, [selectedCategory]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: answer };
      console.log("Updated Answers:", updatedAnswers);
      return updatedAnswers;
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSubmitButton(true);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit_quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, category: selectedCategory }),
      });
      const data = await response.json();
      setScore(data.score);
      setResults(data.results);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="career-quiz-container">
      {!selectedCategory ? (
        <div className="category-selection">
          <h2>Select a Quiz Category</h2>
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className="category-btn">
              {category}
            </button>
          ))}
        </div>
      ) : !showResults ? (
        questions.length > 0 && (
          <div className="quiz-section">
            <h2>{selectedCategory} Quiz</h2>
            <p>Question {currentQuestion + 1} of {questions.length}</p>
            <h3>{questions[currentQuestion].question}</h3>
            <div className="options">
              {questions[currentQuestion].options.map((option) => (
                <button 
                  key={option} 
                  className="option-btn" 
                  onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {showSubmitButton && (
              <button className="submit-btn" onClick={submitQuiz}>
                Submit Quiz
              </button>
            )}
          </div>
        )
      ) : (
        <div className="results-section">
          <h2>Your Quiz Results</h2>
          <p>You scored {score} out of {questions.length}.</p>
          <h3>Correct Answers & Explanations</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index} className={result.is_correct ? "correct" : "incorrect"}>
                <strong>Q: {result.question}</strong>
                <br />
                Your Answer: {result.user_answer || "Not answered"}
                <br />
                Correct Answer: {result.correct_answer}
                <br />
                Explanation: {result.explanation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CareerQuiz;
