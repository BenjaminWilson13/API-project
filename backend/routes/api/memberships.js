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
})

module.exports = router; 