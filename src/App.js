import React, {useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import './assets/main.css';
import Navbar from "./components/navbar.component";
import TransactionList from "./components/transaction-list.component";
import CreateTransaction from "./components/create-transaction.component";
import CreateUser from "./components/create-user.component";
import UpdateTransaction from "./components/update-transaction.component";
import Login from "./components/login";
import Axios from "axios";

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  },[]);

  function checkAuth() {
    Axios.get("http://localhost:5000/auth",{withCredentials: true})
      .then((res) => {
        console.log("ok");
        console.log(res.data.auth);
        setAuth(res.data.auth);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          setAuth(false);
        } else if (error.request) {
          console.log(error.request);
          setAuth(false);
        } else {
          console.log("Error", error.message);
          setAuth(false);
        } 
      });
    }
  return (
    <Router>
      <Navbar />
      <Route path="/login" component={Login} />
      <Route
        path="/list"
        render={(props) => <TransactionList {...props} isAuth={auth} />}
      />
      <Route path="/update/:id" component={UpdateTransaction} />
      <Route path="/newTransaction" component={CreateTransaction} />
      <Route path="/signup" component={CreateUser} />
    </Router>
  );
}

export default App;
