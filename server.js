const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const usersRouter = require('./backend/routes/users');
const transactionsRouter = require('./backend/routes/transactions');
const loginRouter = require('./backend/routes/login');
const authRouter = require('./backend/routes/auth');
const expressjwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(cors({origin: "https://kin-site.herokuapp.com", credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
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