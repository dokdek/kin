import React, { useState } from "react";
import {TextField, Button} from "@material-ui/core";
import Axios from "axios";
const auth = require('../firebase/create-user');



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    
    const user = {
      email: 'dokdek@test.com',
      password: '!wsadsadas233534',
      returnSecureToken: true
    }
    Axios.post("http://localhost:5000/login/login", user)
    .then(res => setEmail("login success"))
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
