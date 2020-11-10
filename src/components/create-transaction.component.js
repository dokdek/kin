import React, { useState } from "react";
import { makeStyles, TextField, Button} from "@material-ui/core";
import Axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  FormStyle: {
    marginLeft: "10%",
  },
}));

const CreateTransaction = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  //const [category, setCategory] = newState([]);
  const category = ["memes", "mcdondalds"];


function onSubmit(e) {
    e.preventDefault();

    const transaction = {
      description: name,
      amount: amount,
      date: date
    }
    Axios.post("http://localhost:5000/transactions/add", transaction)
    .then(res => console.log(res.data))
    .catch(res => console.log(res))
    console.log(transaction);
  }
    
  // const classes = useStyles();
  return (
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField id="standard-basic" label="Name" onChange={e => {
        console.log(e.target.value)
        setName(e.target.value)}}/>
      <TextField id="filled-basic" label="Amount" onChange={e => {setAmount(e.target.value)}}/>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        variant="inline"
        label="Date: "
        value={date}
        onChange={e => setDate(date)}
      />
      </MuiPickersUtilsProvider>
      <Autocomplete id="category-select" style={{ width: 200 }} options={category} renderInput={(params) => <TextField {...params} label="Category" variant="outlined"/>}/>
      <Button color='primary' variant='contained' type='submit'>Add</Button>
    </form>
  );
}

export default CreateTransaction;
