const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Delete a spot image (Does this need delete cascade?)
router.delete('/:imageId', requireAuth, async(req, res) => {
    const imageId = parseInt(req.params.imageId);
    const userId = req.user.id;
    const deletedImage = await SpotImage.findByPk(imageId);

    //Check if an image with the given id wasn't found
    if(!deletedImage){
        res.status(404);
        res.json({
            message: "Spot Image couldn't be found"
        })
    }

    const spotId = deletedImage.spotId;
    const checkSpot = await Spot.findByPk(spotId);


    if (checkSpot.ownerId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        })
    }

    deletedImage.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router
