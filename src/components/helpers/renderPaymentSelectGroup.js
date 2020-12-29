import {MenuItem, ListSubheader} from '@material-ui/core'
import React from 'react';


export default function renderPaymentSelectGroup(item, Main, Sub) {
    const items = item.subPayments.map((value, index) => {
      return (
        <Sub key={index} value={value}>
          {value}
        </Sub>
      );
    });
    return [<Main>{item.payment}</Main>, items];
  }