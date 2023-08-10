const express = require('express');
const router = express.Router();
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Get all Reviews of Current User
router.get('/current', requireAuth, async(req, res) => {
    const id = req.user.id;
    //Functional Needs the extra stuff
    const Reviews = await Review.findAll({
        where: {
            userId: id
        }
    });
    res.json({ Reviews });
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const { url } = req.body;
    //Do error check
    //Take the review using reviewId then insert the image?
    const addImage = await ReviewImage.create({
        url
    });
    res.json(addImage);
})

//Edit a Review
router.put('/:reviewId', requireAuth, async(req, res) =>{
    //Check proper authorization
    const id = req.params.reviewId;
    const { review, stars } = req.body;

    //Do some error checks

    const updatedReview = await Review.findByPk(id);

    //Update the review
    updatedReview.review = review;
    updatedReview.stars = stars;

    //Return review
    res.json(updatedReview);
});

//Delete Review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const id = req.params.reviewId;

    const oneReview = await Review.findByPk(id);
    //Determine if a review was found

    oneReview.destroy();

    res.statusCode(200);
    res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
