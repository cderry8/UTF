const express = require('express');
const router = express.Router();
const {
  upload,
  submitResult,
  getAllResults,
  updateResultStatus
} = require('../controllers/ResultsController');

router.post('/submit', upload.array('images', 5), submitResult);
router.get('/all', getAllResults);
router.patch('/status/:id', updateResultStatus);

module.exports = router;
