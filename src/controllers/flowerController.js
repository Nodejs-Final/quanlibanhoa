const Flowers = require('../models/flower')
const loaihoa = require('../models/loaihoa')
const Customer = require('../models/customer')
const Bill = require('../models/bill')
const sendEmail = require('../service/email')
const  templateEmail  = require('../service/templateEmail')
const {registerValidation,loginValidation} = require("../config/auth/validation")
const bcrypt = require("bcryptjs")


class flowerController{

    //-----------------------Trang chủ,Trang chi tiết-----------------------//
    home(req, res, next){
        if(req.session.cart){
            var total = req.session.cart.total
            var soluong = req.session.cart.cartItems.reduce((sl,item)=>{
                return sl + item.soluong
            },0)
        }
        Promise.all([Flowers.find({}),loaihoa.find({})])
            .then(function([flowers,loaihoa]) { 
                flowers = flowers.map((i)=>i.toObject())
                loaihoa = loaihoa.map((i)=>i.toObject())
                res.render('index1',{flowers,loaihoa,total,soluong,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                })
            })
            .catch(next)       
    }

    pageDetail(req, res, next) {
        Flowers.findById({_id:req.params.id})
        .then(function(flowers) {
            console.log(flowers.toObject())
            res.render('detail_hoa',{
                userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                flowers:flowers.toObject(),
                total: res.locals.total ? res.locals.total : ''
            })
        })
        .catch(next)  
    }

    //-----------------------Hoa---------------------------------//
    create(req, res, next){
        loaihoa.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('create_hoa',{loaihoa:flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                    total: res.locals.total ? res.locals.total : ''
                })
            })
            .catch(next) 
    }

    listFlowers(req, res, next){
        Flowers.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('list_hoa',{flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                    total: res.locals.total ? res.locals.total : ''
                })
            })
            .catch(next)
        }
        
    createFlower(req, res, next){
            const flower = new Flowers(req.body)
            flower.save()
                .then(() =>res.redirect('/create'))
                .catch(next)
    }

    async deleteFlower(req, res, next){
        const id = req.params.id;
        await Flowers.deleteOne({_id:id})
        res.redirect('back')
    }

    async detailFlower(req, res, next){
        const id = req.params.id;
        const flower = await Flowers.findOne({_id:id}).lean()
        res.render('update_hoa',{
            flower,
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })
    }

    async updateFlower(req, res, next){
        const id = req.params.id;
        const data = req.body
        const newData = await Flowers.updateOne({_id:id},data)
        res.redirect('/hoa')
    }

    //-------------------------Loại hoa-----------------------------//
    listloaihoa(req, res, next){
        loaihoa.find({})
            .then(function(flowers) { 
                flowers = flowers.map((i)=>i.toObject())
                res.render('list_loaihoa',{loaihoa:flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                    total: res.locals.total ? res.locals.total : ''
                })
            })
            .catch(next)     
    }

    createlistloaihoa(req, res, next){
        res.render('create_loaihoa',{
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })
    }

    createlistloaihoapost(req, res, next){
        const hoa = new loaihoa(req.body)
        hoa.save()
            .then(() =>res.redirect('/loaihoa/create'))
            .catch(next)
    }

    async deleteTypeFlower(req, res, next){
        const id = req.params.id;
        await loaihoa.deleteOne({_id:id})
        res.redirect('back')
    }

    async detailTypeFlower(req, res, next){
        const id = req.params.id;
        const typeFlower = await loaihoa.findOne({_id:id}).lean()
        res.render('update_loaihoa',{
            typeFlower,
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })
    }

    async updateTypeFlower(req, res, next){
        const id = req.params.id;
        const data = req.body
        const newData = await loaihoa.updateOne({_id:id},data)
        res.redirect('/loaihoa')
    }

    


    //-------------------------Đăng nhập đăng kí -----------------------------//
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

    //----------------------Lọc theo danh mục hoa--------------------------//
    fillCategoryFlower(req, res, next){
        const name = req.query.name
        Flowers.find({category:name}).lean()
            .then(flowers =>{
                console.log(res.locals.total);
                return res.render('search_page',{
                    flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                    total: res.locals.total ? res.locals.total : ''
                })
            })
            .catch(function(err){
                console.log(err);
            })
            
    }
    

    //-------------------------Tìm kiếm------------------------------------//
    searchFlower(req, res, next) {
        const name = req.query.name
        console.log(name);
        Flowers.find({})
            .then(function(flowers){
                flowers = flowers.filter((flower) => {
                    return flower.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
                })
                flowers = flowers.map((i)=>i.toObject())
                res.render('search_page',{
                    flowers,
                    userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
                    total: res.locals.total ? res.locals.total : ''
                })
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

    //-------------------------------------CART-----------------------------//
    cartDetail(req, res){
        res.render('cart',{
            cart:req.session.cart ? req.session.cart.cartItems :'',
            total:req.session.cart ? req.session.cart.total :'',
            user:req.session.userInfo ? req.session.userInfo : '',
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })
    }

    async addCart(req, res, next){
        const id = req.params.id;
        const cartItem = await Flowers.findOne({_id:id})
        const {_id,name,price}= cartItem
        if (!cartItem) {
            res.json({ message: 'Product not found' });
            return;
        }

        if(!req.session.cart){
            req.session.cart = {
                cartItems:[{
                    _id:_id,
                    name,
                    price,
                    soluong:1
                }],
                total:cartItem.price
            };
        }else{
            let existing = false
            for(const i in req.session.cart.cartItems){
                if(req.session.cart.cartItems[i]._id === id){
                    req.session.cart.cartItems[i].soluong++
                    existing = true
                    break;
                }
            }
            if(existing===false){
                req.session.cart.cartItems.push({
                     _id:_id,
                    name,
                    price,
                    soluong:1
                })
            }
            req.session.cart.total= 0
            for(const i in req.session.cart.cartItems){
                req.session.cart.total =req.session.cart.total + (req.session.cart.cartItems[i].soluong * parseFloat(req.session.cart.cartItems[i].price))
            }
        }
        console.log(req.session.cart);
        res.redirect('back')
    }

    increaseItemCart(req, res) {
        const id = req.params.id;
        for(const i in req.session.cart.cartItems){
            if(req.session.cart.cartItems[i]._id === id){
                req.session.cart.cartItems[i].soluong++
                break;
            }
        }
        req.session.cart.total= 0
        for(const i in req.session.cart.cartItems){
            req.session.cart.total =req.session.cart.total + (req.session.cart.cartItems[i].soluong * parseFloat(req.session.cart.cartItems[i].price))
        }
        res.redirect('/cart')
    }

    decreaseItemCart(req, res, next){
        const id = req.params.id;
        for(const i in req.session.cart.cartItems){
            if(req.session.cart.cartItems[i]._id === id){
                if(req.session.cart.cartItems[i].soluong > 1){
                    req.session.cart.cartItems[i].soluong--
                    break;
                }else{
                    const cart = req.session.cart.cartItems
                    req.session.cart.cartItems=''
                    req.session.cart.cartItems = cart.filter((item) => item._id !== id)
                }
            }
        }
        req.session.cart.total= 0
        for(const i in req.session.cart.cartItems){
            req.session.cart.total =req.session.cart.total + (req.session.cart.cartItems[i].soluong * parseFloat(req.session.cart.cartItems[i].price))
        }
        res.redirect('/cart')
    }

    removeItemCart(req, res, next){
        const id = req.params.id;
        const cart = req.session.cart.cartItems
        req.session.cart.cartItems=''
        req.session.cart.cartItems = cart.filter((item) => item._id !== id)   
        req.session.cart.total= 0
        for(const i in req.session.cart.cartItems){
            req.session.cart.total =req.session.cart.total + (req.session.cart.cartItems[i].soluong * parseFloat(req.session.cart.cartItems[i].price))
        }
        res.redirect('/cart')
    }

    async orderCart(req, res) {
        if (!req.session || !req.session.cart || req.session.cart.total === 0) {
            res.redirect('/');
            return;
        }
        if (!req.session.userInfo) {
            res.redirect('/login');
            return;
        }

        const { idkh,fullName,address,phoneNumber,email } = req.body;
        const { cartItems, total} = req.session.cart;
        console.log(cartItems);
        const data = {
            idkh,
            fullName,
            address,
            phoneNumber,
            email,
            dsmh:cartItems
            ,
            total
        }
        const newBill = new Bill(data)
        const bill = await newBill.save()
        sendEmail(email,'Đơn hàng Hoa Tươi',templateEmail(bill))
        req.session.cart.cartItems = [];
        req.session.cart.total = 0;
        console.log(bill)
        res.redirect('/');
    }


    //------------------------------Đơn hàng-----------------------------
    async bill(req, res, next){
        const bills = await Bill.find({})
        const listBill= bills.map((i)=>i.toObject())
        res.render('list_donhang',{
            listBill,
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })  
    }

    async billDetail(req, res){
        const id = req.params.id;
        const bill = await Bill.findOne({_id:id}).lean()
        const dsmh = bill.dsmh
        res.render('chitiet_donhang',{
            bill,
            dsmh,
            userInfo: req.session.userInfo !== '' ? req.session.userInfo : '',
            total: res.locals.total ? res.locals.total : ''
        })
    }
 }





module.exports = new flowerController