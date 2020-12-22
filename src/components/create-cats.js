import React, { useState, useEffect } from "react";
import Axios from "axios";
import { makeStyles, TextField, Button } from "@material-ui/core";

const AddCats = ({ isAuth, username }) => {
  const [paymentList, setPaymentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [mainCat, setMainCat] = useState("");
  const [mainAcc, setMainAcc] = useState("");

  function addMainCat(type){
      const route;
      if(type === "payment"){
        route = "http://localhost:5000/users/addPayment";
      }
      Axios.post("http://localhost:5000/users/addPayment")
  }

  if (isAuth == true) {
    // const classes = useStyles();
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          label="Description"
          onChange={(e) => {
            setMainCat(e.target.value);
          }}
        />
        <Button color="primary" variant="contained" onClick={addMainCat()}>
          Add Main Cat
        </Button>
      </form>
    );
  }
};

export default AddCats;
