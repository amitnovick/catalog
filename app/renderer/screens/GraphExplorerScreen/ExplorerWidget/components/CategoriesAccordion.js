import React from 'react';
import { Message, List } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import CategoryListItem from './CategoryListItem';

const CategoriesAccordion = ({ categories, onClickRenameButton }) => {
  return (
    <AccordionWrapper
      title="Categories"
      shouldDefaultToActive={true}
      Content={() => (
        <List>
          {categories.map((childCategory) => (
            <CategoryListItem
              category={childCategory}
              key={childCategory.id}
              onClickRenameButton={onClickRenameButton}
            />
          ))}
          {categories.length === 0 ? (
            <Message info>
              <Message.Header>No Categories</Message.Header>
            </Message>
          ) : null}
        </List>
      )}
    />
  );
};

export default CategoriesAccordion;
