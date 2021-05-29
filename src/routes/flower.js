const express = require('express')
const router = express.Router()

const flowerController = require('../controllers/flowerController')

router.get('/', flowerController.home)
<<<<<<< HEAD
router.post('/create/flower', flowerController.createFlower)
router.get('/create', flowerController.create)
=======
router.get('/page-detail', flowerController.pageDetail)
router.get('/register', flowerController.register)
router.get('/search', flowerController.search)


>>>>>>> e3032fcfe4e775a55a4fb318eed794176fa038ce

module.exports = router 