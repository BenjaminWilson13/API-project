const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Membership, GroupImage } = require('../../db/models');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const userId = req.user.id; 
    const groupImage = await GroupImage.findByPk(req.params.imageId); 
    if (!groupImage) {
         res.status(404); 
        return res.json({
            message: "Group Image couldn't be found"
        }); 
    }

    const groupId = groupImage.dataValues.groupId; 
    const membership = await Membership.findOne({
        where: {
            userId, 
            groupId
        }
    })

    if (!membership || (membership.dataValues.status !== 'organizer' && membership.dataValues.status !== 'co-host')) {
        res.status(403); 
        return res.json({
            message: "Forbidden"
        }); 
    }

    groupImage.destroy(); 
    res.json({
        message: "Successfully deleted"
    }); 
})

module.exports = router; 

