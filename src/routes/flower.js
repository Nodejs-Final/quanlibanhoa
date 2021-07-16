const express = require('express')
const router = express.Router()
const { cart } = require('../middlewares/index')



const flowerController = require('../controllers/flowerController')

//Trang chủ
router.get('/', flowerController.home)

//Trang chi tiết
router.get('/page-detail/:id',cart, flowerController.pageDetail)

//Trang danh sách hoa
router.get('/hoa',cart,flowerController.listFlowers)
router.post('/create/flower', flowerController.createFlower)
router.get('/create',cart,flowerController.create)
router.delete('/hoa/remove/:id',flowerController.deleteFlower)
router.put('/hoa/update/:id',flowerController.updateFlower)
router.get('/hoa/update/:id',cart,flowerController.detailFlower)

//trang danh sách loại hoa
router.get('/loaihoa',cart,flowerController.listloaihoa)
router.post('/loaihoa/create',flowerController.createlistloaihoapost)
router.get('/loaihoa/create',cart,flowerController.createlistloaihoa)
router.delete('/loaihoa/delete/:id',flowerController.deleteTypeFlower)
router.put('/loaihoa/update/:id',flowerController.updateTypeFlower)
router.get('/loaihoa/update/:id',cart,flowerController.detailTypeFlower)

//Đơn hàng
router.get('/bill',cart,flowerController.bill)
router.get('/bill/:id',cart,flowerController.billDetail)

//tìm kiếm
router.post('/search', flowerController.searchRealTime)
router.get('/search/flower',cart,flowerController.searchFlower)

//Lọc
router.get('/fill',cart,flowerController.fillCategoryFlower)

//đăng nhập đăng kí
router.get('/login',flowerController.GetLogin)
router.get('/register', flowerController.register)
router.get('/logout',flowerController.logout)
router.post('/login',flowerController.login)
router.post('/register',flowerController.registerUser)

//cart
router.get('/cart',cart,flowerController.cartDetail)
router.get('/cart/increase/:id', flowerController.increaseItemCart)
router.get('/cart/decrease/:id', flowerController.decreaseItemCart)
router.get('/cart/remove/:id', flowerController.removeItemCart)
router.post('/cart/order',flowerController.orderCart)
router.get('/addCart/:id',flowerController.addCart)


module.exports = router 