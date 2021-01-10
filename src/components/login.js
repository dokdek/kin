import React, { useState } from "react";
import { TextField, Button, Paper, Snackbar } from "@material-ui/core";
import Axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  backgroundDiv: {
    width: "100%",
    height: "300px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    justifySelf: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = ({ setUsername, isAuth, setAuth, browserHistory}) => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failureOpen, setFailureOpen] = useState(false);

  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFailureOpen(false);
  };

  function onSubmit(e) {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    Axios.post("https://sheltered-escarpment-85529.herokuapp.com/login/login", user, {
      withCredentials: true,
    })
      .then((res) => {
        setUsername(jwtDecode(res.data).username);
        setAuth(true);
        //Taken from react router docs.
        const location = this.props.location
        if (location.state && location.state.nextPathname) {
          browserHistory.push(location.state.nextPathname)
        } else {
          browserHistory.push('/')
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          setFailureOpen(true);
        } else if (error.request) {
          console.log(error.request);
          setFailureOpen(true);
        } else {
          console.log("Error", error.message);
          setFailureOpen(true);
        }
      });
  }

  if(isAuth === false){
  return (
    <div className={classes.backgroundDiv}>
      <Paper square variant="elevation">
      <form autoComplete="off" className={classes.form} onSubmit={onSubmit}>
        <TextField required id="email" label="Email" onChange={(e) => {
          setEmail(e.target.value)
        }}/>
        <TextField required id="password" label="Password" type="password" onChange={(e) => {
          setPassword(e.target.value)
        }}/>
        <Button color="primary" variant="contained" type="submit">
          Login
        </Button>
      </form>
      </Paper>
      <Snackbar open={failureOpen} onClose={handleClose} autoHideDuration={6000}>
        <Alert severity="error">Login failed, please retry</Alert>
      </Snackbar>
      </div>
  );
  }else{
    return(
      <Redirect to="/catlist"/>
    )
  }
};

export default Login;
