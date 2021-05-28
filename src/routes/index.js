const flowerRouter = require('./flower')

function route(app){
    app.use('/',flowerRouter)
}

module.exports = route