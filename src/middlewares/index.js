const isAuthenticated = (req, res,next) => {
    if(req.session.userInfo !== null) {
        res.locals.userInfo = req.session.userInfo;
    }
    else{
        res.locals.userInfo = ''
    }
    next()
}

module.exports = { isAuthenticated };