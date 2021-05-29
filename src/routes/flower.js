const express = require('express')
const router = express.Router()

const flowerController = require('../controllers/flowerController')

router.get('/', flowerController.home)
router.get('/page-detail', flowerController.pageDetail)
router.get('/register', flowerController.register)
router.get('/search', flowerController.search)



module.exports = router 