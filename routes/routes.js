const express = require('express')
const bodyParser = require('body-parser')

const JSONParser = bodyParser.json()

const testController = require('../controller/test')
const userController = require('../controller/user')

const router = express.Router()

/**
 * GET
 */
router.route('/test').get(testController.test)

/**
 * POST
 */
router.route('/user/loginWithUserAndPassword').post(JSONParser, userController.postGetToken)



module.exports = router