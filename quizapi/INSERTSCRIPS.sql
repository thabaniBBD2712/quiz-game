-- Insert data for Quiz table
INSERT INTO Quiz (quiz_short_code, quiz_title)
VALUES ('QZ1', 'Quiz 1'),
       ('QZ2', 'Quiz 2'),
       ('QZ3', 'Quiz 3');

-- Insert data for Question table
INSERT INTO Question (quiz_id, question_text)
VALUES (1, 'What is the capital of France?'),
       (2, 'Who painted the Mona Lisa?'),
       (3, 'What is the largest planet in our solar system?');


-- Insert data for Option table (Quiz 1)
INSERT INTO QuizOption (question_id, quizoption_text, is_correct_QuizOption)
VALUES (1, 'London', 0),
       (1, 'Paris', 1),
       (1, 'Madrid', 0);

-- Insert data for Option table (Quiz 2)
INSERT INTO QuizOption (question_id, quizoption_text, is_correct_QuizOption)
VALUES (2, 'Leonardo da Vinci', 1),
       (2, 'Pablo Picasso', 0),
       (2, 'Vincent van Gogh', 0);

-- Insert data for Option table (Quiz 3)
INSERT INTO QuizOption (question_id, quizoption_text, is_correct_QuizOption)
VALUES (3, 'Mars', 0),
       (3, 'Jupiter', 1),
       (3, 'Saturn', 0);