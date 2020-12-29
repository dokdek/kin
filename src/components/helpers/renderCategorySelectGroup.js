

import React from 'react';

export default function renderCategorySelectGroup(item, Main, Sub) {
    const items = item.subCategories.map((value, index) => {
      return (
        <Sub key={index} value={value.name}>
          {value.name}
        </Sub>
      );
    });
    return [<Main>{item.category}</Main>, items];
  }