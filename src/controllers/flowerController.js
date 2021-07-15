const Flowers = require('../models/flower')
const loaihoa = require('../models/loaihoa')
const Customer = require('../models/customer')
const sendEmail = require('../service/email')
const { templatesEmail } = require('../service/templateEmail')
const {registerValidation,loginValidation} = require("../config/auth/validation")
const bcrypt = require("bcryptjs")


class flowerController{
    home(req, res, next){
        Flowers.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('index1',{flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                })
            })
            .catch(next)       
    }

    create(req, res, next){
        res.render('create_hoa')
    }

    listFlowers(req, res, next){
        Flowers.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('list_hoa',{flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                })
            })
            .catch(next)
    }

    sendEmail(req, res, next){
        sendEmail('quachtuananh2016@gmail.com', 'Đơn hàng FashiShop',templatesEmail("quang"))
        res.send('đã gửi')
    }

    listloaihoa(req, res, next){
        loaihoa.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('list_loaihoa',{flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                })
            })
            .catch(next)     
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
            res.render('detail_hoa',{flowers:flowers.toObject()})
        })
        .catch(next)  
    }

    register(req, res, next) {
        res.render('register_form',{
            layout: ''
        })
    }

    logout(req, res, next){
        req.session.destroy()
        return res.redirect('/')
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
                req.session.userInfo = User
                res.redirect('/');
            }catch(err){
                res.status(400).send(err);
            }
    }

    GetLogin(req, res, next){
        res.render('login_form',{layout:''})
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

        req.session.userInfo = await Customer.findOne({name: req.body.name})

        // console.log(req.session.userInfo);

        res.redirect('/');
    }
    
    searchFlower(req, res, next) {
        const name = req.query.name
        Flowers.find({})
            .then(function(flowers){
                flowers = flowers.filter((flower) => {
                    return flower.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
                })
                flowers = flowers.map((i)=>i.toObject())
                res.render('search_page',{flowers})
            })
    }

    searchRealTime(req, res, next){
        //Declare variables
        let hint = "";
        let response = "";
        let searchQ = req.body.search.toLowerCase(); 
        let filterNum = 1;

        if(searchQ.length > 0){
        Flowers.find(function(err, results){
            if(err){
                console.log(err);
            }else{
                results.forEach(function(sResult){
                    if(sResult.name.toLowerCase().indexOf(searchQ) !== -1){
                        if(hint === ""){
                            hint="<a href='/page-detail/" + sResult._id + "' target='_self'>" + sResult.name + "</a>";
                        }else if(filterNum < 20){
                            hint = hint + "<br /><a href='/page-detail/" + sResult._id + "' target='_self'>" + sResult.name + "</a>";
                            filterNum++;
                        }
                    }
                })
            }
            if(hint === ""){
                response = "<b>Không tìm thấy</b>"
            }else{
                response = hint;
            }
        
            res.send({response: response});
        });
    }

}
 }





module.exports = new flowerController