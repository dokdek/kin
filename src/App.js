import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, useHistory } from "react-router-dom";
import Navbar from "./components/navbar.component";
import TransactionList from "./components/transaction-list.component";
import CreateUser from "./components/create-user.component";
import Login from "./components/login";
import { makeStyles } from "@material-ui/styles";
import CategoryList from "./components/category-list.component";
import checkAuth from "./components/helpers/checkAuth";

const useStyles = makeStyles((theme) => ({
  //toolbar: theme.mixins.toolbar
}));

function App() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState("");
  const [filterValue, setFilterValue] = useState({});
  const [forceReload, setForceReload] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    checkAuth()
      .then((user) => {
        setUsername(user.username.username);
        setAuth(user.auth);
        console.log(username);
        console.log(auth);
      })
      .catch((err) => {
        console.log(err);
        setUsername("");
        setAuth(false);
        console.log(auth);
      });
  }, [auth, username, forceReload]);

  const browserHistory = useHistory();

  const classes = useStyles();
  return (
    <div style={{ display: "flex" }}>
      <Router history={browserHistory}>
        {auth && (
          <Navbar
            username={username}
            setFilterValue={setFilterValue}
            setForceReload={setForceReload}
            forceReload={forceReload}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setAuth={setAuth}
            setUsername={setUsername}
          />
        )}{" "}
        {/*Hides navbar if auth is false */}
        <Route
          path="/login"
          render={(props) => (
            <Login {...props} setUsername={setUsername} isAuth={auth} setAuth={setAuth} setForceReload={setForceReload} forceReload={forceReload}/>
          )} //sends setUsername hook down to child to update parent state.
        />
        <Route
          path="/list"
          render={(props) => (
            <TransactionList
              key={filterValue.name}
              {...props}
              filterValue={filterValue}
              forceReload={forceReload}
              selectedDate={selectedDate}
              setForceReload={setForceReload}
            />
          )}
        />
        <Route path="/signup" component={CreateUser} />
        <Route
          path="/catlist"
          render ={(props) => (
            <CategoryList key={selectedDate}{...props} selectedDate={selectedDate} forceReload={forceReload} setForceReload={setForceReload} setAuth={setAuth} auth={auth}/>)}/>
        {(auth === false) && <Redirect to="/login"/>}
        <Redirect to='/catlist'/>
      </Router>
    </div>
  );
}

export default App;
