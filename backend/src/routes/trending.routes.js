const { Router } = require('express');
const trendingController = require('../controllers/trending.controllers');

const router = Router();

router.get('/', trendingController.getTrending);

module.exports = router;