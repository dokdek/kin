import React, { useState, useEffect } from "react";
import { makeStyles, TextField, Button } from "@material-ui/core";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  FormStyle: {
    marginLeft: "10%",
  },
}));

const CreateTransaction = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [paymentList, setPaymentList] = useState([]);
  const [payment, setPayment] = useState("");

  useEffect(() => {
    getCategory();
    //getPaymentList();
  }, []);

  function getCategory() {
    Axios.get("http://localhost:5000/users/getCategory", {
      withCredentials: true,
    })
      .then((response) => {
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
  }

  function onSubmit(e) {
    e.preventDefault();

    const transaction = {
      description: name,
      amount: amount,
      date: date,
      category: category,
      paymentType: payment
    };
    Axios.post("http://localhost:5000/transactions/add", transaction, {
      withCredentials: true,
    })
      .then((res) => console.log(res.data))
      .catch((res) => console.log(res));
    console.log(transaction);
  }

  // const classes = useStyles();
  //need to add on change on the catagory picker.
  return (
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField
        id="standard-basic"
        label="Name"
        onChange={(e) => {
          console.log(e.target.value);
          setName(e.target.value);
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
      <Autocomplete
        id="category-select"
        style={{ width: 200 }}
        freeSolo
        options={categoryList}
        renderInput={(params) => (
          <TextField {...params} label="Category" variant="outlined" onChange={(e) => setCategory(e.target.value)} />
        )}
      />
      <Button color="primary" variant="contained" type="submit">
        Add
      </Button>
    </form>
  );
};

export default CreateTransaction;
