import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { Redirect } from "react-router-dom";

const TransactionList = ({ isAuth, username, filter}) => {
  const [transaction, setTransaction] = useState([]);

  //Need to change widths
  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "category", headerName:"Category", width: 130},
    { field: "account", headerName: "Account", width: 130}
  ];

  const tempRow = [{ id: 1, description: "" }];

  useEffect(() => {
    if (isAuth == true) {
      Axios.post("http://localhost:5000/transactions",{username: username},{withCredentials: true})
        .then((res) => {
          res.data.map((trans, index) => {
            const modifiedTrans = {
              id: index,
              description: trans.description,
              amount: trans.amount,
              date: trans.date,//.substring(0, 10), temp, date is not date obj in db add substring back when proper date is used.
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
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={transaction} columns={columns} checkboxSelection />
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};
export default TransactionList;
