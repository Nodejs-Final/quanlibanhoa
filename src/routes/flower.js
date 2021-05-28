const express = require('express')
const router = express.Router()

const flowerController = require('../controllers/flowerController')

router.get('/', flowerController.home)

module.exports = router 