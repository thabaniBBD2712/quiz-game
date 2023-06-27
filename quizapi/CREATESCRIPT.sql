-- Create Quiz table
CREATE TABLE Quiz (
    quiz_id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_short_code VARCHAR(50),
    quiz_title VARCHAR(100)
);

-- Create Question table
CREATE TABLE Question (
    question_id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT,
    question_text VARCHAR(255),
    FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
);

-- Create QuizOption table
CREATE TABLE QuizOption (
    quizoption_id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT,
    quizoption_text VARCHAR(255),
    is_correct_QuizOption BIT,
    FOREIGN KEY (question_id) REFERENCES Question(question_id)
);

-- Create Score table
CREATE TABLE Score (
    score_id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT,
    user_id INT,
    score INT,
    FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
);
