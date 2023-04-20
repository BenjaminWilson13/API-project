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
});

//Request attendance for an event specified by id
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = req.params.eventId; 
    const event =await Event.findByPk(eventId); 
    if (!event) {
        res.status(404); 
        return res.json({
            message: "Event couldn't be found"
        }); 
    }

    const groupId = event.dataValues.groupId; 
    const userId = req.user.id; 

    const attendance = await Attendance.findOne({
        where: {
            userId, 
            eventId
        }
    }); 

    const membership = await Membership.findOne({
        where: {
            userId, 
            groupId
        }
    }); 

    if (!membership || membership.dataValues.status === 'pending') {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        })
    }

    if(attendance) {
        const status = attendance.dataValues.status; 
        if (status === 'pending') {
            res.status(400); 
            return res.json({
                message: "Attendance has already been requested"
            })
        } else {
            res.status(400); 
            return res.json({
                message: "User is already an attendee of the event"
            })
        }
    }

    if (!attendance) {
        const newAttendee = await Attendance.create({eventId, userId, status: 'pending'})
        return res.json({
            userId: newAttendee.dataValues.userId, 
            status: newAttendee.dataValues.status
        })
    }
    res.status(999); 
    return res.json({
        message: "Something crazy occurred"
    }); 
})

//Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = req.params.eventId; 
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404); 
        return res.json({
            message: "Event Couldn't be found"
        }); 
    }; 
    const groupId = event.dataValues.groupId; 

    const userMembership = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId
        }
    })

    if (!userMembership || (userMembership.dataValues.status !== 'organizer' && userMembership.dataValues.status !== 'co-host')) {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        }); 
    }

    const {userId, status} = req.body; 
    if(status === 'pending') {
        res.status(400); 
        return res.json ({
            message: "Cannot change an attendance status to pending"
        }); 
    }

    const attendance = await Attendance.findOne({
        where: {
            userId, 
            eventId
        }, 
        attributes: ['id', 'eventId', 'userId', 'status']
    }); 

    if (!attendance) {
        res.status(404); 
        return res.json({
            message: "Attendance between the user and the event does not exist"
        }); 
    }

    attendance.dataValues.status = status; 
    attendance.save(); 


    res.json({
        id: attendance.dataValues.id, 
        eventId: attendance.dataValues.eventId, 
        userId: attendance.dataValues.userId, 
        status: attendance.dataValues.status
    }); 
}); 


//Delete attendance to an event specified by id
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const userId = req.user.id; 
    const deleteUserId = req.body.userId; 
    const eventId = req.params.eventId; 
    const event = await Event.findByPk(eventId); 
    if (!event) {
        res.status(404); 
        return res.json({
            message: "Event couldn't be found"
        })
    }
    const groupId = event.dataValues.groupId; 
    const attendance = await Attendance.findOne({
        where: {
            eventId, 
            userId: deleteUserId
        }
    })
    if (!attendance) {
        res.status(404); 
        return res.json({
            message: "Attendance does not exist for this User"
        })
    }
    const membership = await Membership.findOne({
        where: {
            userId, 
            groupId
        }
    })
    const status = membership.dataValues.status; 
    if (userId === deleteUserId || status === 'organizer') {
        console.log('equal')
        attendance.destroy(); 
        return res.json({
            message: "Successfully deleted attendance from event"
        }); 
    } else {
        res.status(403); 
        return res.json({
            message: "Only the User or organizer may delete an Attendance"
        })
    }
}); 
module.exports = router; 