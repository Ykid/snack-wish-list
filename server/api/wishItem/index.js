'use strict';
var auth = require('../../auth/auth.service');

var express = require('express');
var controller = require('./wishItem.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/markAsBrought', auth.isAuthenticated(), controller.markAsBrought);
router.put('/quantity/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;