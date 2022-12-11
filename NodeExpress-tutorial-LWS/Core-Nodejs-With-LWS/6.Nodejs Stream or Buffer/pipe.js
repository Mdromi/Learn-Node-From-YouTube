const fs = require('fs')
const http = require('http')


// ourReadStream.pipe(ourWriteStream)

const server = http.createServer((req, res) => {
    const ourReadStream = fs.createReadStream(`${__dirname}/bigData.txt`, 'utf-8')
    ourReadStream.pipe(res)
});

server.listen(4000)

console.log(`listening on port 4000`);