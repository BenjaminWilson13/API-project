const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const eventsRouter = require('./events.js'); 
const membershipRouter = require('./memberships'); 

const router = express.Router();


router.get('/', async (req, res, next) => {
    const groups = await Group.findAll(); 
    const obj = {
        groups
    }
    res.json(obj); 
}); 
router.use(eventsRouter);
router.use(membershipRouter); 

router.get('/current', requireAuth, async (req, res, next) => {
    const groups = await Group.findAll({
        include: {
            model: Membership,
            attributes: [], 
            where: {
                userId: req.user.id
            }
        }
    })

    for (let i = 0; i < groups.length; i++) {
        const membership = await Membership.findAll({
            where: {
                groupId: groups[i].id
            }
        })
        const image = await GroupImage.findOne({
            where: {
                groupId: groups[i].id, 
                preview: true
            }, 
            attributes: ['url']
        })
        console.log(image); 
        groups[i].dataValues.numMembers = membership.length;
        if (image){
            groups[i].dataValues.previewImage = image.url
        } else {
            groups[i].dataValues.previewImage = ''
        }
    }
    const obj = {
        groups
    }
    res.json(obj); 
}); 

router.get('/:groupId', async (req, res, next) => {
    const groups = await Group.findByPk(req.params.groupId, {
        include: [{
            model: GroupImage, 
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'groupId']
            }
        }, {
            model: Venue, 
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }, {
            model: User, 
            as: 'Organizer', 
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'hashedPassword', 'username', 'email']
            }
        }]
    })

    if (!groups) {
        return res.json({
            message: "Group couldn't be found"
        }); 
    }
    const memberships = await Membership.findAll({
        where: {
            groupId: groups.id
        }
    })
    groups.dataValues.numMembers = memberships.length;


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
    const userId = req.user.id; 
    const groupId = newGroup.id; 
    const status = 'organizer'
    const newMembership = await Membership.create({userId, groupId, status})

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
    if (groups.organizerId !== req.user.id) {
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

    if (updatedGroup.organizerId !== req.user.id) {
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
    if (deleteGroup.organizerId !== req.user.id) {
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

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id, 
            },
            attributes: ['status']
        }, 
        attributes: ['id']
    }); 

    if (!group) {
        res.status(404); 
        return res.json({
            message: "Group couldn't be found"
        }); 
    }

    if (group.dataValues.Memberships[0].status !== 'organizer' && group.dataValues.Memberships[0].status !== 'co-host') {
        res.status(401); 
        return res.json({
            message: 'Must be either organizer or co-host to access venues for group'
        }); 
    }

    const Venues = await Venue.findAll({
        where: {
            groupId: group.id
        }, 
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    const obj = {
        Venues
    }
    return res.json(obj); 
    
}); 

router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    console.log(req.body); 
    const {address, city, state, lat, lng} = req.body; 
    const errors = {}; 
    if (!address) {
        errors.address = 'Street address is required'; 
    }
    if (!city) {
        errors.city = 'City is required'; 
    }
    if (!state) {
        errors.state = "State is required"; 
    }
    if (!lat || typeof lat !== 'number') {
        errors.lat = 'Latitude is not valid'
    }
    if (!lng || typeof lng !== 'number') {
        errors.lng = 'Longitude is not valid'
    }
    if (Object.keys(errors).length) {
        res.status(400); 
        return res.json({
            message: 'Bad Request', 
            errors
        }); 
    }

    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id, 
            },
            attributes: ['status']
        }, 
        attributes: ['id']
    }); 

    if (!group) {
        res.status(404); 
        res.json({
            message: "Group couldn't be found"
        }); 
    }

    if (group.dataValues.Memberships[0].status !== 'organizer' && group.dataValues.Memberships[0].status !== 'co-host') {
        res.status(401); 
        return res.json({
            message: 'Must be either organizer or co-host to create venues for group'
        }); 
    }

    const groupId = group.id; 
    console.log(groupId); 
    const venue = await Venue.create({groupId, address, city, state, lat, lng}); 
    const obj = {
        id: venue.id, 
        groupId: venue.groupId, 
        address: venue.address, 
        city: venue.city, 
        state: venue.state, 
        lat: venue.lat, 
        lng: venue.lng
    }
    res.json(obj); 
}); 

module.exports = router; 