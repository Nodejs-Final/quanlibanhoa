const Flowers = require('../models/flower')
class flowerController{
    home(req, res, next){
        Flowers.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                console.log(flowers)
                res.render('index',{flowers})
            })
            .catch(next)       
    }

    create(req, res, next){
        res.render('user/create')
    }

    createFlower(req, res, next){
        console.log(req.body)
        const flower = new Flowers(req.body)
        flower.save()
            .then(() =>res.redirect('/create'))
            .catch(next)
    }
    pageDetail(req, res, next) {
        Flowers.findById({_id:req.params.id})
        .then(function(flowers) {
            console.log(flowers.toObject())
            res.render('trang_chi_tiet_hoa',{flowers:flowers.toObject()})
        })
        .catch(next)  
    }

    register(req, res, next) {
        res.render('trang_dang_ky')
    }

    search(req, res, next) {
        res.render('trang_tim_kiem')
    }   
 }





module.exports = new flowerController