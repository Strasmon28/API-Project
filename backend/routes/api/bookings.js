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
    const userId = req.user.id;
    const bookingId = req.params.bookingId;

    const editBooking = Booking.findByPk(bookingId);

    if(!editBooking){
        res.status(404);
        res.json({
            message: "Booking couldn't be found"
        })
    }

    if (editBooking.userId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }



    //Body validation

    //Check if the booking is expired (?)

    //Check if booking dates conflict

    //Update booking
    editBooking.startDate = startDate;
    editBooking.endDate = endDate;

    res.json(editBooking);
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res) => {
    //Find the booking by the given id then destroy it
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const deleteBooking = Booking.findByPk(bookingId);
    if (!deleteBooking){
        //Couldn't find a booking with the specified id
        res.status(404);
        res.json({
            message: "Booking couldn't be found"
        })
    }
    //Authorization
    if (deleteBooking.userId !== userId){
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //Cant delete bookings that have been started
    //Check if current date passes the start date and if it does, send error
    // if()
    // res.status(403)
    // res.json({
    //     message: "Bookings that have been started can't be deleted"
    // })

    deleteBooking.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
})

module.exports = router
