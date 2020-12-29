

import {MenuItem, ListSubheader} from '@material-ui/core'
import React from 'react';

export default function renderCategorySelectGroup(item, Main, Sub) {
    const items = item.subCategories.map((value, index) => {
      return (
        <Sub key={index} value={value}>
          {value}
        </Sub>
      );
    });
    return [<Main>{item.category.name}</Main>, items];
  }