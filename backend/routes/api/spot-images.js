const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Delete a spot image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    const deletedImage = SpotImage.findByPk(imageId);

    if(!deletedImage){
        res.status(404);
        res.json({
            message: "Spot Image couldn't be found"
        })
    }
    //Authorization (use imageId and connect the dots?)
    // if (deletedImage.userId !== userId){ //What to check here?
    //     res.status(403);
    //     res.json({
    //         message: "Forbidden"
    //     });
    // }

    deletedImage.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router
