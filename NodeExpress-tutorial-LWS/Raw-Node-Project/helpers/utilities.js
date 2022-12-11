// module scaffolding
const crypto = require('crypto')
const environments = require('./environments')
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try{
        output = JSON.parse(jsonString)
    } catch {
        output = {}
    }

    return output
}

// hash string
utilities.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        // console.log(environments, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false
}

// check user provide information is valid
utilities.checkUserValidation = (propertyName, len, phn) => {
    if(phn) {
        const validation = 
        typeof propertyName === 'string' &&
            propertyName.trim().length === len ? propertyName : false;
        return validation;
    }
    const validation = 
        typeof propertyName === 'string' &&
            propertyName.trim().length > len ? propertyName : false;

    return validation
}

utilities.createRandomString = (strlength) => {
    let length = strlength;
    length = typeof strlength === 'number' && strlength > 0 ? strlength : false;

    if (length) {
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
}

module.exports = utilities;