const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, ReviewImage, Booking, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// const validateLogin = [
//     check('credential')
//       .exists({ checkFalsy: true })
//       .notEmpty()
//       .withMessage('Please provide a valid email or username.'),
//     check('password')
//       .exists({ checkFalsy: true })
//       .withMessage('Please provide a password.'),
//     handleValidationErrors
//   ];

//Grab the image from spotImages then use its url
//can use .optional
const queryFilter = [
    check('page')
        .isInt({min: 1, max: 10})
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .isInt({min: 1, max: 20})
        .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
        .isDecimal()
        .optional()
        .withMessage("Maximum latitude is invalid"),
    check('mixLat')
        .isDecimal()
        .optional()
        .withMessage("Minimum latitude is invalid"),
    check('minLng')
        .isDecimal()
        .optional()
        .withMessage("Maximum longitude is invalid"),
    check('maxLng')
        .isDecimal()
        .optional()
        .withMessage("Minimum longitude is invalid"),
    check('minPrice')
        .isDecimal({min: 0})
        .optional()
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .isDecimal({min: 0})
        .optional()
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
];

//Get all spots
router.get("/", queryFilter, async(req, res) => {
    const Spots = await Spot.findAll({
        include: //[
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]
            }
        // ]
    }); //Wants all info, exclusions not needed.

    //Find avgRating and previewimage
    //avgRating AGGREGATE find this out
    //previewImage
    // let spotList = [];
    // Spots.forEach(spot => {
    //     spotList.push(spot.toJSON())
    // });

    //If preiview is true set the image (?) NEEDS WORK
    // spotList.forEach(spot => {
    //     spot.SpotImages.forEach(image => { //Needs stuff inside
    //         // console.log(image.url);
    //         image.url
    //         console.log("tested")
    //     })
    //     delete spot.SpotImages;
    // });

    res.json({ Spots });
});

//Get spots owned by current user
router.get("/current", requireAuth, async(req, res) => {
    const id = req.user.id;

    //NEEDS avgRating and previewImage !!!!

    const Spots = await Spot.findAll({
        //Where ownerId = request's ownerId
        where: {
            ownerId: id
        },
        include: {
            model: SpotImage //Needs work for URL
        }
    });
    res.json({ Spots }) //Should the responses be objects?
});

//Get spot details from an id
router.get("/:spotId", async(req, res) => {
    const id = req.query.spotId;
    const oneSpot = await Spot.findAll({
        where: { id: id },
        include: [  //is it bracket or brace?
        {
            model: Review
        },
        {
            model: SpotImage,
            attributes: ["id", "url", "preview"]
        },
        {
            model: User, //How to name as Owner
            attributes: ["id", "firstName", "lastName"]
        }
    ]
    });
    //How to include spotimages and id?
    if(oneSpot.length <= 0){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    res.json(oneSpot)
});

//Create a spot
router.post("/", requireAuth, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    //Make a body validation error handler
    //Similar to requireAuth?

    const userId = req.user.id;
    const newSpot = await Spot.create({
        ownerId: userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    res.json( newSpot );
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const { url, preview } = req.body;
    const id = req.params.spotId;
    const userId = req.user.id;

    //If spot could not be found with id, send an error
    const spot = await Spot.findByPk(id);
    if(!spot){
        //send the error
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // return next(err); //is this good?
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    //Authorize if spot belongs to current user
    if(spot.ownerId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Create a spotImage
    const spotImage = await SpotImage.create({
        spotId: id,
        url,
        preview
    });

    res.json(spotImage);
});

//Edit a Spot
router.put('/:spotId', requireAuth, async(req, res, next) => {
    const id = req.params.spotId;
    const userId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    //Validate the body values, if not good send error
    //Similar to requireAuth?

    //Take the body and update all of the selected spot
    const updatedSpot = await Spot.findByPk(id);

    //Check if spot wasn't found, if not send error
    if(!updatedSpot) {
        res.status(404)
        res.json({
            message: "Spot couldn't be found"
        });
    }

    //Authorize that the spot must belong to the current user (how?)
    //Take users id and compare to spot? then send error?
    //If the spots owner id does not match the user's id, send error Forbidden
    if(updatedSpot.ownerId !== userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Update the spot
    updatedSpot.address = address;
    updatedSpot.city = city;
    updatedSpot.state = state;
    updatedSpot.country = country;
    updatedSpot.lat = lat;
    updatedSpot.lng = lng;
    updatedSpot.name = name;
    updatedSpot.description = description;
    updatedSpot.price = price;

    await updatedSpot.save();

    res.json(updatedSpot); //Should be the updated spot but with timestamps
});

//REVIEWS SECTION

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res) => {
    const id = req.params.spotId;

    const spot = await Spot.findByPk(id);
    //If the spot couldn't be found with the given id
    if(!spot){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    const Reviews = await Review.findAll({
        where: {
            spotId: id
        },
        include: {
            model: User, //?? specity it belongs to the review
            model: ReviewImage
        }
    });

    res.json({ Reviews });
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async(req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const spotId = req.params.spotId;

    //Check if the spot of the given id exists
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }

    //Check if there is already a review for this spot
    //Find a review with corresponding spotId
    const reviewCheck = await Review.findOne({
        where: {
            spotId: spotId
        }
    });
    if(reviewCheck) { //If a review was found, send an error
        res.status(500);
        res.json({
            message: "User already has a review for this spot"
        })
    }

    //Do body validation error check
    //Similar to requireAuth?

    const newReview = await Review.create({
        userId: userId,
        spotId: spotId,
        review,
        stars
    });

    res.json(newReview);
});

//REVIEWS SECTION END

//BOOKINGS SECTION

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res) =>{
    //Return all the bookings for a spot specified by id
    const spotId = req.params.spotId;
    const Bookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    });

    if(Bookings.length <= 0){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    //Will have different responses
    //Check if the user is not the owner(compare userIds)
    //Check if user is owner

    res.json({ Bookings });
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    //Body validation check
    //If there is a booking corresponding to the given spotId, send error

    const checkSpot = await Spot.findByPk(spotId);
    if(!checkSpot){
        res.status(404)
        res.json({
            message: "Spot couldn't be found"
        })
    }

    //Authorization
    if(checkSpot.ownerId !== userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Check if there is a booking conflict
    //compare the given start/end dates with existing bookings
    //if they are the same, send an error

    const newBooking = await Booking.create({
        spotId: spotId,
        userId: userId,
        startDate,
        endDate
    });

    res.json(newBooking);
});


//BOOKING SECTION END

// Delete a spot
router.delete('/:spotId', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const oneSpot = await Spot.findByPk(spotId);

    if(!oneSpot){ //If checking for empty, check .findAll() length
        //send an error
        // const err = new Error("Spot couldn''t be found");
        res.status(404); //What number?
        res.json({
            message: "Spot couldn't be found"
        })
    }

    //The spot should be found at this point, check authorization
    //Check authorization, check if ownerId is matching userId
    if(oneSpot.ownerId !== userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Delete the selected spot found from the given ID
    oneSpot.destroy();
    res.statusCode(200); //Set status code to 200
    res.json({
        message: "Successfully deleted"
    });
});

//Error Handler?
// router.use((err, req, res, next) => {
//     res.json({
//         message: "Forbidden"
//     })
// });

module.exports = router;
