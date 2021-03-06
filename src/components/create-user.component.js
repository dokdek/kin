import React, { useState } from "react";
import {TextField, Button} from "@material-ui/core";
import Axios from "axios";


const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    
    const user = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    Axios.post("https://kin-site.herokuapp.com/users/signup", user)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }

  return(
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
    <TextField id="standard-basic" label="Email" onChange={e => {
      setEmail(e.target.value)}}/>
    <TextField id="filled-basic" label="Password" onChange={e => {setPassword(e.target.value)}}/>
    <Button color='primary' variant='contained' type='submit'>Add</Button>
  </form>
  );
}

export default CreateUser;
