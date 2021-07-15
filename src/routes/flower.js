const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../middlewares/index')


const flowerController = require('../controllers/flowerController')

router.get('/',isAuthenticated, flowerController.home)
router.get('/hoa',flowerController.listFlowers)
router.get('/loaihoa',flowerController.listloaihoa)
router.get('/login',flowerController.GetLogin)
router.get('/sendEmail',flowerController.sendEmail)
router.post('/create/flower', flowerController.createFlower)
router.get('/create',flowerController.create)
router.get('/logout',flowerController.logout)
router.get('/page-detail/:id', flowerController.pageDetail)
router.get('/register', flowerController.register)
router.post('/login',flowerController.login)
router.post('/register',flowerController.registerUser)
router.post('/search', flowerController.searchRealTime)
router.get('/search/flower',flowerController.searchFlower)
// router.get('/search', flowerController.search)

module.exports = router 