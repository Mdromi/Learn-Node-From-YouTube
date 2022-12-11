// dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');
const { checkUserValidation } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

// validate token
const tokenValidation = (token) => {
    return token = typeof token === 'string' ? token : false;
}

// validate check input
validateCheckInput = (requestProperties, condition) => {

    // protocol, url, method, successCodes, timeoutSeconds
    if(condition === 'protocol') {
        return typeof requestProperties === 'string' && ['http', 'https']
            .indexOf(requestProperties) > -1 ? requestProperties : false
    }

    if(condition === 'url') {
        return typeof requestProperties === 'string' && requestProperties.trim()
            .length > 0 ? requestProperties : false;
    }

    if(condition === 'method') {
        return typeof requestProperties === 'string' && ['GET', 'POST', 'PUT', 'DELETE']
            .indexOf(requestProperties) > -1 ? requestProperties : false;
    }

    if(condition === 'successCodes') {
        return typeof requestProperties === 'object' && requestProperties instanceof Array ? 
            requestProperties : false;
    }

    if(condition === 'timeoutSeconds') {
        return typeof requestProperties === 'number' && requestProperties % 1 === 0 && 
            requestProperties >= 1 && requestProperties <= 5 ? 
            requestProperties : false;
    }

}

handler._check.post = (requestProperties, callback) => {
    
    // validate inputs
    const protocol = validateCheckInput(requestProperties.body.protocol, 'protocol')
    const url = validateCheckInput(requestProperties.body.url, 'url')
    const method = validateCheckInput(requestProperties.body.method, 'method')
    const successCodes = validateCheckInput(requestProperties.body.successCodes, 'successCodes')
    const timeoutSeconds = validateCheckInput(requestProperties.body.timeoutSeconds, 'timeoutSeconds')

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const token = tokenValidation(requestProperties.headerObject.token)
        
        // lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if(!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if(tokenIsValid) {
                                const userObject = parseJSON(userData);
                                const userChecks = typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array ? userObject.checks : [];
                                
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);
                                            // add check id to the user's object

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'There was a problem in the server side!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There was a problem in the server side!',
                                            });
                                        }
                                    })
                                } else {
                                    callback(401, {
                                        error: 'User has already reached max check limit!',
                                    });
                                }
                            }  else {
                                callback(403, {
                                    error: 'Authentication problem!',
                                });
                            }
                        });
                    }   else {
                        callback(403, {
                            error: 'User not found!',
                        });
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication problem!',
                });
            }
        });

    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
}

handler._check.get = (requestProperties, callback) => {
    const id = checkUserValidation(requestProperties.queryStringObject.id, 20, 'id');

    if (id) {
        // lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = tokenValidation(requestProperties.headerObject.token)

                tokenHandler._token.verify(
                    token,
                    parseJSON(checkData).userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error: 'Authentication failure!',
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: 'You have a problem in your request',
                });
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
}

handler._check.put = (requestProperties, callback) => {
    const id = checkUserValidation(requestProperties.body.id, 20, 'id');

    // validate inputs
    const protocol = validateCheckInput(requestProperties.body.protocol, 'protocol')
    const url = validateCheckInput(requestProperties.body.url, 'url')
    const method = validateCheckInput(requestProperties.body.method, 'method')
    const successCodes = validateCheckInput(requestProperties.body.successCodes, 'successCodes')
    const timeoutSeconds = validateCheckInput(requestProperties.body.timeoutSeconds, 'timeoutSeconds')

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJSON(checkData);
                    const token = tokenValidation(requestProperties.headerObject.token)

                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) checkObject.protocol = protocol;
                            if (url) checkObject.url = url;
                            if (method) checkObject.method = method;
                            if (successCodes) checkObject.successCodes = successCodes;
                            if (timeoutSeconds) checkObject.timeoutSeconds = timeoutSeconds;

                            // store the checkObject
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'update Successfully',
                                        checkObject
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a server side error!',
                                    });
                                }
                            })
                        } else {
                            callback(403, {
                                error: 'Authentication error!',
                            });
                        }
                    })
                } else {
                    callback(500, {
                        error: 'There was a problem in the server side!',
                    });
                }
            })
        } else {
            callback(400, {
                error: 'You must provide at least one field to update!',
            });
        }
    }else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }

}

handler._check.delete = (requestProperties, callback) => {
    const id = checkUserValidation(requestProperties.queryStringObject.id, 20, 'id');

    if(id) {
        // lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token = tokenValidation(requestProperties.headerObject.token)
                const userPhone = parseJSON(checkData).userPhone

                tokenHandler._token.verify(token, userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) { 
                            // delete the check data
                            data.delete('checks', id, (err2) => {
                                if (!err2) {
                                    data.read('users', userPhone,
                                        (err3, userData) => {
                                            const userObject = parseJSON(userData);
                                            if (!err3 && userData) {
                                                const userChecks =
                                                    typeof userObject.checks === 'object' &&
                                                    userObject.checks instanceof Array
                                                        ? userObject.checks
                                                        : [];

                                                // remove the deleted check id from user's list of checks
                                                const checkPosition = userChecks.indexOf(id);

                                                if (checkPosition > -1) {
                                                    userChecks.splice(checkPosition, 1);
                                                    // resave the user data
                                                    userObject.checks = userChecks;

                                                    data.update('users', userObject.phone, userObject,
                                                        (err4) => {
                                                            if (!err4) {
                                                                callback(200,{
                                                                    message:'Deleted & Updated',
                                                                    userObject
                                                                });
                                                            } else {
                                                                callback(500, {
                                                                    error:
                                                                        'There was a server side problem!',
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'The check id that you are trying to remove is not found in user!',
                                                    });
                                                }
                                            } else {
                                                callback(500, {
                                                    error: 'There was a server side problem!',
                                                });
                                            }
                                        });
                                } else {
                                    callback(500, {
                                        error: 'There was a server side problem!',
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
                callback(500, {
                    error: 'You have a problem in your request',
                });
            }
        })
    }else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }

}

module.exports = handler