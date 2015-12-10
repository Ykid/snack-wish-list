'use strict';

var auth = require('../../auth/auth.service');

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/update/:id', controller.update);
router.put('/likeOrUnlike', auth.isAuthenticated(), controller.likeOrUnlike);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;