import React from 'react';
import AccordionWrapper from './AccordionWrapper';
import { List, Message } from 'semantic-ui-react';
import CategoryListItem from '../CategoryListItem/CategoryListItem';

const CategoriesAccordion = ({ categories }) => {
  return (
    <AccordionWrapper
      title="Categories"
      shouldDefaultToActive={true}
      Content={() => (
        <List divided selection verticalAlign="middle">
          {categories.length > 0 ? (
            categories.map((childCategory) => (
              <CategoryListItem category={childCategory} key={childCategory.id} />
            ))
          ) : (
            <List.Item>
              <Message info>
                <Message.Header>No Categories</Message.Header>
              </Message>
            </List.Item>
          )}
        </List>
      )}
    />
  );
};

export default CategoriesAccordion;
