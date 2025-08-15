const { Router } = require('express');
const searchController = require('../controllers/search.controllers');

const router = Router();

router.get('/', searchController.getMovieByName);

module.exports = router;