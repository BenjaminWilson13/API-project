const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get all Events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        include: [{
            model: User,
            through: Attendance
        },
        {
            model: Group,
            attributes: ['id', 'name', 'city', 'state']

        }, {
            model: Venue,
            attributes: ['city', 'state', 'id']
        }],
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        }
    });

    if (events) {
        for (let i = 0; i < events.length; i++) {
            const { Users } = events[i].dataValues;
            Reflect.deleteProperty(events[i].dataValues, 'Users')
            events[i].dataValues.numAttending = Users.length;
            const groupId = events[i].dataValues.Group.id;
            const image = await GroupImage.findOne({
                where: {
                    groupId,
                    preview: true
                },
                attributes: ['url']
            });

            if (image) {
                events[i].dataValues.previewImage = image.dataValues.url;
            } else {
                events[i].dataValues.previewImage = '';
            }
        }
    } else {
        events.message = 'No events found'
    }

    const obj = {
        Events: events
    }
    res.json(obj);
})

//Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
    const events = await Event.findAll({
        include: [{
            model: Group,
            where: {
                id: req.params.groupId
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt', 'organizerId', 'about', 'type', 'private']
            }
        }, {
            model: Venue,
            attributes: {
                exclude: ['groupId', 'address', 'lat', 'lng', 'createdAt', 'updatedAt']
            }
        }, {
            model: User, 
            through: {
                model: Attendance, 
                where: {
                    status: 'attending'
                }
            }
        }, {
            model: EventImage, 
            where: {
                preview: true
            }, 
            attributes: ['url'], 
            limit: 1
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description', 'capacity', 'price']
        }
    })
    if (events[0] === undefined || events[0].dataValues.Groups) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (events.length) {
        for(let i = 0; i < events.length; i++) {

            const {Users, EventImages} = events[i].dataValues; 
            Reflect.deleteProperty(events[i].dataValues, 'Users'); 
            Reflect.deleteProperty(events[i].dataValues, 'EventImages')
            events[i].dataValues.numAttending = Users.length; 
            if (EventImages[0]) {
                events[i].dataValues.previewImage = EventImages[0].url
            } else {
                events[i].dataValues.previewImage = ''; 
            }
        }
    } else {
        res.status(404); 
        return res.json({
            message: "No events found for group"
        })
    }
    const obj = {
        Events: events
    }
    res.json(obj)
}); 

//Get details of an Event specified by it's id
router.get('/:eventId', async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {
        include: [{
            model: User, 
            through: {
                model: Attendance, 
                attributes: [], 
                where: {
                    status: 'attending'
                }
            }
        }, {
            model: Group, 
            attributes: {
                exclude: ['organizerId', 'about', 'createdAt', 'updatedAt', 'type']
            }
        }, {
            model: Venue, 
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'groupId']
            }
        }, {
            model: EventImage, 
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'preview']
            }
        }], 
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }); 
    if (!event) {
        res.status(404); 
        return res.json({
            message: "Event couldn't be found"
        })
    }

    const{Users} = event.dataValues;
    Reflect.deleteProperty(event.dataValues, 'Users'); 
    if (Users.length) event.dataValues.numAttending = Users.length; 
    else event.dataValues.numAttending = 0; 

    res.json(event); 
}); 

//Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const {venueId, name, description, type, capacity, price, startDate, endDate} = req.body; 
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership, 
            attributes: ['status'], 
            where: {
                userId: req.user.id
            }
        }
    }); 
    if (!group) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        }); 
    }
    const venue = await Venue.findByPk(venueId); 
    if (group.dataValues.Memberships[0].status !== 'organizer' && group.dataValues.Memberships[0].status !== 'co-host') {
        res.status(401); 
        return res.json({
            message: "Current User must be the organizer of the group or a member of the group with a status of 'co-host'"
        })
    }
    const errors = {}; 
    if (!venue) errors.venueId = 'Venue does not exist'; 
    if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters'; 
    if (!description) errors.description = 'Description is required'; 
    if (!type || type !== 'Online' && type !== 'In person') errors.type = 'Type must be Online or In person'; 
    if (!capacity || !Number.isInteger(capacity)) errors.capacity = 'Capacity must be an integer'; 
    if (!price || typeof price !== 'number') errors.capacity = 'Price is invalid'; 
    if (!startDate || Date.parse(startDate) < Date.now()) errors.startDate = 'Start date must be in the future'; 
    if (!endDate || Date.parse(endDate) < Date.parse(startDate)) errors.endDate = 'End date is lass than start date'; 
    if (Object.keys(errors).length) {
        res.status(400); 
        return res.json({
            message: "Bad Request", 
            errors
        })
    }

 


    const groupId = group.dataValues.id; 
    const event = await Event.create({venueId, groupId, name, description, type, capacity, price: parseFloat(price.toFixed(2)), startDate, endDate}); 
    res.json(event); 
})

module.exports = router; 