class flowerController{
    home(req, res, next){
        res.render('user/index')
    }
}

module.exports = new flowerController