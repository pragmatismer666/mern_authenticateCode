const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const Productpic = require('../models/productpic');
const Code = require('../models/code');
const Purchase = require('../models/purchase');
const Advertise = require('../models/advertise');
const Ticket = require('../models/ticket');
const Message = require('../models/message');
const Specprice = require('../models/specprice');

//Get all products
router.get('/product/list/:id', (req, res, next) => {
    Product.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.get('/product/m/list/:reseller_id', (req, res, next) => {
    Product.find({})
        .then(products => {
            let resProducts = [];
            for (let i = 0; i < products.length; i++) {
                let resProduct = {};
                resProduct._id = products[i]._id;
                resProduct.category_id = products[i].category_id;
                resProduct.product_name = products[i].product_name;
                resProduct.meta_data = products[i].meta_data;
                resProduct.createdAt = products[i].createdAt;
                resProduct.updatedAt = products[i].updatedAt;
                Specprice.findOne({ "product_id": products[i]._id, "user_id": req.params.reseller_id })
                    .then(specprice => {
                        if (specprice !== null) {
                            resProduct.credit_price = specprice.price;
                        } else {
                            resProduct.credit_price = products[i].credit_price;
                        }
                        resProducts.push(resProduct);
                        if ((i + 1) === products.length) {
                            res.json(resProducts);
                        }
                    })
                    .catch(next)
            }
        })
        .catch(next)
});

//Get credit
router.get('/getcredit/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(reseller => {
            res.json(reseller.credit);
        })
        .catch(next)
});

//Get count of product code
router.get('/countcode/:id', (req, res, next) => {
    Code.countDocuments({ "product_id": req.params.id, "is_active": true }, function (err, codeCount) {
        res.json(codeCount);
    });
});

//Purchase
router.post('/purchase', (req, res, next) => {
    if (req.body) {
        var codes = [];
        var code_ids = [];
        for (let i = 0; i < parseInt(req.body.amount); i++) {
            Code.findOneAndUpdate({ "is_active": true, "product_id": req.body.product_id }, { "is_active": false })
                .then(code => {
                    codes.push(code.code);
                    code_ids.push(code._id);
                    if ((i + 1) === parseInt(req.body.amount)) {
                        newPurchase = {};
                        newPurchase.user_id = req.body.user_id;
                        newPurchase.code_ids = code_ids;
                        newPurchase.product_id = req.body.product_id;
                        newPurchase.amount = req.body.amount;
                        Purchase.create(newPurchase)
                            .then(purchase => {
                                User.findOneAndUpdate({ "_id": req.body.user_id }, { "credit": req.body.credits })
                                    .then((user) => {
                                        res.json(codes);
                                    })
                                    .catch(next)
                            })
                            .catch(next)
                    }
                })
        }
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

//Get purchased code
router.get('/purchasedcode/:id', (req, res, next) => {
    Purchase.find({ user_id: req.params.id }).sort({ updatedAt: 'desc' })
        .then(data => res.json(data))
        .catch(next)
});

//Get code by id
router.get('/getcode/:id', (req, res, next) => {
    var resCode = {};
    Code.findOne({ "_id": req.params.id, is_active: false })
        .then((code) => {
            Product.findOne({ "_id": code.product_id }).
                then((product) => {
                    resCode.code = code.code;
                    resCode.updatedAt = code.updatedAt;
                    resCode.product_name = product.product_name;
                    resCode.filename = product.meta_data.filename;
                    res.json(resCode);
                })
                .catch(next)
        })
        .catch(next)
});

//Receiver List
router.get('/receivers/list/:main_reseller_id', (req, res, next) => {
    User.find({ "role": "admin" })
        .then(admin => {
            User.find({ "_id": req.params.main_reseller_id, "role": "mainreseller" })
                .then(mainresellers => {
                    let response = [];
                    response = admin.concat(mainresellers)
                    res.json(response)
                })
                .catch(next)
        })
        .catch(next)

});

//Ticket
router.get('/ticket/list/:user_id', (req, res, next) => {
    Ticket.find({ user_id: req.params.user_id })
        .then(data => res.json(data))
        .catch(next)
});

router.post('/ticket/add', (req, res, next) => {
    if (req.body) {
        Ticket.create(req.body)
            .then(data => {
                res.json(data);
                if(req.io != undefined && req.io.length > 0) {
                    for(var i = 0 ; i < req.io.length ; i ++) {
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

//Message
router.get('/message/list/:ticket_id', (req, res, next) => {
    Message.find({ ticket_id: req.params.ticket_id }).sort({ updatedAt: 'asc' })
        .then(data => {
            let messages = [];
            messages = data;
            let resMsgs = [];
            for (let i = 0; i < messages.length; i++) {
                User.findOne({ "_id": messages[i].user_id })
                    .then(user => {
                        let resMsg = {};
                        resMsg._id  = messages[i]._id;
                        resMsg.user_id  = messages[i].user_id;
                        resMsg.ticket_id  = messages[i].ticket_id;
                        resMsg.message  = messages[i].message;
                        resMsg.createdAt  = messages[i].createdAt;
                        resMsg.updatedAt  = messages[i].updatedAt;
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

//Dashboard Info 
router.get('/info/:id', (req, res, next) => {
    var credits;
    var purchasedcodes;
    User.findOne({ "_id": req.params.id })
        .then((data) => {
            credits = data.credit;
            Purchase.countDocuments({ "user_id": req.params.id }, function (err, purchasedcodesCount) {
                Productpic.find({}).sort({ createdAt: 'desc' })
                    .then((productpic) => {
                        purchasedcodes = purchasedcodesCount;
                        var info = {};
                        info.credits = credits;
                        info.purchasedcodes = purchasedcodes;
                        info.productpic = productpic;
                        res.json(info);
                    })
                    .catch(next)
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

//Get news
router.get('/getnews', (req, res, next) => {
    Advertise.find({}).sort({ updatedAt: 'desc' })
        .then((advertise) => { res.json(advertise) })
        .catch(next)
})

//Get user info
router.get('/user/:id', (req, res, next) => {
    User.find({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next)
});


module.exports = router;