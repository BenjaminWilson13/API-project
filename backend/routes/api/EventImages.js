const express = require('express');
const bcrypt = require('bcryptjs');

const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



//Delete and Image for an Event
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    console.log('lol'); 
    res.json(req.user)
})

module.exports = router; 