import React from 'react';
import PropTypes from 'prop-types';
import { Message, List } from 'semantic-ui-react';
import { faEdit, faPlus, faArrowCircleRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AccordionWrapper from './AccordionWrapper';
import CategoryListItem from './CategoryListItem';

const CategoryActionIcon = ({ icon, onClick, isDisabled, title }) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      style={{
        cursor: 'pointer',
        color: 'black',
        opacity: isDisabled ? 0.2 : 1,
        width: 32,
        height: 32,
        marginLeft: '1em',
      }}
      onClick={() => onClick()}
      title={title}
    />
  );
};

const CategoriesAccordion = ({
  categories,
  onClickAddCategoryButton,
  onClickRenameButton,
  onClickMoveToButton,
  onClickDeleteButton,
  onClickRow,
  selectedCategoryRow,
  hasSelectedRow,
}) => {
  const isRenameButtonDisabled = hasSelectedRow === false;
  const isMoveToButtonDisabled = hasSelectedRow === false;
  const isDeleteButtonDisabled = hasSelectedRow === false;

  return (
    <AccordionWrapper
      title="Categories"
      shouldDefaultToActive={true}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big" style={{ padding: categories.length === 0 ? '0.5em' : 0 }}>
          {categories.length > 0 ? (
            categories.map((childCategory) => (
              <CategoryListItem
                category={childCategory}
                isSelected={
                  hasSelectedRow &&
                  selectedCategoryRow !== null &&
                  selectedCategoryRow.id === childCategory.id
                }
                key={childCategory.id}
                onClickRow={onClickRow}
              />
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
      Controls={() => (
        <div>
          <CategoryActionIcon
            icon={faPlus}
            onClick={onClickAddCategoryButton}
            isDisabled={false}
            title="Add category"
          />
          <CategoryActionIcon
            icon={faEdit}
            onClick={onClickRenameButton}
            isDisabled={isRenameButtonDisabled}
            title="Rename category"
          />
          <CategoryActionIcon
            icon={faArrowCircleRight}
            onClick={onClickMoveToButton}
            isDisabled={isMoveToButtonDisabled}
            title="Move to"
          />
          <CategoryActionIcon
            icon={faTrash}
            onClick={onClickDeleteButton}
            isDisabled={isDeleteButtonDisabled}
            tititle="Delete category"
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
  hasSelectedRow: PropTypes.bool.isRequired,
};

export default CategoriesAccordion;
