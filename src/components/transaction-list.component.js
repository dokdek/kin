import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { Redirect } from "react-router-dom";

const TransactionList = ({ isAuth }) => {
  const [transaction, setTransaction] = useState([]);

  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
  ];

  const tempRow = [{ id: 1, description: "" }];

  useEffect(() => {
    if (isAuth == true) {
      Axios.get("http://localhost:5000/transactions",{withCredentials: true})
        .then((res) => {
          res.data.map((trans) => {
            const modifiedTrans = {
              id: trans._id,
              description: trans.description,
              amount: trans.amount,
              date: trans.date.substring(0, 10),
            };
            setTransaction((transaction) => [...transaction, modifiedTrans]);
            console.log(transaction);
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
