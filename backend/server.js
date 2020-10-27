const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
//const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(cors());
app.use(express.json());
//app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
connection.once('open', () => {
    console.log('MongoDB connect established.')
})


app.listen(port, () => {
    console.log('Server is running at port ' + port);
})