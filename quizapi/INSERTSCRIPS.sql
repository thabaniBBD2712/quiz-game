-- Insert data for Quiz table
INSERT INTO Quiz (quiz_id, quiz_short_code, quiz_title)
VALUES (1, 'QZ1', 'Quiz 1'),
       (2, 'QZ2', 'Quiz 2'),
       (3, 'QZ3', 'Quiz 3');

-- Insert data for Question table
INSERT INTO Question (question_id, quiz_id, question_text)
VALUES (1, 1, 'What is the capital of France?'),
       (2, 2, 'Who painted the Mona Lisa?'),
       (3, 3, 'What is the largest planet in our solar system?');

-- Insert data for Option table (Quiz 1)
INSERT INTO Option (option_id, question_id, option_text, is_correct_QuizOption)
VALUES (1, 1, 'London', 0),
       (2, 1, 'Paris', 1),
       (3, 1, 'Madrid', 0);

-- Insert data for Option table (Quiz 2)
INSERT INTO Option (option_id, question_id, option_text, is_correct_QuizOption)
VALUES (4, 2, 'Leonardo da Vinci', 1),
       (5, 2, 'Pablo Picasso', 0),
       (6, 2, 'Vincent van Gogh', 0);

-- Insert data for Option table (Quiz 3)
INSERT INTO Option (option_id, question_id, option_text, is_correct_QuizOption)
VALUES (7, 3, 'Mars', 0),
       (8, 3, 'Jupiter', 1),
       (9, 3, 'Saturn', 0);