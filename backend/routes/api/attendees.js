const express = require('express');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const router = express.Router();

//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        });
    }
    if (!req.user) {
        const Attendees = await User.findAll({
            include: {
                model: Attendance,
                attributes: ['status'],
                where: {
                    status: {
                        [Op.not]: 'pending'
                    },
                },
                limit: 1
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'username']
            },
            where: {
                id: req.params.eventId
            }
        })
        for (let attendee of Attendees) {
            attendee.dataValues.Attendances = attendee.dataValues.Attendances[0];
        }
        return res.json({ Attendees })
    }

    const userId = req.user.id;
    const groupId = event.dataValues.groupId;
    const membership = await Membership.findOne({
        where: {
            userId,
            groupId
        }
    })
    if (membership) {
        const status = membership.dataValues.status;
        if (status === 'organizer' || status === 'co-host') {
            const Attendees = await User.findAll({
                include: {
                    model: Attendance,
                    attributes: ['status'],
                    limit: 1
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'username']
                },
                where: {
                    id: req.params.eventId
                }
            })
            for (let attendee of Attendees) {
                attendee.dataValues.Attendances = attendee.dataValues.Attendances[0];
            }
            return res.json({ Attendees })
        }
    }

    const Attendees = await User.findAll({
        include: {
            model: Attendance,
            attributes: ['status'],
            where: {
                status: {
                    [Op.not]: 'pending'
                },
            },
            limit: 1
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'username']
        },
        where: {
            id: req.params.eventId
        }
    })
    for (let attendee of Attendees) {
        attendee.dataValues.Attendances = attendee.dataValues.Attendances[0];
    }
    return res.json({ Attendees })
})

module.exports = router; 