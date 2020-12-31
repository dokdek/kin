import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import {
  makeStyles,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TextField,
} from "@material-ui/core";
import checkAuth from "./helpers/checkAuth";

//NEED TO ADD DATE SORTING/FILTER

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
}));


function getCategoryList(username, setCategoryList) {
  const user = { username: username };
  Axios.post("http://localhost:5000/users/getCategory", user, {
    withCredentials: true,
  })
    .then((response) => {
      if (response.data) {
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

const CategoryList = () => {
  const classes = useStyles();

  let tempCat = {}; //used for pushing updated budget to backend.
  const [categoryList, setCategoryList] = useState([]);
  const [auth, setAuth] = useState();
  const [username, setUsername] = useState("");

  function updateCategory(category, subCategory, value) {
    tempCat = {
      username: username,
      category: category,
      subCategory: subCategory,
      amount: value,
    };
  }

  function budgetedOnBlur() {
    if (!(Object.keys(tempCat).length === 0)) {
      Axios.post("http://localhost:5000/users/updateBudgeted", tempCat, {
        withCredentials: true,
      })
        .then(() => {
          console.log("Pushed to backend");
          tempCat = {};
          getCategoryList(username, setCategoryList);
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
    } else {
      console.log("No push needed, no change");
    }
  }

  function renderDashboardTableRow(item, catIndex) {
    const items = item.subCategories.map((value, index) => {
      console.log(catIndex);
      console.log(index);
      let budgetedExists = 0;
      let actualExists = 0;
      if(value.budgeted[0]){
        budgetedExists = null;
      }
      if(value.actual[0]){
        actualExists = null;
      }
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
          <TableCell>{value.name}</TableCell>
          <TableCell>
            <TextField
              defaultValue={budgetedExists ?? value.budgeted[0].amount}
              onChange={(e) =>
                updateCategory(item.category, value.name, e.target.value)
              }
              onBlur={() => budgetedOnBlur()}
            ></TextField>
          </TableCell>
          <TableCell>{actualExists ?? value.actual[0].amount}</TableCell>
          <TableCell>
            {budgetedExists ?? categoryList[catIndex].subCategories[index].budgeted[0].amount - actualExists ??
              value.actual[0].amount}
          </TableCell>
        </TableRow>
      );
    });
    return [
      <TableRow key={item.category}>
        <TableCell>{item.category}</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>,
      items,
    ];
  }

  //Need to change widths?
  const columns = [
    { id: "description", label: "Description", width: 130 },
    { id: "budgeted", label: "Budgeted", width: 130 },
    { id: "activity", label: "Activity", width: 130 },
    { id: "available", label: "Available", width: 130 },
  ];

  useEffect(() => {
    let isMounted = true; //Fixes react warning memory leak
    checkAuth()
      .then((user) => {
        if (isMounted) {
          setUsername(user.username.username);
          setAuth(user.auth);
          console.log(auth);
          console.log(username);
          getCategoryList(username, setCategoryList);
        }
      })
      .catch((err) => {
        console.log(err);
        setAuth(false);
        isMounted = false;
      });
    return () => {
      isMounted = false;
    };
  },[auth]);

  if (auth === true) {
    return (
      <div
        style={{ height: window.innerHeight - 64, width: window.innerWidth }}
      >
        {/*64 is height of toolbar, is fixed */}
        <div className={classes.toolbar} />
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryList.map((cat, index) =>
                  renderDashboardTableRow(cat, index)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  } else if (auth === false) {
    return <Redirect to="/" />;
  } else {
    return null;
  }
};
export default CategoryList;
