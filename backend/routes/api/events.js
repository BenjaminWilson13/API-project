const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op, Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const router = express.Router();

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
                console.log(image.dataValues.url)
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
            console.log(Users); 
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
})

module.exports = router; 