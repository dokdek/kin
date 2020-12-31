import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import checkAuth from "./helpers/checkAuth";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

function dateParser(date){
  let newDate = new Date(date);
  return (newDate.getMonth()+1) + "/" + newDate.getDate() + "/" + newDate.getFullYear();
}

const TransactionList = ({ filterValue, forceReload }) => {
  const classes = useStyles();

  const [transaction, setTransaction] = useState([]);
  const [auth, setAuth] = useState(null);

  //Need to change widths
  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "account", headerName: "Account", width: 130 },
  ];

  useEffect(() => {
    let isMounted = true;
    checkAuth()
      .then((res) => {
        if (isMounted) {
          setAuth(res.auth);
          const user = {
            username: res.username.username,
            filter: filterValue,
          };
          Axios.post("http://localhost:5000/transactions", user, {
            withCredentials: true,
          })
            .then((res) => {
              console.log("fetching transactions");
              setTransaction([]); //clear current trans if leftover from state.
              res.data.map((trans, index) => {
                //maybe try setTrans (res.data.map(trans......)) since map returns an array anyways...
                let newDate = dateParser(trans.date);
                const modifiedTrans = {
                  id: index,
                  description: trans.description,
                  amount: trans.amount,
                  date: newDate, //Format date after
                  category: trans.subCategory,
                  account: trans.subPayment,
                };
                setTransaction((transaction) => [
                  ...transaction,
                  modifiedTrans,
                ]);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
        isMounted = false;
      });
    return () => {
      isMounted = false;
    };
  }, [forceReload]);

  if (auth === true) {
    return (
      <div
        style={{ height: window.innerHeight - 64, width: window.innerWidth }}
      >
        {" "}
        {/*64 is height of toolbar, is fixed */}
        <div className={classes.toolbar} />
        <DataGrid rows={transaction} columns={columns} checkboxSelection />
      </div>
    );
  } else if(auth === false){
    return <Redirect to="/login" />;
  }else{
    return null
  }
};
export default TransactionList;
