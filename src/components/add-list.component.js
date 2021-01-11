import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  makeStyles,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Modal,
  Divider,
} from "@material-ui/core";
import getLists from "./helpers/getLists";

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

const AddCats = ({ username, open, setOpen, forceReload, setForceReload }) => {
  const [paymentList, setPaymentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [mainSelect, setSelect] = useState("");
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");

  const classes = useStyles();

  function addPayment(e) {
    e.preventDefault();
    let route =
      "https://sheltered-escarpment-85529.herokuapp.com/users/addPayment";
    const user = {
      username: username,
      category: mainText,
    };
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setMainText("");
        setForceReload(!forceReload);
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

  function addCategory(e) {
    e.preventDefault();
    let route =
      "https://sheltered-escarpment-85529.herokuapp.com/users/addCategory";
    const user = {
      username: username,
      category: mainText,
    };
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setMainText("");
        setForceReload(!forceReload);
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

  function addSubCat(e) {
    e.preventDefault();
    let route =
      "https://sheltered-escarpment-85529.herokuapp.com/users/addSubCategory";
    const user = {
      username: username,
      category: mainSelect,
      subCategory: subText,
    };
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setSelect("");
        setSubText("");
        setForceReload(!forceReload);
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

  function addSubPay(e) {
    e.preventDefault();
    let route =
      "https://sheltered-escarpment-85529.herokuapp.com/users/addSubPayment";
    const user = {
      username: username,
      category: mainSelect,
      subCategory: subText,
    };
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setSelect("");
        setSubText("");
        setForceReload(!forceReload);
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

  useEffect(() => {
    getLists(username, setCategoryList, setPaymentList);
  }, [forceReload]);

  const handleClose = () => {
    setOpen(false);
  };

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
        <form
          onSubmit={(e) => {
            addPayment(e);
          }}
        >
          <TextField
            required
            id="standard-basic"
            label="New Account Type"
            onChange={(e) => {
              setMainText(e.target.value);
            }}
          />
          <Button color="primary" variant="contained" type="submit">
            New Account Type
          </Button>
        </form>
        <form onSubmit={(e) => addCategory(e)}>
          <TextField
            id="standard-basic"
            label="New Main Category"
            required
            onChange={(e) => {
              setMainText(e.target.value);
            }}
          />
          <Button color="primary" variant="contained" type="submit">
            New Category
          </Button>
        </form>
        <br></br>
        <br></br>
        <Divider />
        <form onSubmit={(e) => addSubCat(e)}>
          <FormControl className={classes.formControl}required>
            <InputLabel id="category-select">Category</InputLabel>
            <Select
              labelId="category-select"
              value={mainSelect}
              onChange={(e) => {
                setSelect(e.target.value);
              }}
              id="category-select"
            >
              {categoryList.map((cat, index) => (
                <MenuItem key={index} value={cat.category}>
                  {cat.category}
                </MenuItem>
              ))}
              {/*Passes each cat through the render function, read above*/}
            </Select>
          </FormControl>
          <br></br>
          <TextField
            id="standard-basic"
            label="New Subcategory"
            required
            onChange={(e) => {
              setSubText(e.target.value);
            }}
          />
          <Button color="primary" variant="contained" type="submit">
            New Subcategory
          </Button>
        </form>
        <br></br>
        <form onSubmit={(e) => addSubPay(e)}>
          <FormControl className={classes.formControl}required>
            <InputLabel id="payment-select">Account</InputLabel>
            <Select
              labelId="payment-select"
              value={mainSelect}
              onChange={(e) => {
                setSelect(e.target.value);
              }}
              id="payment-select"
            >
              {paymentList.map((cat, index) => (
                <MenuItem key={index} value={cat.payment}>
                  {cat.payment}
                </MenuItem>
              ))}
              {/*Passes each cat through the render function, read above*/}
            </Select>
          </FormControl>
          <br></br>
          <TextField
            id="standard-basic"
            label="New Account"
            required
            onChange={(e) => {
              setSubText(e.target.value);
            }}
          />
          <Button color="primary" variant="contained" type="submit">
            New Account
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCats;
