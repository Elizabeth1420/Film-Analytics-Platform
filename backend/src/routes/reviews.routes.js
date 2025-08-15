const { Router } = require('express');
const reviewsController = require('../controllers/reviews.controller');

const router = Router();

router.get('/:id', reviewsController.getReviews);

module.exports = router;