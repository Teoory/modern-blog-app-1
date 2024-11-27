import React, { useState } from 'react';

const CreateTest = () => {
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [grading, setGrading] = useState([]);

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(parseInt(e.target.value) || 0);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleNumOptionsChange = (index, e) => {
    const newGrading = [...grading];
    newGrading[index] = Array.from({ length: parseInt(e.target.value) || 0 }, (_, i) => ({ score: i, feedback: '', image: '' }));
    setGrading(newGrading);
  };

  const handleAnswerChange = (questionIndex, optionIndex, e) => {
    const newGrading = [...grading];
    newGrading[questionIndex][optionIndex].score = parseInt(e.target.value) || 0;
    setGrading(newGrading);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
  };

  return (
    <div>
      <div id="header">
        <h1>Quiz Form</h1>
      </div>
      <form id="form1" onSubmit={handleSubmit}>
        <label>
          Number of Questions:
          <input type="number" value={numQuestions} onChange={handleNumQuestionsChange} />
        </label>

        {[...Array(numQuestions)].map((_, index) => (
          <div key={index}>
            <h2>Question {index + 1}</h2>
            <label>
              Question Text:
              <input type="text" value={questions[index] || ''} onChange={(e) => handleQuestionChange(index, e)} />
            </label>

            <label>
              Number of Options:
              <input type="number" onChange={(e) => handleNumOptionsChange(index, e)} />
            </label>

            <div>
              {[...Array(grading[index]?.length || 0)].map((_, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    Option {optionIndex + 1} Score:
                    <input
                      type="number"
                      value={grading[index]?.[optionIndex]?.score || 0}
                      onChange={(e) => handleAnswerChange(index, optionIndex, e)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>

      {/* Display results here */}
      <p>Your grade is: <span id="grade">__</span></p>
      <p id="grade2"></p>
    </div>
  );
};

export default CreateTest