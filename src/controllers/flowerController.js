const Flower = require('../models/flower')

class flowerController{
    home(req, res, next){
        res.render('user/index')
    }

    create(req, res, next){
        res.render('user/create')
    }

    createFlower(req, res, next){
        console.log(req.body)
        const flower = new Flower(req.body)
        flower.save()
            .then(() =>res.redirect('/create'))
            .catch(next)
    }
}

module.exports = new flowerController