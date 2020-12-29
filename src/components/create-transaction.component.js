import React, { useState, useEffect } from "react";
import {
  makeStyles,
  TextField,
  Button,
  ListSubheader,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@material-ui/core";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { Redirect } from "react-router-dom";
import getLists from './helpers/getLists';
import renderCategorySelectGroup from './helpers/renderCategorySelectGroup';
import renderPaymentSelectGroup from './helpers/renderPaymentSelectGroup';


const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar
}))


const CreateTransaction = ({ isAuth, username }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [paymentList, setPaymentList] = useState([]);
  const [payment, setPayment] = useState("");

  const classes = useStyles();

  useEffect(() => {
    getLists(username, setCategoryList, setPaymentList);
  }, []);

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

  if (isAuth == true) {
    // const classes = useStyles();
    return (
      <div>
        <div className={classes.toolbar}/>
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <TextField
          id="standard-basic"
          label="Description"
          onChange={(e) => {
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
            label="Date: "
            value={date}
            autoOk={true}
            onChange={(e,date) => setDate(e)}
          />
        </MuiPickersUtilsProvider>
        <FormControl>
          <InputLabel id="category-select">Category</InputLabel>
          <Select
            labelId="category-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            id="category-select"
          >
            {categoryList.map((cat) => renderCategorySelectGroup(cat, ListSubheader, MenuItem))} {/*Passes each cat through the render function, read above*/}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="payment-select">Account</InputLabel>
          <Select
            labelId="payment-select"
            value={payment}
            onChange={(e) => {
              setPayment(e.target.value);
            }}
            id="payment-select"
          >
            {paymentList.map((payment) => renderPaymentSelectGroup(payment, ListSubheader, MenuItem))} {/*Passes each pmt through the render function, read above*/}
          </Select>
        </FormControl>
        <Button color="primary" variant="contained" type="submit">
          Add
        </Button>
      </form>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default CreateTransaction;
