const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll(); 
    const obj = {
        groups
    }
    res.json(obj); 
}); 

router.get('/current', requireAuth, async (req, res, next) => {
    const groups = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: req.user.id
            }
        }
    })
    const obj = {
        groups
    }
    res.json(obj); 
}); 

router.get('/:groupId', async (req, res, next) => {
    const groups = await Group.findByPk(req.params.groupId, {
        include: [{
            model: GroupImage
        }, {
            model: Venue
        }, {
            model: User, 
            as: 'Organizer'
        }]
    })

    if (!groups) {
        return res.json({
            message: "Group couldn't be found"
        }); 
    }
    res.json(groups); 
}); 




router.post('/', requireAuth, async (req, res, next) => {
    console.log(req.body.type); 
    const {name, about, type, private, city, state} = req.body; 
    const errors = {}; 
    if (!name || name.length > 60) {
        errors.name = 'Name must be 60 characters or less'; 
    }
    if (!about || about.length <= 50) {
        errors.about = 'About must be 50 characters or more'; 
    }
    if (!type || type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'"; 
    }
    if (!private || typeof private !== 'boolean') {
        errors.private = 'Private must be a boolean'
    } 
    if (!city) {
        errors.city = 'City is required'; 
    }
    if (!state) {
        errors.state = 'State is required'; 
    }
    if (Object.keys(errors).length) {
        res.status(400); 
        return res.json({
            message: 'Bad Request', 
            errors
        }); 
    }

    const organizerId = req.user.id; 
    const newGroup = await Group.create({organizerId, name, about, type, private, city, state})

    res.status(201); 
    res.json(newGroup); 
}); 

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const groups = await Group.findByPk(req.params.groupId); 
    const {url, preview} = req.body; 

    if (!groups) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (groups.id !== req.user.id) {
        res.status(401)
        return res.json({
            message: "Must be organizer to add images"
        }); 
    }


    const groupId = groups.id; 

    const groupImage = await GroupImage.create({groupId, url, preview})

    const obj = {
        id: groupImage.id, 
        url: groupImage.url, 
        preview: groupImage.preview
    }; 

    res.json(obj); 
}); 

router.put('/:groupId', requireAuth, async (req, res, next) => {
    const {name, about, type, private, city, state} = req.body; 
    const errors = {}; 
    if (name && name.length > 60) {
        errors.name = 'Name must be 60 characters or less'; 
    }
    if (about && about.length <= 50) {
        errors.about = 'About must be 50 characters or more'; 
    }
    if (type && type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'"; 
    }
    if (private && typeof private !== 'boolean') {
        errors.private = 'Private must be a boolean'
    }
    if (Object.keys(errors).length) {
        res.status(400); 
        return res.json({
            message: 'Bad Request', 
            errors
        }); 
    }

    const updatedGroup = await Group.findByPk(req.params.groupId); 

    if (!updatedGroup) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        }); 
    }

    if (updatedGroup.id !== req.user.id) {
        res.status(401)
        return res.json({
            message: "Must be organizer to update this group"
        }); 
    }

    if (name) updatedGroup.name = name; 
    if (about) updatedGroup.about = about; 
    if (type) updatedGroup.type = type; 
    if (private) updatedGroup.private = private; 
    if (city) updatedGroup.city = city; 
    if (state) updatedGroup.state = state; 

    updatedGroup.save(); 

    return res.json(updatedGroup); 


}); 

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const deleteGroup = await Group.findByPk(req.params.groupId); 
    if (!deleteGroup) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (deleteGroup.id !== req.user.id) {
        res.status(401)
        return res.json({
            message: "Must be organizer to delete a group"
        }); 
    }

    await deleteGroup.destroy(); 
    res.json({
        message: "Successfully deleted"
    }); 
}); 

module.exports = router; 