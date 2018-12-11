const express = require('express')
const bodyParser = require('body-parser')

const JSONParser = bodyParser.json()

const testController = require('../controller/test')
const userController = require('../controller/user')
const portController = require('../controller/port')

const router = express.Router()

/**
 * GET
 */
router.route('/test').get(testController.test)

/**
 * POST
 */
router.route('/user/loginWithUserAndPassword').post(JSONParser, userController.postGetToken)
router.route('/port/open').post(JSONParser, portController.open)



module.exports = router