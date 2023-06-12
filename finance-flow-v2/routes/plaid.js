const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');

// Route for initiating the Plaid Link flow
router.get('/link', plaidController.initiateLinkFlow);

// Route for handling the Plaid Link callback
router.post('/callback', plaidController.handleLinkCallback);

module.exports = router;