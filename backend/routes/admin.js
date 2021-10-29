const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const Productpic = require('../models/productpic');
const Code = require('../models/code');
const Purchase = require('../models/purchase');
const Advertise = require('../models/advertise');
const Ticket = require('../models/ticket');
const Message = require('../models/message');
const Specprice = require('../models/specprice');

const storage = multer.diskStorage({
    destination: "./public/assets/img/products",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const uploadproductimg = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("productimg");

const uploadProduct = (req, res) => {
    uploadproductimg(req, res, () => {
        let product = {};
        product.category_id = req.body.category_id;
        product.credit_price = req.body.credit_price;
        product.product_name = req.body.product_name;
        product.meta_data = req.file;
        Product.create(product)
            .then(data => res.json(data))
        /*Now do where ever you want to do*/
    });
}

const editProduct = (req, res) => {
    uploadproductimg(req, res, () => {
        let product = {};
        product.category_id = req.body.category_id;
        product.credit_price = req.body.credit_price;
        product.product_name = req.body.product_name;
        product.meta_data = req.file;
        Product.findOneAndUpdate({ "_id": req.params.id }, product)
            .then(data => res.json(data))
        /*Now do where ever you want to do*/
    });
}

const uploadproductpic = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("productpic");

const uploadProductPic = (req, res) => {
    uploadproductpic(req, res, () => {
        let productpic = {};
        productpic.meta_data = req.file;
        Productpic.create(productpic)
            .then(data => res.json(data))
        /*Now do where ever you want to do*/
    });
}

const editProductPic = (req, res) => {
    uploadproductpic(req, res, () => {
        productpic = {};
        productpic.meta_data = req.file;
        Productpic.findOneAndUpdate({ "_id": req.params.id }, productpic)
            .then(data => res.json(data))
        /*Now do where ever you want to do*/
    });
}

//Main Reseller by id
router.get('/mainreseller/list/:id', (req, res, next) => {
    User.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/mainreseller/list', (req, res, next) => {
    User.find({ role: 'mainreseller' })
        .then(data => res.json(data))
        .catch(next)
});

router.post('/mainreseller/add', (req, res, next) => {
    if (req.body) {
        User.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/mainreseller/edit/:id', (req, res, next) => {
    User.findOneAndUpdate({ "_id": req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(next)
})

router.post('/mainreseller/delete/:id', (req, res, next) => {
    User.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

//Category
router.get('/category/list/:id', (req, res, next) => {
    Category.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/category/list', (req, res, next) => {
    Category.find({})
        .then(data => res.json(data))
        .catch(next)
});

router.post('/category/add', (req, res, next) => {
    if (req.body) {
        Category.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/category/edit/:id', (req, res, next) => {
    Category.findOneAndUpdate({ "_id": req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(next)
})

router.post('/category/delete/:id', (req, res, next) => {
    Category.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

//Product
router.get('/product/list/:id', (req, res, next) => {
    Product.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/product/list', (req, res, next) => {
    Product.find({})
        .then(data => res.json(data))
        .catch(next)
});

router.post('/product/add', uploadProduct);

router.post('/product/edit/:id', editProduct);

router.post('/product/delete/:id', (req, res, next) => {
    Product.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

//Code
router.get('/code/list/:id', (req, res, next) => {
    Code.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/code/list/', (req, res, next) => {
    Code.find({})
        .then(data => res.json(data))
        .catch(next)
});

router.post('/code/add', (req, res, next) => {
    if (req.body) {
        const codes = req.body.codes;
        var newCode = {};
        for (let i = 0; i < codes.length; i++) {
            newCode.product_id = req.body.product_id;
            newCode.code = codes[i];
            newCode.is_active = true;
            Code.create(newCode);
            res.json();
        }
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/code/addone', (req, res, next) => {
    if (req.body) {
        Code.find({})
            .then(list => {
                let bExist = false;
                list.forEach(item => {
                    if (parseInt(item.code) === parseInt(req.body.code)) {
                        bExist = true;
                    }
                });
                console.log(bExist);
                if (bExist) {
                    res.json({
                        error: "Exist"
                    })
                } else {
                    Code.create(req.body)
                        .then(data => res.json(data))
                        .catch(next)
                }
            });
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/code/delete/:id', (req, res, next) => {
    Code.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.post('/code/edit/:id', (req, res, next) => {
    Code.findOneAndUpdate({ "_id": req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(next)
});

//Advertises
router.get('/advertise/list/:id', (req, res, next) => {
    Advertise.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/advertise/list/', (req, res, next) => {
    Advertise.find({})
        .then(data => res.json(data))
        .catch(next)
});

router.post('/advertise/add', (req, res, next) => {
    if (req.body) {
        Advertise.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/advertise/edit/:id', (req, res, next) => {
    Advertise.findOneAndUpdate({ "_id": req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(next)
});

router.post('/advertise/delete/:id', (req, res, next) => {
    Advertise.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

//Ticket
router.post('/ticket/add', (req, res, next) => {
    if (req.body) {
        Ticket.create(req.body)
            .then(data => {
                res.json(data);
                if (req.io != undefined && req.io.length > 0) {
                    for (var i = 0; i < req.io.length; i++) {
                        req.io[i].emit('message', data);
                    }
                }
            })
            .catch(next);
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/ticket/setread/:id', (req, res, next) => {
    if (req.body) {
        if (req.body.is_opener) {
            Ticket.findOneAndUpdate({ "_id": req.params.id }, { "is_opener_read": true })
                .then(data => res.json(data))
                .catch(next)
        } else {
            Ticket.findOneAndUpdate({ "_id": req.params.id }, { "is_receiver_read": true })
                .then(data => res.json(data))
                .catch(next)
        }
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.get('/ticket/list/:id', (req, res, next) => {
    Ticket.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/ticket/u/list/:id', (req, res, next) => {
    Ticket.find({ "receiver_id": req.params.id }).sort({ updatedAt: 'desc' })
        .then(receivedTick => {
            let receivedTickets = [];
            receivedTickets = receivedTick;
            let resTickets = [];

            if (receivedTick.length === 0) {
                Ticket.find({ "opener_id": req.params.id }).sort({ updatedAt: 'desc' })
                    .then(openedTick => {
                        let openedTickets = [];
                        openedTickets = openedTick;
                        for (let j = 0; j < openedTickets.length; j++) {
                            User.findOne({ "_id": openedTickets[j].receiver_id })
                                .then(receiver => {
                                    let receivedTicket = {};
                                    receivedTicket._id = openedTickets[j]._id;
                                    receivedTicket.title = openedTickets[j].title;
                                    receivedTicket.opener_id = openedTickets[j].opener_id;
                                    receivedTicket.createdAt = openedTickets[j].createdAt;
                                    receivedTicket.updatedAt = openedTickets[j].updatedAt;
                                    receivedTicket.username = receiver.username;
                                    receivedTicket.is_opener = true;

                                    if (!openedTickets[j].is_opener_read) {
                                        receivedTicket.is_new = true;
                                    } else {
                                        receivedTicket.is_new = false;
                                    }

                                    resTickets.push(receivedTicket);

                                    if ((j + 1) === openedTickets.length) {
                                        res.json(resTickets);
                                    }

                                })
                                .catch(next)
                        }
                    })
            } else {
                for (let i = 0; i < receivedTickets.length; i++) {
                    User.findOne({ "_id": receivedTickets[i].opener_id })
                        .then(opener => {
                            let receivedTicket = {};
                            receivedTicket._id = receivedTickets[i]._id;
                            receivedTicket.title = receivedTickets[i].title;
                            receivedTicket.opener_id = receivedTickets[i].opener_id;
                            receivedTicket.createdAt = receivedTickets[i].createdAt;
                            receivedTicket.updatedAt = receivedTickets[i].updatedAt;
                            receivedTicket.username = opener.username;
                            receivedTicket.is_opener = false;

                            if (!receivedTickets[i].is_receiver_read) {
                                receivedTicket.is_new = true;
                            } else {
                                receivedTicket.is_new = false;
                            }

                            resTickets.push(receivedTicket);

                            if ((i + 1) === receivedTickets.length) {
                                Ticket.find({ "opener_id": req.params.id }).sort({ updatedAt: 'desc' })
                                    .then(openedTick => {
                                        if (openedTick.length === 0) {
                                            res.json(resTickets);
                                        } else {
                                            let openedTickets = [];
                                            openedTickets = openedTick;
                                            for (let j = 0; j < openedTickets.length; j++) {
                                                User.findOne({ "_id": openedTickets[j].receiver_id })
                                                    .then(receiver => {
                                                        let receivedTicket = {};
                                                        receivedTicket._id = openedTickets[j]._id;
                                                        receivedTicket.title = openedTickets[j].title;
                                                        receivedTicket.opener_id = openedTickets[j].opener_id;
                                                        receivedTicket.createdAt = openedTickets[j].createdAt;
                                                        receivedTicket.updatedAt = openedTickets[j].updatedAt;
                                                        receivedTicket.username = receiver.username;
                                                        receivedTicket.is_opener = true;

                                                        if (!openedTickets[j].is_opener_read) {
                                                            receivedTicket.is_new = true;
                                                        } else {
                                                            receivedTicket.is_new = false;
                                                        }

                                                        resTickets.push(receivedTicket);

                                                        if ((j + 1) === openedTickets.length) {
                                                            res.json(resTickets);
                                                        }

                                                    })
                                                    .catch(next)
                                            }
                                        }
                                    })
                            }
                        })
                        .catch(next)
                }

            }
        })
});

router.post('/ticket/delete/:ticket_id', (req, res, next) => {
    Ticket.findOneAndDelete({ "_id": req.params.ticket_id })
        .then(data => res.json(data))
        .catch(next)
});

//Message
router.get('/message/list/:ticket_id', (req, res, next) => {
    Message.find({ ticket_id: req.params.ticket_id }).sort({ createdAt: 'asc' })
        .then(data => {
            let messages = [];
            messages = data;
            let resMsgs = [];
            for (let i = 0; i < messages.length; i++) {
                User.findOne({ "_id": messages[i].user_id })
                    .then(user => {
                        let resMsg = {};
                        resMsg._id = messages[i]._id;
                        resMsg.user_id = messages[i].user_id;
                        resMsg.ticket_id = messages[i].ticket_id;
                        resMsg.message = messages[i].message;
                        resMsg.createdAt = messages[i].createdAt;
                        resMsg.updatedAt = messages[i].updatedAt;
                        resMsg.username = user.username;
                        resMsgs.push(resMsg);
                        if ((i + 1) === messages.length)
                            res.json(resMsgs);
                    })
            }
        })
        .catch(next)
});

router.post('/message/addone', (req, res, next) => {
    if (req.body) {
        Message.create(req.body)
            .then(message => res.json(message))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/message/add', (req, res, next) => {
    if (req.body) {
        Message.create(req.body)
            .then(message => {
                if (req.body.is_opener) {
                    Ticket.findOneAndUpdate({ "_id": req.body.ticket_id }, { "is_receiver_read": false })
                        .then(ticket => {
                            res.json(message);
                            ticket.is_receiver_read = false;
                            if (req.io != undefined && req.io.length > 0) {
                                for (var i = 0; i < req.io.length; i++) {
                                    req.io[i].emit('message', ticket);
                                }
                            }
                        })
                        .catch(next)
                } else if (!req.body.is_opener) {
                    Ticket.findOneAndUpdate({ "_id": req.body.ticket_id }, { "is_opener_read": false })
                        .then(ticket => {
                            res.json(message);
                            ticket.is_opener_read = false;
                            if (req.io != undefined && req.io.length > 0) {
                                for (var i = 0; i < req.io.length; i++) {
                                    req.io[i].emit('message', ticket);
                                }
                            }
                        })
                        .catch(next)
                }
            })
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

//Specprice
router.get('/specprice/list/:id', (req, res, next) => {
    Specprice.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/specprice/list/', (req, res, next) => {
    Specprice.find({})
        .then(specprices => {
            let sprices = [];
            sprices = specprices;
            let resSpecPrices = [];
            for (let i = 0; i < sprices.length; i++) {
                let resSpecPrice = {};
                resSpecPrice._id = sprices[i]._id;
                resSpecPrice.price = sprices[i].price;
                User.findOne({ "_id": sprices[i].user_id })
                    .then(user => {
                        resSpecPrice.username = user.username;
                        Product.findOne({ "_id": sprices[i].product_id })
                            .then(product => {
                                resSpecPrice.product_name = product.product_name;
                                resSpecPrices.push(resSpecPrice);
                                if ((i + 1) === sprices.length) {
                                    res.json(resSpecPrices);
                                }
                            })
                            .catch(next);
                    })
                    .catch(next)
            }
        })
        .catch(next)
});

router.post('/specprice/add', (req, res, next) => {
    if (req.body) {
        Specprice.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.post('/specprice/edit/:id', (req, res, next) => {
    Specprice.findOneAndUpdate({ "_id": req.params.id }, req.body)
        .then(data => res.json(data))
        .catch(next)
});

router.post('/specprice/delete/:id', (req, res, next) => {
    Specprice.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

//Product Pic
router.get('/productpic/list/:id', (req, res, next) => {
    Productpic.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/productpic/list', (req, res, next) => {
    Productpic.find({})
        .then(data => res.json(data))
        .catch(next)
});

router.post('/productpic/add', uploadProductPic);

router.post('/productpic/edit/:id', editProductPic);

router.post('/productpic/delete/:id', (req, res, next) => {
    Productpic.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

//Dashboard Info 
router.get('/info/:id', (req, res, next) => {
    var credits;
    var mainresellers;
    var categorys;
    var products;
    var codes;
    User.findOne({ "_id": req.params.id })
        .then((data) => {
            credits = data.credit;
            User.countDocuments({ "role": "mainreseller" }, function (err, mainresellerCount) {
                mainresellers = mainresellerCount;
                Category.countDocuments({}, function (err, categoryCount) {
                    categorys = categoryCount;
                    Product.countDocuments({}, function (err, productCount) {
                        products = productCount;
                        Code.countDocuments({}, function (err, codeCount) {
                            Productpic.find({}).sort({ createdAt: 'desc' })
                                .then((productpic) => {
                                    codes = codeCount;
                                    var info = {};
                                    info.credits = credits;
                                    info.mainresellers = mainresellers;
                                    info.categorys = categorys;
                                    info.products = products;
                                    info.codes = codes;
                                    info.productpic = productpic;
                                    res.json(info);
                                })
                                .catch(next)
                        })
                    })
                })
            })
        })
        .catch(next)
})

//Get purchase
router.get('/getallpurchase', (req, res, next) => {
    Purchase.find({}).sort({ updatedAt: 'desc' })
        .then((purchase) => { res.json(purchase) })
        .catch(next)
})

//Get user info
router.get('/user/:id', (req, res, next) => {
    User.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

//Change Credit
router.post('/changecredit/:id', (req, res, next) => {
    User.findOneAndUpdate({ "_id": req.params.id }, { "credit": req.body.credit })
        .then(data => res.json(data))
        .catch(next)
});


module.exports = router;