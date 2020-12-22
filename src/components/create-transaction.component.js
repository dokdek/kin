import React, { useState, useEffect } from "react";
import { makeStyles, TextField, Button, ListSubheader, MenuItem, FormControl, Select, InputLabel } from "@material-ui/core";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(() => ({
  FormStyle: {
    marginLeft: "10%",
  },
}));

const CreateTransaction = ({ isAuth, username }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [paymentList, setPaymentList] = useState([]);
  const [payment, setPayment] = useState("");

  useEffect(() => {
    getLists();
  }, []);

  function getLists() {
    const user = { username: username };
    Axios.post("http://localhost:5000/users/getCategory", user, {
      withCredentials: true,
    })
      .then((response) => {
        console.log(response);
        if (response.data != "") {
          setCategoryList(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    Axios.post("http://localhost:5000/users/getPayment", user, {
      withCredentials: true,
    })
      .then((response) => {
        if (response.data != "") {
          setPaymentList(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const transaction = {
      username: username,
      description: description,
      amount: amount,
      date: date,
      category: category,
      paymentType: payment,
    };
    Axios.post("http://localhost:5000/transactions/add", transaction, {
      withCredentials: true,
    })
      .then((res) => console.log(res.data))
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    console.log(transaction);
  }

  function loadList(listType){
    return(
      listType.map((list) => {
        return <ListSubheader>{list}</ListSubheader>
        list.map((subList) => {
          return <MenuItem value={subList}>{subList}</MenuItem>
        });
      })
    );
  }

  if (isAuth == true) {
    // const classes = useStyles();
    return (
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <TextField
          id="standard-basic"
          label="Description"
          onChange={(e) => {
            console.log(e.target.value);
            setDescription(e.target.value);
          }}
        />
        <TextField
          id="filled-basic"
          label="Amount"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            variant="inline"
            label="Date: "
            value={date}
            onChange={(e) => setDate(date)}
          />
        </MuiPickersUtilsProvider>

        <FormControl>
        <InputLabel htmlFor="category-select">Category</InputLabel>
        <Select defaultValue="" id="category-select">
          {loadList(categoryList)}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="payment-select">Account</InputLabel>
        <Select defaultValue="" id="payment-select">
          {loadList(paymentList)}
        </Select>
      </FormControl>

        <Button color="primary" variant="contained" type="submit">
          Add
        </Button>
      </form>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default CreateTransaction;
