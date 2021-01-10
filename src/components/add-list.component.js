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
}));

const AddCats = ({ username, open, setOpen, forceReload, setForceReload }) => {
  const [paymentList, setPaymentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [mainSelect, setSelect] = useState("");
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");

  const classes = useStyles();

  function addMainCat(type) {
    let route;
    const user = {
      username: username,
      category: mainText,
    };
    if (type === "payment") {
      route = "https://sheltered-escarpment-85529.herokuapp.com/users/addPayment";
    } else if (type === "category") {
      route = "https://sheltered-escarpment-85529.herokuapp.com/users/addCategory";
    }
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
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

  function addSubCat(type) {
    let route;
    const user = {
      username: username,
      category: mainSelect,
      subCategory: subText,
    };
    if (type === "payment") {
      route = "https://sheltered-escarpment-85529.herokuapp.com/users/addSubPayment";
    } else if (type === "category") {
      route = "https://sheltered-escarpment-85529.herokuapp.com/users/addSubCategory";
    }
    Axios.post(route, user, { withCredentials: true })
      .then((res) => {
        console.log(res);
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
    if (categoryList.length === 0) {
      getLists(username, setCategoryList, setPaymentList);
    }
    //formCheck();
  }, []);

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
        <form onSubmit={addMainCat("payment")}>
        <TextField
          required
          id="standard-basic"
          label="New Account Type"
          onChange={(e) => {
            setMainText(e.target.value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
        >
          New Account Type
        </Button>
        </form>
        <TextField
          id="standard-basic"
          label="New Main Category"
          onChange={(e) => {
            setMainText(e.target.value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={()=>addMainCat("category")}
        >
          New Category
        </Button>
        <br></br>
        <br></br>
        <Divider />
        <FormControl>
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
          label="Subcategory"
          onChange={(e) => {
            setSubText(e.target.value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={()=>addSubCat("category")}
        >
          New Subcategory
        </Button>
        <br></br>
        <FormControl>
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
          onChange={(e) => {
            setSubText(e.target.value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={()=>addSubCat("payment")}
        >
          New Account
        </Button>
      </div>
    </Modal>
  );
};

export default AddCats;
