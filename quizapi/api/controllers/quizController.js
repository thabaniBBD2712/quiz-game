const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const addQuiz = async (req, res) => {
  try {
    const { quizText, questionText, options } = req.body;

    // Generate a unique quiz shortcode
    const quizShortCode = `${uuidv4()}-${Date.now().toString(36)}`;

    // Check if the generated shortcode already exists in the database
    const shortcodeCheckQuery = `
      SELECT COUNT(*) AS shortcodeCount FROM Quiz WHERE quiz_short_code = @quizShortCode;
    `;
    const shortcodeCheckResult = await db.query(shortcodeCheckQuery, { quizShortCode });
    const shortcodeCount = shortcodeCheckResult.recordset[0].shortcodeCount;

    // If the shortcode already exists, generate a new one
    if (shortcodeCount > 0) {
      return res.status(409).json({ error: 'Quiz shortcode already exists' });
    }

    // Insert quiz
    const quizQuery = `
      INSERT INTO Quiz (quiz_title, quiz_short_code)
      VALUES (@quizText, @quizShortCode);
    `;
    await db.query(quizQuery, { quizText, quizShortCode });

    // Retrieve the inserted quiz to get the quizId
    const insertedQuizQuery = `
      SELECT * FROM Quiz WHERE quiz_short_code = @quizShortCode;
    `;
    const insertedQuizResult = await db.query(insertedQuizQuery, { quizShortCode });
    const quizId = insertedQuizResult.recordset[0].quiz_id;

    // Insert question
    const questionQuery = `
      INSERT INTO Question (question_text, quiz_id)
      VALUES (@questionText, @quizId);
      SELECT SCOPE_IDENTITY() AS questionId;
    `;
    const questionResult = await db.query(questionQuery, { questionText, quizId });
    const questionId = questionResult.recordset[0].questionId;

    // Insert options
    const optionQuery = `
      INSERT INTO QuizOption (quizoption_text, question_id, is_correct_QuizOption)
      VALUES (@optionText, @questionId, @isCorrect);
    `;
    for (const option of options) {
      await db.query(optionQuery, { optionText: option.quizoption_text, questionId, isCorrect: option.is_correct_QuizOption });
    }

    res.status(201).json({ message: 'Quiz added successfully', shortcode: quizShortCode });
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve Quiz
const getQuiz = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Retrieve quiz by short code
    const quizQuery = `
      SELECT * FROM Quiz WHERE quiz_short_code = @shortCode;
    `;
    const quizResult = await db.query(quizQuery, { shortCode });

    if (quizResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizResult.recordset[0];

    // Retrieve questions and options
    const questionsQuery = `
      SELECT * FROM Question WHERE quiz_id = @quizId;
    `;
    const questionsResult = await db.query(questionsQuery, { quizId: quiz.quiz_id });

    const questions = questionsResult.recordset;

    const questionIds = questions.map((question) => question.question_id);

    const optionsQuery = `
      SELECT * FROM QuizOption WHERE question_id IN (${questionIds});
    `;
    const optionsResult = await db.query(optionsQuery, questionIds);

    const optionsByQuestion = optionsResult.recordset.reduce((acc, option) => {
      if (!acc[option.question_id]) {
        acc[option.question_id] = [];
      }
      acc[option.question_id].push(option);
      return acc;
    }, {});

    questions.forEach((question) => {
      question.options = optionsByQuestion[question.question_id] || [];
    });

    quiz.questions = questions;

    res.json({ quiz });
  } catch (error) {
    console.error('Error retrieving quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToScore = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { userId, score } = req.body;

    // Retrieve the inserted quiz to get the quizId
    const insertedQuizQuery = `
      SELECT * FROM Quiz WHERE quiz_short_code = @quizShortCode;
    `;
    const insertedQuizResult = await db.query(insertedQuizQuery, { quizShortCode : shortCode });
    const quizId = insertedQuizResult.recordset[0].quiz_id;

    // Insert score
    const scoreQuery = `
      INSERT INTO Score (quiz_id, user_id, score)
      VALUES (@quizId, @userId, @score);
    `;
    await db.query(scoreQuery, { quizId, userId, score });

    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve QuizShort
const getQuizShort = async (req, res) => {
  try {
    const quizShortQuery = `
      SELECT * FROM QuizShort;
    `;
    const quizShortResult = await db.query(quizShortQuery);
    const quizShortData = quizShortResult.recordset;

    res.json({ quizShortData });
  } catch (error) {
    console.error('Error retrieving QuizShort data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getQuizShortById = async (req, res) => {
  try {
    const { id } = req.params;

    const quizShortQuery = `
      SELECT * FROM QuizShort WHERE id = @id;
    `;
    const quizShortResult = await db.query(quizShortQuery, { id });

    if (quizShortResult.recordset.length === 0) {
      return res.status(404).json({ error: 'QuizShort not found' });
    }

    const quizShort = quizShortResult.recordset[0];

    res.json({ quizShort });
  } catch (error) {
    console.error('Error retrieving QuizShort by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const insertQuizShort = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const insertQuery = `
      INSERT INTO QuizShort (Question, Answer)
      VALUES (@question, @answer);
    `;

    await db.query(insertQuery, { question, answer });

    res.status(201).json({ message: 'QuizShort record inserted successfully' });
  } catch (error) {
    console.error('Error inserting QuizShort record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addQuiz,
  getQuiz,
  addToScore,
  getQuizShort,
  getQuizShortById,
  insertQuizShort,
};