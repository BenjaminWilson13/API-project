const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op, Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const router = express.Router();


module.exports = router; 