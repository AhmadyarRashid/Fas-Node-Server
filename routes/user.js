const express = require("express")
const users = express.Router()
const cors = require("cors")

users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/login', (req, res) => {
    console.log(req);
    res.send({'login': 'OK'});

})

module.exports = users