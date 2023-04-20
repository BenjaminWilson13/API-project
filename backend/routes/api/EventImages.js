const express = require('express');
const bcrypt = require('bcryptjs');

const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



//Delete an Image for an Event
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    console.log('lol'); 
    const imageId = req.params.imageId; 
    const userId = req.user.id; 
    const eventImage = await EventImage.findByPk(imageId); 
    if (!eventImage) {
        res.status(404); 
        return res.json({
            message: "Event Image couldn't be found"
        })
    }
    const eventId = eventImage.dataValues.eventId; 
    const event = await Event.findByPk(eventId); 
    if (!event) {
        res.status(404); 
        return res.json({
            message: "Something went wrong, image found but event wasn't"
        }); 
    }

    const groupId = event.dataValues.groupId; 

    const membership = await Membership.findOne({
        where: {
            userId, 
            groupId
        }
    })

    if (!membership) {
        res.status(404); 
        return res.json({
            message: "Membership to this group couldn't be found"
        }); 
    }

    const status = membership.dataValues.status; 

    if (status !== 'organizer' && status !== 'co-host') {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        })
    }

    eventImage.destroy(); 
    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router; 