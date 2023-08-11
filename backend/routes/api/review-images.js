const express = require('express');
const router = express.Router();
const { Spot, SpotImage, Review, ReivewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const imageId = req.query.imageId;

    const deletedImage = ReivewImage.findByPk(imageId);

    deletedImage.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
});

module.exports = router
