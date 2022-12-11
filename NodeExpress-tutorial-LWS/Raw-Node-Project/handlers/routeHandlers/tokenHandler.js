// dependencies
const data = require('../../lib/data');
const { hash, createRandomString, parseJSON, checkUserValidation} = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone = checkUserValidation(requestProperties.body.phone, 11, 'phn');
    const password = checkUserValidation(requestProperties.body.password, 0);

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedpassword = hash(password);
            if (hashedpassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;

                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                })

            } else {
                callback(400, {
                    error: 'Password is not valid!',
                });
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
}

handler._token.get = (requestProperties, callback) => {
    // check the id if valid
    const id = checkUserValidation(requestProperties.queryStringObject.id, 20, 'id');
    if (id) {
        // lookup the token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested token was not found!',
        });
    }
}

handler._token.put = (requestProperties, callback) => {
    // check the token if valid
    const id = checkUserValidation(requestProperties.body.id, 20, 'id');
    const extend = (
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );

    if (id && extend){
        data.read('tokens', id, (err1, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the updated token
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: `Token Updated Successfully`,
                        }, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            }else {
                callback(400, {
                    error: 'Token already expired!',
                });
            }
        })
    }  else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
}


handler._token.delete = (requestProperties, callback) => {
    // check the token if valid
    const id = checkUserValidation(requestProperties.queryStringObject.id, 20, 'id');

    if (id) {
        // lookup the user
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
}

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};


module.exports = handler