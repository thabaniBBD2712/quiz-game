const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.addQuiz);
router.get('/:shortCode', quizController.getQuiz);
router.post('/:quizId/score', quizController.addToScore);

module.exports = router;