const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, ReviewImage, Booking, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

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
        .isInt({min: 1, max: 10}) //How to default? default: 1 ?
        .optional
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .isInt({min: 1, max: 20}) //How to default? default: 20?
        .optional
        .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
        .isDecimal()
        .optional()
        .withMessage("Maximum latitude is invalid"),
    check('minLat')
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

//queryfilter

//Get all spots (Check query filter) CHECK LOGIN STUFF TOO
router.get("/", queryFilter, async(req, res) => {
    const { page, size , maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]
            }
        ]
    }); //Wants all info, exclusions not needed.

    //Find avgRating and previewimage
    //avgRating AGGREGATE find this out
    //previewImage
    let Spots = [];
    allSpots.forEach(spot => {
        Spots.push(spot.toJSON())
    });

    let starSum = 0;
    //Iterate through each spot and manipulate data
    Spots.forEach(spot => {
        spot.Reviews.forEach(review => {
            starSum = review.stars + starSum;
        })
        spot.avgRating = starSum / spot.Reviews.length;

        //If preview is true set the image
        spot.SpotImages.forEach(image => {
            if(image.preview === true){
                // console.log(image.url);
                spot.previewImage = image.url;
            }
        });

        delete spot.Reviews;
        delete spot.SpotImages;
    });

    res.json({
        Spots,
        page,
        size
    });
});

//Get all spots owned by the Current User
router.get("/current", requireAuth, async(req, res) => {
    const id = req.user.id;

    const allSpots = await Spot.findAll({
        //Where ownerId = request's ownerId
        where: {
            ownerId: id
        },
        include:[
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });

    let Spots = [];
    allSpots.forEach(spot => {
        Spots.push(spot.toJSON())
    });

    let starSum = 0;
    //Iterate through each spot and manipulate data
    Spots.forEach(spot => {
        spot.Reviews.forEach(review => {
            starSum = review.stars + starSum;
        })
        spot.avgRating = starSum / spot.Reviews.length;

        //If preview is true set the image
        spot.SpotImages.forEach(image => {
            if(image.preview === true){
                // console.log(image.url);
                spot.previewImage = image.url;
            }
        });

        delete spot.Reviews;
        delete spot.SpotImages;
    });

    res.json({ Spots }) //Should the responses be objects?
});

//Get spot details from an id
router.get("/:spotId", async(req, res) => {
    const id = req.params.spotId;
    console.log(id);
    const oneSpot = await Spot.findByPk(id,{
        include: [  //is it bracket or brace?
        {
            model: Review //Needs numReviews and avgStarRating
        },
        {
            model: SpotImage,
            attributes: ["id", "url", "preview"]
        },
        {
            model: User,
            as: "Owner",
            attributes: ["id", "firstName", "lastName"]
        }
    ]
    });

    if(!oneSpot){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    let Spots = [];
    Spots.push(oneSpot.toJSON());

    let starSum = 0;
    //Iterate through spot and manipulate data
    Spots.forEach(spot => {
        spot.Reviews.forEach(review => {
            starSum = review.stars + starSum;
        })
        spot.numReviews = spot.Reviews.length;
        spot.avgStarRating = starSum / spot.Reviews.length;

        delete spot.Reviews;
    });

    res.json(Spots[0]) //[0] to remove the extra brackets
});

const validateStuffSpot = [
    check('address')
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .isFloat({ min: -90, max: 90})
    .withMessage("Latitude is not valid"),
    check('lng')
        .isFloat({ min: -180, max: 180})
        .withMessage("Longitude is not valid"),
    check('name')
        .isString()
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal({ min: 0 })
        .withMessage("Price per day is required"),
    handleValidationErrors
];

//Create a spot
router.post("/", requireAuth, validateStuffSpot, async(req, res) => {
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
router.post('/:spotId/images', requireAuth, async(req, res) => {
    const { url, preview } = req.body;
    const id = req.params.spotId;
    const userId = req.user.id;

    //If spot could not be found with id, send an error
    const spot = await Spot.findByPk(id);
    if(!spot){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    // console.log(spot.ownerId);
    //Authorize if spot belongs to current user //(CHECK THIS)
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
router.put('/:spotId', requireAuth, validateStuffSpot, async(req, res) => {
    const id = req.params.spotId;
    const userId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

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
    // console.log(updatedSpot.ownerId);
    // console.log(userId);
    if(updatedSpot.ownerId !== userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Update the spot
    updatedSpot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    });

    // updatedSpot.address = address;
    // updatedSpot.city = city;
    // updatedSpot.state = state;
    // updatedSpot.country = country;
    // updatedSpot.lat = lat;
    // updatedSpot.lng = lng;
    // updatedSpot.name = name;
    // updatedSpot.description = description;
    // updatedSpot.price = price;

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
        include: [
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: ReviewImage,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
        ]
    });

    res.status(200);
    res.json({ Reviews });
});

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

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReviewStuff, async(req, res) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId);
    const { review, stars } = req.body;

    console.log('spotId', spotId);
    console.log(typeof spotId);
    //Why is spotId a string? use parseInt?
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
            spotId: spotId,
            userId: userId
        }
    });

    //If found, that means there is a matching user id with the corresponding spot
    if(reviewCheck) { //If a review was found within where clause, send an error
        res.status(500);
        res.json({
            message: "User already has a review for this spot"
        })
    }

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
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;


    const spotCheck = await Spot.findByPk(spotId);

    if(!spotCheck){
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        });
    }

    //Will have different responses
    //Check if the user is not the owner(compare userIds)
    if(spotCheck.ownerId !== userId){
        const Bookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        });
        res.json({ Bookings });
    } else {  //Else, the user is the owner
        const Bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });
        res.json({ Bookings });
    }
});

// const checkDates = (req, res, next) => {
//     if (endDate < startDate){
//         res.status(400);
//         res.json({
//             message: "Bad Request",
//             errors: {
//                 endDate: "endDate cannot be on or before startDate"
//             }
//         })
//     }
// }

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    const spotId = parseInt(req.params.spotId);
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
    //Spot must NOT belong to the current user.
    //If it does, throw an error
    if(checkSpot.ownerId === userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Check if there is a booking conflict
    //compare the given start/end dates with existing bookings
    // if (){
    //     res.status(403);
    //     res.json({
    //         message: "Sorry, this spot is already booked for the specific dates",
    //         errors: {
    //             startDate: "Start date conflicts with an existing booking",
    //             endDate: "End date conflicts with an existing booking"
    //         }
    //     })
    // }
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

    if(!oneSpot){ //Checking if nothing was found
        //send an error
        // const err = new Error("Spot couldn''t be found");
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }

    //The spot should be found at this point, check authorization
    //Check authorization, check if ownerId is matching userId
    console.log(oneSpot.ownerId);
    console.log(userId);
    if(oneSpot.ownerId !== userId){ //Is it userId or ownerId?
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Delete the selected spot found from the given ID
    oneSpot.destroy();

    res.status(200); //Set status code to 200
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
