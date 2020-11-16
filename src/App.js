import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
//import './assets/main.css';
import Navbar from './components/navbar.component';
import TransactionList from './components/transaction-list.component';
import CreateTransaction from './components/create-transaction.component';
import CreateUser from './components/create-user.component';
import UpdateTransaction from './components/update-transaction.component';

function App() {
  return (
    <Router>
        <Navbar />
        <Route path='/' exact component={TransactionList}/>
        <Route path='/update/:id' component={UpdateTransaction}/>
        <Route path='/newTransaction' component={CreateTransaction}/>
        <Route path='/signup' component={CreateUser}/>
    </Router>
  );
}

export default App;
