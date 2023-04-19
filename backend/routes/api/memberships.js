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

module.exports = router; 