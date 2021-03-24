'use strict';

const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.get('/', userController.user_list_get);

userRouter.get('/:id', userController.user_get);

module.exports = userRouter;