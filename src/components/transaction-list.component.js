import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar
}))


const TransactionList = ({ isAuth, username, filterValue}) => {

  const classes = useStyles();

  const [transaction, setTransaction] = useState([]);

  //Need to change widths
  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "category", headerName:"Category", width: 130},
    { field: "account", headerName: "Account", width: 130}
  ];


  useEffect(() => {
    //Extract to external function, duplicated in category list component
    if (isAuth == true) {
      const user = {
        username: username,
        filter: filterValue
      }
      Axios.post("http://localhost:5000/transactions",user,{withCredentials: true})
        .then((res) => {
          res.data.map((trans, index) => { //maybe try setTrans (res.data.map(trans......)) since map returns an array anyways...
            const modifiedTrans = {
              id: index,
              description: trans.description,
              amount: trans.amount,
              date: trans.date, //Format date after
              category: trans.subCategory,
              account: trans.subPayment
            };
            setTransaction((transaction) => [...transaction, modifiedTrans]);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  if (isAuth == true) {
    return (
      <div style={{height: window.innerHeight-64, width: window.innerWidth }}> {/*64 is height of toolbar, is fixed */}
        <div className={classes.toolbar}/>
        <DataGrid rows={transaction} columns={columns} checkboxSelection />
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};
export default TransactionList;
