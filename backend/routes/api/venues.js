const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Group, Membership, Venue } = require('../../db/models');
const router = express.Router();

//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async (req, res, next) => {
    const venue = await Venue.findByPk(req.params.venueId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: {
            model: Group, 
            include: {
                model: Membership, 
                where: {
                    userId: req.user.id
                }, 
                attributes: ['status']
            }, 
            attributes: ['id']
        }
        
    });
    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found"
        })
    }

    if (venue.dataValues.Group.Memberships[0].status !== 'organizer' && venue.dataValues.Group.Memberships[0].status !== 'co-host') {
        res.status(401); 
        return res.json({
            message: 'Must be either organizer or co-host to edit venues for group'
        }); 
    }

    const errors = {}; 
    const { address, city, state, lat, lng } = req.body;
    if (address) venue.address = address;
    if (city) venue.city = city;
    if (state) venue.state = state;
    if (lat && typeof lat === 'number'){
        venue.lat = lat;
    } else {
        errors.lat = 'Latitude is not valid'
    }
    if (lng && typeof lng === 'number') { 
        venue.lng = lng;
    } else {
        errors.lng = 'Longitude is not valid'
    }
    if (Object.keys(errors).length) {
        res.status(400); 
        return res.json({
            message: "Bad Request", 
            errors
        })
    }
    venue.save();
    Reflect.deleteProperty(venue.dataValues, 'Group')
    Reflect.deleteProperty(venue.dataValues, 'updatedAt')
    Reflect.deleteProperty(venue.dataValues, 'createdAt')
    res.json(venue);

}); 






module.exports = router; 