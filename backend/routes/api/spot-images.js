const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Delete a spot image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const imageId = req.params.imageId;
    const deletedImage = SpotImage.findByPk(imageId);

    deletedImage.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router
