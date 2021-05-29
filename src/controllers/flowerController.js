class flowerController{
    home(req, res, next){
        res.render('trang_1')
    }

    pageDetail(req, res, next) {
        res.render('trang_chi_tiet_hoa')
    }

    register(req, res, next) {
        res.render('trang_dang_ky')
    }

    search(req, res, next) {
        res.render('trang_tim_kiem')
    }   
 }

module.exports = new flowerController