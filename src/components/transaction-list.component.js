import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import checkAuth from "./helpers/checkAuth";
import { Button, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

function dateParser(date) {
  let newDate = new Date(date);
  return (
    newDate.getMonth() +
    1 +
    "/" +
    newDate.getDate() +
    "/" +
    newDate.getFullYear()
  );
}

const TransactionList = ({ filterValue, forceReload, selectedDate, setForceReload }) => {
  const classes = useStyles();

  const [transaction, setTransaction] = useState([]);
  const [auth, setAuth] = useState(null);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [selectedValue, setSelectedValue] = useState({})


  function deleteTransaction (){
    Axios.post("https://sheltered-escarpment-85529.herokuapp.com/transactions/delete", selectedValue, {withCredentials: true})
      .then(()=>{
        console.log("removed");
        setForceReload(!forceReload);
        })
      .catch((err)=> console.log(err));
  }


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
          Axios.post("https://sheltered-escarpment-85529.herokuapp.com/transactions", user, {
            withCredentials: true,
          })
            .then((res) => {
              console.log("fetching transactions");
              setTransaction([]); //clear current trans if leftover from state.
              res.data.map((trans, index) => {
                //maybe try setTrans (res.data.map(trans......)) since map returns an array anyways...
                if (
                  selectedDate.getMonth() == new Date(trans.date).getMonth() &&
                  selectedDate.getFullYear() ==
                    new Date(trans.date).getFullYear()
                ) {
                  let newDate = dateParser(trans.date);
                  const modifiedTrans = {
                    id: index,
                    username: user.username,
                    description: trans.description,
                    amount: "$" + -trans.amount,
                    date: newDate, //Format date after
                    category: trans.subCategory,
                    account: trans.subPayment,
                  };
                  setTransaction((transaction) => [
                    ...transaction,
                    modifiedTrans,
                  ]);
                }
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
  }, [forceReload, selectedDate, filterValue]);

  if (auth === true) {
    return (
      <div
        style={{ height: window.innerHeight - 64, width: "100%" }}
      >
        {" "}
        {/*64 is height of toolbar, is fixed */}
        <div className={classes.toolbar} />
        <Button disabled={deleteDisabled}variant="contained" color="primary" style={{margin: '5px'}} onClick={()=>deleteTransaction()}>Delete</Button>
        <DataGrid rows={transaction} columns={columns} checkboxSelection onSelectionChange={(e)=> {
          setSelectedValue(e);
          if(e.rows.length > 0){
            console.log("enabling button");
            setDeleteDisabled(false);
          }else{
            setDeleteDisabled(true);
          }
          console.log(selectedValue)}}/>
      </div>
    );
  } else if (auth === false) {
    return <Redirect to="/login" />;
  } else {
    return null;
  }
};
export default TransactionList;
