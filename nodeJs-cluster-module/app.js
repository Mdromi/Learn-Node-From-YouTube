const express = require('express')

const app = express()


app.get('/', async (req, res) => {

    let result = 0
    for (let i = 0; i < 100000000000; i++) {
        result += i;
    }
    return res.json({precessId: process.disconnect, result})
})












const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listing in port ${PORT} and PID: ${process.pid}`);
})