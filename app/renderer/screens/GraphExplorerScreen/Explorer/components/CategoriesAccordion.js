import React from 'react';
import PropTypes from 'prop-types';
import { Message, List, Button, Icon } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import CategoryListItem from './CategoryListItem';

const CategoriesAccordion = ({
  categories,
  onClickAddCategoryButton,
  onClickRenameButton,
  onClickMoveToButton,
  onClickDeleteButton,
  onClickRow,
  selectedCategoryRow,
}) => {
  const isRenameButtonDisabled = selectedCategoryRow === null;
  const isMoveToButtonDisabled = selectedCategoryRow === null;
  const isDeleteButtonDisabled = selectedCategoryRow === null;

  return (
    <AccordionWrapper
      title="Categories"
      shouldDefaultToActive={true}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big" style={{ padding: categories.length === 0 ? '0.5em' : 0 }}>
          {categories.map((childCategory) => (
            <CategoryListItem
              category={childCategory}
              isSelected={
                selectedCategoryRow !== null && selectedCategoryRow.id === childCategory.id
              }
              key={childCategory.id}
              onClickRow={onClickRow}
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
        <div>
          <Button
            color="blue"
            title="Add category"
            icon={<Icon name="add" style={{ color: 'white' }} />}
            onClick={() => onClickAddCategoryButton()}
          />
          <Button
            disabled={isRenameButtonDisabled}
            color={isRenameButtonDisabled ? 'grey' : 'yellow'}
            title="Rename category"
            icon={<Icon name="edit" style={{ color: 'white' }} />}
            onClick={() => onClickRenameButton()}
          />
          <Button
            disabled={isMoveToButtonDisabled}
            color={isMoveToButtonDisabled ? 'grey' : 'teal'}
            title="Move to"
            icon={<Icon name="arrow circle right" style={{ color: 'white' }} />}
            onClick={() => onClickMoveToButton()}
          />
          <Button
            disabled={isDeleteButtonDisabled}
            color={isDeleteButtonDisabled ? 'grey' : 'red'}
            title="Delete category"
            icon={<Icon name="trash" style={{ color: 'white' }} />}
            onClick={() => onClickDeleteButton()}
          />
        </div>
      )}
    />
  );
};

CategoriesAccordion.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectedCategoryRow: PropTypes.object,
  onClickAddCategoryButton: PropTypes.func.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onClickMoveToButton: PropTypes.func.isRequired,
  onClickDeleteButton: PropTypes.func.isRequired,
};

export default CategoriesAccordion;
