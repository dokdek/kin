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
        if (response.data !== "") {
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
        if (response.data !== "") {
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

  //Renders the select group, iterates through the categories and sub categories, returns an array
  //of the main category, followed by its subcategories. React renders array via index, so subheader first, then all menu items.
  function renderCategorySelectGroup(item) {
    const items = item.subCategories.map((value, index) => {
      return (
        <MenuItem key={index} value={value}>
          {value}
        </MenuItem>
      );
    });
    return [<ListSubheader>{item.category}</ListSubheader>, items];
  }

  function renderPaymentSelectGroup(item) {
    const items = item.subPayments.map((value, index) => {
      return (
        <MenuItem key={index} value={value}>
          {value}
        </MenuItem>
      );
    });
    return [<ListSubheader>{item.payment}</ListSubheader>, items];
  }

  if (isAuth == true) {
    // const classes = useStyles();
    return (
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
            variant="inline"
            label="Date: "
            value={date}
            onChange={(e) => setDate(date)}
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
            {categoryList.map((cat) => renderCategorySelectGroup(cat))} {/*Passes each cat through the render function, read above*/}
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
            {paymentList.map((payment) => renderPaymentSelectGroup(payment))} {/*Passes each pmt through the render function, read above*/}
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
