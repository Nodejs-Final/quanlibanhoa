const cart = (req, res,next) => {
    if(req.session.cart){
        var total = req.session.cart.total
        res.locals.total = total
        console.log(res.locals.total);
    }
    else{
        res.locals.total = ''
    }
    next()
}

module.exports = { cart };