const express = require('express');
const router = express.Router();
const { Review, ReviewImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');
const { check } = require('express-validator');

//Get all Reviews of Current User
router.get('/current', requireAuth, async(req, res) => {
    const id = req.user.id; //.parseint() needed?
    //Functional Needs the extra stuff
    const Reviews = await Review.findAll({
        where: {
            userId: id
        },
        include: [
            {
                model: User
            },
            {
                model: Spot
            },
            {
                model: ReviewImage
            }
        ]
    });

    res.json({ Reviews });
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    //Check authorization: check if review belongs to current user
    //Check if the review of the given id exists
    const checkReview = Review.findAll({
        where: {
            id: reviewId
        },
        include: {
            model: ReviewImage
        }
    });
    if (!checkReview){
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        })
    }
    if(checkReview.userId !== userId){
        //"Review must belong to the current user"
        res.status(403);
        res.json({
            message: "Forbidden"  //Needs error middleware?
        })
    }

    //Check if the image limit was reached
    //if the images length === 10
    //use id's to find the set of images
    if(checkReview.ReviewImage.length >= 10){
        res.status(403);
        res.json({
            message: "Maximum number of images for this resource was reached"
        })
    }

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
    const userId = req.user.id;
    const { review, stars } = req.body;

    const updatedReview = await Review.findByPk(id);
    if (!updatedReview){
        //Couldn't find a Review with the specified id
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        })
    }

    //Body validation checks
    //Similar to requireAuth?

    //Authorization check
    if (updatedReview.userId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"  //Needs error middleware?
        })
    }

    //Update the review
    updatedReview.review = review;
    updatedReview.stars = stars;

    //Return review
    res.json(updatedReview);
});

//Delete Review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const id = req.params.reviewId;
    const userId = req.user.id;

    const oneReview = await Review.findByPk(id);
    //Determine if a review was found
    if(!oneReview){
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        });
    }

    //Authorization check
    if (oneReview.userId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        })
    }

    oneReview.destroy();

    res.statusCode(200);
    res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
