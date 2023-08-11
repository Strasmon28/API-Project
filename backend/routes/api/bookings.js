const express = require('express');
const router = express.Router();
const { Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res) => {
    //Find all of the bookings of the current user (using their id)
    const id = req.user.id;
    const Bookings = Booking.findAll({
        where: {
            userId: id
        }
    });

    res.json({ Bookings });
});

//Edit a Booking
//Update and return an existing booking
router.put('/:bookingId', requireAuth, async(req, res) => {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;

    const editBooking = Booking.findByPk(bookingId);

    //Update booking
    editBooking.startDate = startDate;
    editBooking.endDate = endDate;

    res.json(editBooking);
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res) => {
    //Find the booking by the given id then destroy it
    const bookingId = req.params.bookingId;

    const deleteBooking = Booking.findByPk(bookingId);

    deleteBooking.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
})

module.exports = router
