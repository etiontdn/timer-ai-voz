const express = require('express')
const app = express()

/*
app.use(function (req, res, next) {
    console.log('middleware 1')
    next()
})*/

app.get('/interpret', (req, res) => {
    const data = req.body

})

app.listen(3000, () => {
console.log('Listening on port 3000')
})