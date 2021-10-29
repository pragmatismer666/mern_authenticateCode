const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require("path");
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const multer = require("multer");

ObjectId = require('mongodb').ObjectID;

const User = require('../models/user');

const storage = multer.diskStorage({
    destination: "./public/assets/img/avatar",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("avatar");


const registerUser = (req, res) => {
    upload(req, res, () => {
        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }
            else {

                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role,
                    product_gain: req.body.product_gain,
                    credit: req.body.credit,
                    note: req.body.note,
                    avatar: req.file,
                    main_reseller_id: ObjectId(req.body.main_reseller_id)
                });

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) console.error('There was an error', err);
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) console.error('There was an error', err);
                            else {
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        res.json(user)
                                    });
                            }
                        });
                    }
                });
            }
        });
    });
}

const editUser = (req, res) => {
    upload(req, res, () => {
        const updatedUser = {};
        updatedUser.username = req.body.username;
        updatedUser.email = req.body.email;
        if (updatedUser.password !== '') {
            updatedUser.password = req.body.password;
        }

        if (updatedUser.product_gain !== undefined) {
            updatedUser.product_gain = req.body.product_gain;
        }

        if (updatedUser.credit !== undefined) {
            updatedUser.credit = req.body.credit;
        }

        if (updatedUser.note !== undefined) {
            updatedUser.note = req.body.note;
        }
        
        updatedUser.main_reseller_id = req.body.main_reseller_id;
        if (req.file != null) {
            updatedUser.avatar = req.file;
        } else {
            updatedUser.avatar = {};
        }
        if (req.body.file_flag == 1) {
            delete updatedUser.avatar;
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) console.error('There was an error', err);
            else {
                if (updatedUser.password) {
                    bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            updatedUser.password = hash;
                            User.findOneAndUpdate({ "_id": req.body._id }, updatedUser)
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                } else {
                    delete updatedUser.password;
                    User.findOneAndUpdate({ "_id": req.body._id }, updatedUser)
                        .then(user => {
                            res.json(user)
                        });
                }
            }
        });
    });
}

router.post('/register', registerUser);

router.post('/update', editUser);

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.message = 'User not found'
                return res.json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            _id: user._id,
                            username: user.username
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    _id: user._id,
                                    username: user.username,
                                    role: user.role,
                                    message: true,
                                    token: token
                                });
                            }
                        });
                    }
                    else {
                        errors.message = 'Incorrect Password';
                        return res.json(errors);
                    }
                });
        });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        credit: req.user.credit
    });
});

router.get('/getcredit/:id', (req, res, next) => {
    User.findOne({ "_id": req.params.id })
        .then((user) => {
            let respond = {};
            respond.credit = user.credit;
            respond.role = user.role;
            res.json(respond);
        })
        .catch(next)

});

router.get('/getavatar/:id', (req, res, next) => {
    User.findOne({ "_id": req.params.id })
        .then((user) => {
            res.json(user.avatar);
        })
        .catch(next)

});

router.get('/getprofile/:id', (req, res, next) => {
    User.findOne({ "_id": req.params.id })
        .then((user) => {
            res.json(user);
        })
        .catch(next)

});



module.exports = router;