const router = require('express').Router();
const { createReview, getReviews, editReview, deleteReview, getReviewById } = require('../controller/review');
const { checkAuth } = require('../middleware/authentication');

router.post('/create/:uid/:pgid', checkAuth, createReview);
router.get('/all', getReviews);
router.get("/:rid", getReviewById);
router.delete("/:rid", checkAuth, deleteReview);
router.patch("/:rid", checkAuth, editReview);

module.exports = router;