const express = require('express')
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const app = express()

const numCPUs = os.cpus().length;
console.log(numCPUs);

const PORT = process.env.PORT || 4000

if(cluster.isPrimary) {
    // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
    app.get('/', async (req, res) => {

        let result = 0
        for (let i = 0; i < 1000000; i++) {
            result += i;
        }
        return res.json({precessId: process.disconnect, result})
    })

    app.listen(PORT, () => {
        console.log(`Listing in port ${PORT} and PID: ${process.pid}`);
    })
}