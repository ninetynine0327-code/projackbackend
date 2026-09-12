const express = require('express');
const router = express.Router();
const dentistController = require('../controllers/dentist.controller');

router.get('/dentists', dentistController.getAllDentists);
router.post('/dentists', dentistController.createDentist);

module.exports = router;