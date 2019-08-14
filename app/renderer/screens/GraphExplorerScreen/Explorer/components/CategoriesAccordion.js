import React from 'react';
import PropTypes from 'prop-types';
import { Message, List, Button } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import CategoryListItem from './CategoryListItem';

const CategoriesAccordion = ({
  categories,
  onClickRenameButton,
  onClickMoveToButton,
  onClickDeleteButton,
  onClickAddCategoryButton,
}) => {
  return (
    <AccordionWrapper
      title="Categories"
      shouldDefaultToActive={true}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big">
          {categories.map((childCategory) => (
            <CategoryListItem
              category={childCategory}
              key={childCategory.id}
              onClickRenameButton={onClickRenameButton}
              onClickMoveToButton={onClickMoveToButton}
              onClickDeleteButton={onClickDeleteButton}
            />
          ))}
          {categories.length === 0 ? (
            <Message info>
              <Message.Header>No Categories</Message.Header>
            </Message>
          ) : null}
        </List>
      )}
      Controls={() => (
        <Button
          icon="add"
          title="Add category"
          size="large"
          onClick={() => onClickAddCategoryButton()}
        />
      )}
    />
  );
};

CategoriesAccordion.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onClickMoveToButton: PropTypes.func.isRequired,
  onClickDeleteButton: PropTypes.func.isRequired,
  onClickAddCategoryButton: PropTypes.func.isRequired,
};

export default CategoriesAccordion;
