const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    console.log('lul wut')

    const event = await Event.findByPk(req.params.eventId, {
        include: [{
            model: User, 
            through: {
                model: Attendance, 
                where: {
                    status: 'attending'
                }, 
                attributes: ['status']
            }, 
            where: {
                id: req.user.id
            }, 
            attributes: ['id']
        }, {
            model: Group, 
            include: {
                model: Membership, 
                where: {
                    userId: req.user.id
                }, 
                attributes: ['status']
            }, 
            attributes: ['id']
        }], 
        attributes: ['id']
    }); 

    if (!event) {
        res.status(404); 
        return res.json({ 
            message: "Event couldn't be found"
        }); 
    }; 
    const membershipStatus = event.dataValues.Group.Memberships[0].status; 
    const attendanceStatus = event.dataValues.Users[0].Attendance.status; 

    console.log(event.dataValues.Users[0].Attendance.status)
    console.log(event.dataValues.Group.Memberships[0].status)

    
    const eventId = req.params.eventId; 
    const {url, preview} = req.body; 
    EventImage.create({eventId, url, preview})
    res.json(event);
})

module.exports = router; 