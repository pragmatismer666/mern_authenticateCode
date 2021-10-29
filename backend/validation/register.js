const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    if(!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.message = 'Username must be between 2 to 30 chars';
    }
    
    if(Validator.isEmpty(data.username)) {
        errors.message = 'Username field is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.message = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.message = 'Email is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.message = 'Password must have 6 chars';
    }

    if(Validator.isEmpty(data.password)) {
        errors.message = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}