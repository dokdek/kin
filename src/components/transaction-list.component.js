import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';

const TransactionList = () => {
    const [transaction, setTransaction] = useState([]);

    const columns = [
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'description', headerName: 'Description', width: 130 },
        { field: 'amount', headerName: 'Amount', width: 130 },
    ];

const tempRow = [
    { id: 1, description: ''}
  ];

    useEffect(() => {
        Axios.get("http://localhost:5000/transactions")
        .then(res => {
            res.data.map(trans => {
                const modifiedTrans = 
                {
                    id: trans._id,
                    description: trans.description,
                    amount: trans.amount,
                    date: trans.date.substring(0,10)
                };
                setTransaction(transaction => [...transaction, modifiedTrans]);
                console.log(transaction);
            });
        })
        .catch((err) => {
            console.log(err);
        })
    },[]);

    return(
    <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={transaction} columns={columns} checkboxSelection />
    </div>
    );
}
export default TransactionList;