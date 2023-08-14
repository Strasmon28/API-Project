const express = require('express');
const router = express.Router();
const { Review, ReviewImage, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            {
                model: ReviewImage,
                attributes: { exclude: ['reviewId', 'createdAt', 'updatedAt'] }
            }
        ]
    });

    res.json({ Reviews });
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const userId = req.user.id;
    const reviewId = parseInt(req.params.reviewId);
    const { url } = req.body;

    // console.log(typeof reviewId);
    // console.log(reviewId);
    //Check authorization: check if review belongs to current user
    //Check if the review of the given id exists
    const checkReview = await Review.findByPk(reviewId, {
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

    // console.log(typeof checkReview.userId);
    // console.log(checkReview.userId);
    if(checkReview.userId !== userId){
        //"Review must belong to the current user"
        res.status(403);
        res.json({
            message: "Forbidden"
        })
    }

    //Turn into JSON to check the reviewimage length
    let images = [];
    images.push(checkReview.toJSON());

    console.log("review image length", images[0].ReviewImages.length);
    //Check if the image limit was reached
    //if the images length === 10 or (somehow) above 10
    //use id's to find the set of images
    if(images[0].ReviewImages.length >= 10){ //Does .length work?
        res.status(403);
        res.json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    //Do error check
    //Take the review using reviewId then insert the image?
    const addImage = await ReviewImage.create({
        reviewId: reviewId,
        url
    });

    res.json(addImage);
})

const validateReviewStuff = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .isInt({ min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
        handleValidationErrors
]

//Edit a Review
router.put('/:reviewId', requireAuth, validateReviewStuff, async(req, res) =>{
    //Check proper authorization
    const id = parseInt(req.params.reviewId);
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
            message: "Forbidden"
        })
    }

    //Update the review
    updatedReview.set({
        review: review,
        stars: stars
    })

    await updatedReview.save();
    // updatedReview.review = review;
    // updatedReview.stars = stars;

    //Return review
    res.json(updatedReview);
});

//Delete Review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const id = parseInt(req.params.reviewId);
    const userId = req.user.id;

    console.log(typeof id);
    console.log(id);
    const oneReview = await Review.findByPk(id);
    //Determine if a review was found
    if(!oneReview){
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        });
    }

    // console.log(oneReview.userId)
    //Authorization check
    if (oneReview.userId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        })
    }

    oneReview.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
