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
import NumberFormat from "react-number-format";


//NEED TO ADD DATE SORTING/FILTER

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  tableCell: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'LightGray',
  }
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

const CategoryList = ({ selectedDate, forceReload }) => {
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
      date: selectedDate,
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
      console.log(selectedDate);
      const budgetedDateIndex = value.budgeted.findIndex((budget) => {
        return (
          new Date(budget.date).getMonth() == selectedDate.getMonth() &&
          new Date(budget.date).getFullYear() == selectedDate.getFullYear()
        );
      });
      const actualDateIndex = value.actual.findIndex((actual) => {
        return (
          new Date(actual.date).getMonth() == selectedDate.getMonth() &&
          new Date(actual.date).getFullYear() == selectedDate.getFullYear()
        );
      });
      let budgetedExists = 0;
      let actualExists = 0;
      if (budgetedDateIndex != -1) {
        budgetedExists = null;
      }
      if (actualDateIndex != -1) {
        actualExists = null;
      }
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
          <TableCell>{value.name}</TableCell>
          <TableCell>
            <TextField
              defaultValue={
                budgetedExists ?? value.budgeted[budgetedDateIndex].amount
              }
              onChange={(e) =>
                updateCategory(item.category, value.name, e.target.value)
              }
              onBlur={() => budgetedOnBlur()}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </TableCell>
          <TableCell>
            {"$" + (actualExists ?? value.actual[actualDateIndex].amount)}
          </TableCell>
          <TableCell>
            {"$" + ((budgetedExists ??
              categoryList[catIndex].subCategories[index].budgeted[
                budgetedDateIndex
              ].amount) -
              (actualExists ?? value.actual[actualDateIndex].amount))}
          </TableCell>
        </TableRow>
      );
    });
    return [
      <TableRow key={item.category}>
        <TableCell className={classes.tableCell}>{item.category}</TableCell>
        <TableCell className={classes.tableCell}></TableCell>
        <TableCell className={classes.tableCell}></TableCell>
        <TableCell className={classes.tableCell}></TableCell>
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
  }, [auth, forceReload]);

  if (auth === true) {
    return (
        <Paper className={classes.root}>
          <div className={classes.toolbar} />
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
    );
  } else if (auth === false) {
    return <Redirect to="/" />;
  } else {
    return null;
  }
};
export default CategoryList;
