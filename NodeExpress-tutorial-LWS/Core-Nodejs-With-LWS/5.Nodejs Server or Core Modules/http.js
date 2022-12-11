const http = require('http')

const server = http.createServer((req, res) => {
    res.write(`message: 'Server Running'`)
    res.end()
});

server.listen(4000)

console.log(`listening on port 4000`);