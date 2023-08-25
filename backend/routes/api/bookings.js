const express = require('express');
const router = express.Router();
const { Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { route } = require('./session');
const { handleValidationErrors } = require('../../utils/validation');

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res) => {
    //Find all of the bookings of the current user (using their id)
    const id = req.user.id;
    const Bookings = await Booking.findAll({
        where: {
            userId: id
        }
    });

    res.json({ Bookings });
});

const checkDates = (req, res, next) => {
    if (endDate < startDate){
        res.status(400);
        res.json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }
}

//Edit a Booking
//Update and return an existing booking
router.put('/:bookingId', requireAuth, checkDates, async(req, res) => {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;
    const bookingId = parseInt(req.params.bookingId);

    const editBooking = await Booking.findByPk(bookingId);

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


    //Update booking
    editBooking.startDate = startDate;
    editBooking.endDate = endDate;

    res.json(editBooking);
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res) => {
    //Find the booking by the given id then destroy it
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.id;

    const deleteBooking = await Booking.findByPk(bookingId);
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

    let currentDate = new Date();
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
