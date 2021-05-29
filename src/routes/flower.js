const express = require('express')
const router = express.Router()

const flowerController = require('../controllers/flowerController')

router.get('/', flowerController.home)
router.post('/create/flower', flowerController.createFlower)
router.get('/create', flowerController.create)
router.get('/page-detail/:id', flowerController.pageDetail)
router.get('/register', flowerController.register)
router.get('/search', flowerController.search)

module.exports = router 