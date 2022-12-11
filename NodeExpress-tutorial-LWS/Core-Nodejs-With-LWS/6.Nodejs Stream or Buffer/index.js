const fs = require('fs')
const http = require('http')


const ourReadStream = fs.createReadStream(`${__dirname}/bigData.txt`)
const ourWriteStream = fs.createWriteStream(`${__dirname}/outputData.txt`)
const ourReadStreamImg = fs.createReadStream(`${__dirname}/nodejs.png`)

ourReadStream.on('data', (chunk) => {
    console.log(chunk.toString());
})

ourReadStream.on('data', (chunk) => {
    ourWriteStream.write(chunk)
})

ourReadStreamImg.on('data', (chunk) => {
    fs.writeFileSync("new-path.jpg", chunk);
    // console.log(chunk.toString('base64'));
})

// const buffer = fs.readFileSync(`${__dirname}/nodejs.png`);
// fs.writeFileSync("new-path.jpg", buffer);

const server = http.createServer((req, res) => {
    res.write(`message: 'Server Running'`)
    res.end()
});

server.listen(4000)

console.log(`listening on port 4000`);