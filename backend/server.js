const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
const loginRouter = require('./routes/login');
const expressjwt = require('express-jwt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;
const jwtCheck = expressjwt({secret: process.env.TOKEN_SECRET, algorithms: ['RS256']});

app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use(jwtCheck);
app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);
app.use(function(err, req, res, next) {
    if(401 == err.status) {
        res.redirect('/login')
    }
  }); //redirects back to login if not authorized

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
connection.once('open', () => {
    console.log('MongoDB connect established.')
})


app.listen(port, () => {
    console.log('Server is running at port ' + port);
})