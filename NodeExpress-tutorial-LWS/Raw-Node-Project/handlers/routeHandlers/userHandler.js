// dependencies
const data = require('../../lib/data');
const { hash, parseJSON, checkUserValidation } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler')

const tokenValidation = (token) => {
    return token = typeof token === 'string' ? token : false;
}

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete']
    if(acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
}

handler._user = {}

handler._user.post = (requestProperties, callback) => {

    const firstName = checkUserValidation(requestProperties.body.firstName, 0)
    const lastName = checkUserValidation(requestProperties.body.lastName, 0)
    const phone = checkUserValidation(requestProperties.body.phone, 11, 'phn');
    const password = checkUserValidation(requestProperties.body.password, 0);

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    
    
    if(firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });

            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        })
    }

    
}

handler._user.get = (requestProperties, callback) => {
    // check the phone number if valid
    const phone = checkUserValidation(requestProperties.queryStringObject.phone, 11, 'phn');

    if(phone) {
        const token = tokenValidation(requestProperties.headerObject.token)
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if(tokenId) {
                // lookup the user
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) };
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        })    
    } else {
        callback(404, {
            error: 'Requested user was not found!',
        });
    }
}
 
handler._user.put = (requestProperties, callback) => {
    // check the phone number if valid
    const firstName = checkUserValidation(requestProperties.body.firstName, 0)
    const lastName = checkUserValidation(requestProperties.body.lastName, 0)
    const phone = checkUserValidation(requestProperties.body.phone, 11, 'phn');
    const password = checkUserValidation(requestProperties.body.password, 0);

    if(phone) {
        if (firstName || lastName || password) {
            const token = tokenValidation(requestProperties.headerObject.token)
            tokenHandler._token.verify(token, phone, (tokenId) => {
            if(tokenId) {
                // loopkup the user
                data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };

                if (!err1 && userData) {
                    if (firstName) userData.firstName = firstName;
                    if (lastName) userData.firstName = firstName;
                    if (password) userData.password = hash(password);

                    // store to database
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'User was updated successfully!',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });

                } else {
                    callback(400, {
                        error: 'You have a problem in your request!',
                    });
                }

            })
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        })  
            
        } else {
            callback(400, {
                error: 'You have a problem in your request!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
}

handler._user.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone = checkUserValidation(requestProperties.queryStringObject.phone, 11, 'phn');

    if(phone) {
        const token = tokenValidation(requestProperties.headerObject.token)
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if(tokenId) {
                // lookup the user
                data.read('users', phone, (err1, userData) => {
                    if (!err1 && userData) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User was successfully deleted!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        }) 
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
}

module.exports = handler