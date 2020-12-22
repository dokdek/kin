import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import './assets/main.css';
import Navbar from "./components/navbar.component";
import TransactionList from "./components/transaction-list.component";
import CreateTransaction from "./components/create-transaction.component";
import CreateUser from "./components/create-user.component";
import UpdateTransaction from "./components/update-transaction.component";
import Login from "./components/login";
import Axios from "axios";
import jwtDecode from 'jwt-decode';

function App() {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  function checkAuth() {
    Axios.get("http://localhost:5000/auth", { withCredentials: true })
      .then((res) => {
        console.log("token ok");
        console.log(res.data);
        setAuth(res.data.auth);
        setUsername(jwtDecode(res.data.token).username);
      })
      .catch((error) => {
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
      <Route
        path="/login"
        render={(props) => <Login {...props} setUsername={setUsername} />} //sends setUsername hook down to child to update parent state.
      />
      <Route
        path="/list"
        render={(props) => <TransactionList {...props} isAuth={auth} username={username} />}
      />
      <Route path="/update/:id" component={UpdateTransaction} />
      <Route path="/newTransaction" 
      render={(props) => <CreateTransaction {...props} isAuth={auth} username={username}/>}/>
      <Route path="/signup" component={CreateUser} />
    </Router>
  );
}

export default App;
