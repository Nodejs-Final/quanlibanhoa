const Flowers = require('../models/flower')
const Customer = require('../models/customer')
const {registerValidation,loginValidation} = require("../config/auth/validation")
const bcrypt = require("bcryptjs")


class flowerController{
    home(req, res, next){
        Flowers.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
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

    async registerUser(req, res, next){
            // Validate user
            console.log(req.body)
            const{ error } = registerValidation(req.body);
            if(error) return res.status(400).send(error.details[0].message)

            // Kiểm tra email có tồn tại hay không
            const emailExist = await Customer.findOne({email: req.body.email});
            if(emailExist) return res.status(400).send("Email đã tồn tại")

            // Mã hóa password
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt)// mã hóa password truyền vào và gán nó vào biến hashPass để có thể lưu pass vào database.

            // Tạo user
            const newUser = new Customer(req.body);
            newUser.password = hashPass
            try{
                const User = await newUser.save()
                res.redirect('/');
            }catch(err){
                res.status(400).send(err);
            }
    }

    async login(req, res, next){
        const{ error } = loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message)
        
        // Kiểm tra email
        const userLogin = await Customer.findOne({name: req.body.name});
        if(!userLogin) return res.status(400).send("Không tìm thấy Tên đăng nhập")

        // Kiểm tra password
        const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
        if(!passLogin) return res.status(400).send("Mật khẩu không hợp lệ")

        res.redirect('/');
    }

    search(req, res, next) {
        res.render('trang_tim_kiem')
    }
    
    searchFlower(req, res, next) {
        Flowers.find({name:req.query.name})
            .then(function(flowers){
                flowers = flowers.map((i)=>i.toObject())
                res.render('trang_tim_kiem',{flowers})
            })
    }
 }





module.exports = new flowerController