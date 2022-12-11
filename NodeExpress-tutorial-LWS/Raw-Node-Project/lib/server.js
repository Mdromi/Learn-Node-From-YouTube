// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
// const data = require('./data');

// server object - module scaffolding
const server = {};

// configuration
server.config = {
    port: 4000,
};

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(server.config.port, () => {
        console.log(`listening to port ${server.config.port}`);
    });
};

// handle Request Response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
};

// export
module.exports = server;