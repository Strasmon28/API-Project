const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Grab the image from spotImages then use its url

//Get all spots
router.get("/", async(req, res) => {
    const Spots = await Spot.findAll({
        include: [
            {
                model: SpotImage
            }
        ]
    }); //Wants all info, exclusions not needed.

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
    //NEEDS avgRating and previewImage
    const Spots = await Spot.findAll({
        //Where ownerId = request's ownerId
        where: {
            ownerId: id
        }
    });
    res.json({ Spots }) //Should the responses be objects?
});

//Get spot details from an id
router.get("/:spotId", async(req, res) => {
    const id = req.query.id;
    const oneSpot = await Spot.findByPk(id);

    res.json(oneSpot)
});

//Create a spot
router.post("/", requireAuth, async(req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
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
    //If spot could not be found with id, send an error
    const spot = await Spot.findByPk(id);
    if(spot.length <= 0){
        //send the error
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err); //is this good?
    }

    //Create a spotImage
    const spotImage = await SpotImage.create({
        url,
        preview
    });
    res.json(spotImage);
});

//Edit a Spot
router.put('/:spotId', requireAuth, async(req, res, next) => {
    const id = req.params.spotId;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    //Validate the body values, if not good send error
    //Seems to be an error stack? but how to use?

    //Take the body and update all of the selected spot
    const updatedSpot = await Spot.findByPk(id);

    //Check if spot wasn't found, if not send error
    if(!updatedSpot) {
        res.status(404)
        res.json({
            message: "Spot couldn''t be found"
        })
    }

    //Authorize that the spot must belong to the current user (how?)
    //Take users id and compare to spot? then send error?
    //If the spots owner id does not match the user's id, send error Forbidden
    if(updatedSpot.userId !== id){ //Is it userId or ownerId?
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
router.get('/:spotId/reviews', requireAuth, async(req, res) => {
    const id = req.params.spotId;
    const Reviews = Review.findAll({
        where: {
            spotId: id
        }
    });

    res.json({ Reviews });

});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async(req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const spotId = req.params.spotId;

    //Do error check


    const newReview = Review.create({
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
router.get('/:spotId/bookings', async(req, res) =>{
    //Return all the bookings for a spot specified by id
    const spotId = req.params.spotId;
    const Bookings = Booking.findAll({
        where: {
            spotId: spotId
        }
    });

    res.json({ Bookings });
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const newBooking = Booking.create({
        spotId: spotId,
        userId: userId,
        startDate,
        endDate
    });

    res.json(newBooking);
});


//BOOKING SECTION END

// Delete a spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const spotId = req.params.spotId; //params.id ?
    const oneSpot = await Spot.findByPk(spotId);
    if(oneSpot.length <= 0){ //If checking for empty, check .findAll() length
        //send an error
        const err = new Error("Spot couldn''t be found");
        err.status = 401; //What number?
        res.json({
            message: err.message,
            code: err.status
        })
    }

    //Delete the selected spot found from the given ID
    oneSpot.destroy();
    res.statusCode(200); //Set status code to 200
    res.json({
        message: "Successfully Deleted"
    });
});

module.exports = router;
