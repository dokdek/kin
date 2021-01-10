const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const expressjwt = require('express-jwt');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/login', loginRouter);
const jwtCheck = expressjwt({secret: process.env.TOKEN_SECRET, algorithms: ['HS256'], getToken: req => req.cookies.token});
app.use(jwtCheck);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);

/*app.use(function(err, req, res, next) {
    if(401 == err.status) {
        res.json({auth: false});
    }
  }); //redirects back to login if not authorized*/

  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
connection.once('open', () => {
    console.log('MongoDB connection established.')
})


app.listen(port, () => {
    console.log('Server is running at port ' + port);
})