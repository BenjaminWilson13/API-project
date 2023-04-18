const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance } = require('../../db/models');

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

    
    for (let i = 0; i < events.length; i++) {
        const {Users} = events[i].dataValues; 
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

    const obj = {
        Events: events
    }
    res.json(obj);
})

module.exports = router; 