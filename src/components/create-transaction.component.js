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
  Modal,
} from "@material-ui/core";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import getLists from "./helpers/getLists";
import renderCategorySelectGroup from "./helpers/renderCategorySelectGroup";
import renderPaymentSelectGroup from "./helpers/renderPaymentSelectGroup";
import NumberFormat from "react-number-format";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

const CreateTransaction = ({
  username,
  open,
  setOpen,
  setForceReload,
  forceReload,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  const [date, setDate] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [paymentList, setPaymentList] = useState([]);
  const [payment, setPayment] = useState("");
  const [formValidated, setFormValidated] = useState(true);
  const [toggleValue, setToggleValue] = useState("negative");

  const classes = useStyles();

  function formCheck() {
    if (
      description.length > 0 &&
      amount &&
      payment.length > 0 &&
      category.length > 0
    ) {
      setFormValidated(false);
    } else {
      setFormValidated(true);
    }
  }

  useEffect(() => {
    if (categoryList.length === 0) {
      getLists(username, setCategoryList, setPaymentList);
    }
    formCheck();
  }, [description, amount, payment, category]);

  function onSubmit(e) {
    e.preventDefault();
    let transaction;
    if (toggleValue == "positive") {
       transaction = {
        username: username,
        description: description,
        amount: -amount,
        date: date,
        category: category,
        paymentType: payment,
      }
    }else{
       transaction = {
        username: username,
        description: description,
        amount: amount,
        date: date,
        category: category,
        paymentType: payment,
      }
    }
    Axios.post("https://kin-site.herokuapp.com/transactions/add", transaction, {
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setForceReload(!forceReload); //forces reload of catlist component
        //clears the form
        setDescription("");
        setAmount();
        setCategory("");
        setPayment("");
        setToggleValue("negative");
        handleClose();
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
    console.log(transaction);
  }

  const handleToggle = (e, newToggle) => {
    setToggleValue(newToggle);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const classes = useStyles();
  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          top: `50%`,
          left: `50%`,
          transform: `translate(-50%, -50%)`,
        }}
        className={classes.paper}
      >
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
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
          <ToggleButtonGroup
            size="small"
            value={toggleValue}
            exclusive
            onChange={handleToggle}
          >
            <ToggleButton value="negative">
              <RemoveIcon />
            </ToggleButton>
            <ToggleButton value="positive">
              <AddIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              label="Date: "
              value={date}
              autoOk={true}
              onChange={(e, date) => {
                setDate(e);
              }}
            />
          </MuiPickersUtilsProvider>
          <div style={{display: "flex", flexDirection: "column" }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="category-select">Category</InputLabel>
            <Select
              labelId="category-select"
              value={category}
              autoWidth
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              id="category-select"
            >
              <MenuItem key="add-to-budget" value={"Add to budget"}>Add to budget</MenuItem>
              {categoryList.map((cat) =>
                renderCategorySelectGroup(cat, ListSubheader, MenuItem)
              )}{" "}
              {/*Passes each cat through the render function, read above*/}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="payment-select">Account</InputLabel>
            <Select
              labelId="payment-select"
              value={payment}
              autoWidth
              onChange={(e) => {
                setPayment(e.target.value);
              }}
              id="payment-select"
            >
              {paymentList.map((payment) =>
                renderPaymentSelectGroup(payment, ListSubheader, MenuItem)
              )}{" "}
              {/*Passes each pmt through the render function, read above*/}
            </Select>
          </FormControl>
          </div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={formValidated}
          >
            Add
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTransaction;
