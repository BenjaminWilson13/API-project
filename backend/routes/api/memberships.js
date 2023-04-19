const express = require('express');
const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const eventImageRouter = require('./EventImages'); 

const router = express.Router();

//Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res, next) => {
    let members
    if (req.user) {
        members = await Membership.findAll({
            where: {
                groupId: req.params.groupId, 
                userId: req.user.id
            }
        })
    } else members = []; 

    const group = await Group.findByPk(req.params.groupId)
    if (!group) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        }); 
    }; 

    if (!members[0] || (members[0].status !== 'organizer' && members[0].status !== 'co-host')) {
        return res.json(await Membership.findAll({
            where: {
                groupId: req.params.groupId, 
                status: {
                    [Op.not]: 'pending'
                }
            }
        }))
    }
    if (members[0].status === 'organizer' || members[0].status === 'co-host') {
        return res.json(await Membership.findAll({
            where: {groupId: req.params.groupId}
        }))
    }
}); 

//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId); 
    if (!group) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        })
    }
    const userId = req.user.id
    const groupId = group.dataValues.id; 
    const membership = await Membership.findAll({
        where: {
            userId, 
            groupId
        }
    })
    if (!membership[0]) {
        const newMember = await Membership.create({userId, groupId, status: 'pending'})
        return res.json({
            memberId: newMember.id, 
            status: newMember.status
        }); 
    } else {
        res.status(400); 
        return res.json({
            message: "Membership has already been requested"
        }); 
    }
}); 

//Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId); 
    const {memberId, status} = req.body; 
    if (!group) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        })
    }
    const userId = req.user.id; 
    const groupId = group.dataValues.id; 
    const userMembership = await Membership.findAll({
        where: {
            userId, 
            groupId
        }
    })

    const newMembership = await Membership.findOne({
        where: {
            groupId,
            userId: memberId
        }
    }); 

    if (!newMembership) {
        res.status(404); 
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    }
    if (!userMembership) {
        res.status(400); 
        return res.json({
            message: "Validation Error", 
            errors: {
                memberId: "User couldn't be found"
            }
        })
    }
    const userMembershipStatus = userMembership[0].dataValues.status; 
    if (status === 'pending') {
        res.status(400); 
        return res.json({
            message: "Validation Error", 
            errors: {
                memberId: "Cannot change a membership status to pending"
            }
        })
    }

    if (status !== 'member' && status !== 'co-host') {
        res.status(400); 
        return res.json({
            message: "Validation Error", 
            errors: {
                memberId: "Must change member status to 'member' or 'co-host'"
            }
        })
    }

    if (userMembershipStatus === 'organizer') {
        newMembership.dataValues.status = status; 
    } else if (userMembershipStatus === 'co-host' && status !== 'co-host') {
        newMembership.dataValues.status = status; 
    } else {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        })
    }
    newMembership.save(); 
    const obj = {
        id: newMembership.userId, 
        groupId: newMembership.groupId, 
        memberId: newMembership.id, 
        status: newMembership.status
    }
    res.json({group, userMembership, userMembershipStatus, newMembership, obj})
}); 

//Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const {memberId} = req.body; 
    const group = await Group.findByPk(req.params.groupId); 
    if (!group) {
        res.status(404); 
        res.json({
            message: "Group couldn't be found"
        })
    }
    const membership = await Membership.findOne({
        where: {
            groupId: req.params.groupId, 
            userId: memberId
        }
    }); 
    if (!membership) {
        res.status(400); 
        return res.json({
            message: "Validation Error", 
            errors: {
                memberId: "User couldn't be found"
            }
        })
    }
    const userMembership = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId: req.params.groupId
        }
    })

    if (memberId !== req.user.id && userMembership.dataValues.status !== 'organizer') {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        })
    } else if (userMembership.dataValues.status === 'organizer') {
        await group.destroy(); 
        await membership.destroy(); 
        return res.json({
            message: "Successfully deleted membership from group"
        })
    } else {
        await membership.destroy(); 
        return res.json({
            message: "Successfully deleted membership from group"
        })
    }
    // res.json({membership, group, userMembership}); 
})

module.exports = router; 