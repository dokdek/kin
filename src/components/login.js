import React, { useState } from "react";
import {TextField, Button} from "@material-ui/core";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import jwtDecode from 'jwt-decode';

const Login = ({setUsername}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function onSubmit(e) {
    e.preventDefault();
    
    const user = {
      email: 'test@admin.com',
      password: '1234567',
      returnSecureToken: true
    }
    Axios.post("http://localhost:5000/login/login", user, {withCredentials: true})
    .then(res => {
      setUsername(jwtDecode(res.data).username);
      history.push("/list");
     } )
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        setEmail(error.response.data.error.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      } 
    });
  }

  return(
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
    <Button color='primary' variant='contained' type='submit'>Add</Button>
    <TextField disabled id="standard-disabled" label={email}/>
  </form>
  );
}

export default Login;
