const express = require('express');
const bcrypt = require('bcryptjs');

const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    console.log('lul wut')

    const eventFind = await Event.findByPk(req.params.eventId); 
    if (!eventFind) {
        res.status(404); 
        return res.json({ 
            message: "Event couldn't be found"
        }); 
    }; 

    const eventAttending = await Event.findByPk(req.params.eventId, {
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
        }], 
        attributes: ['id']
    }); 

    
    const eventOrganizerCohost = await Event.findByPk(req.params.eventId, {
        include: {
            model: Group, 
            include: {
                model: Membership, 
                where: {
                    status: {
                        [Op.or]: ['organizer', 'co-host']
                    }, 
                    userId: req.user.id
                }, 
                attributes: ['status']
            }, 
            attributes: ['id']
        }
    })
    
    if (!eventAttending && eventOrganizerCohost.dataValues.Group === null) {
        res.status(403); 
        return res.json({ 
            message: "Forbidden"
        }); 
    }; 
    

    
    const eventId = req.params.eventId; 
    const {url, preview} = req.body; 
    const image = await EventImage.create({eventId, url, preview})
    const obj = {
        id: image.id, 
        url: image.url, 
        preview: image.preview
    }
    return res.json(obj);
}); 


module.exports = router; 