import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

const buttonClass = css`
  margin: 5px;
  cursor: pointer;
  background-color: white;
  font-weight: bold;
  font-size: 2em;
  padding: 5px;
  border: 2px solid black;
`;

const formClass = css`
  margin: 5px;
  font-size: 2em;
`;

const CreateSubcategoryRelationship = ({
  onClickCreateRelationship,
  parentCategoryName,
  childCategoryName,
  onChangeParentCategoryName,
  onChangeChildCategoryName
}) => {
  return (
    <div>
      <label htmlFor="parent-category-relationship-input" className={formClass}>
        Parent category:
      </label>
      <input
        id="parent-category-relationship-input"
        className={formClass}
        value={parentCategoryName}
        onChange={event => onChangeParentCategoryName(event.target.value)}
      />
      <br />
      <label htmlFor="child-category-relationship-input" className={formClass}>
        Child category:
      </label>
      <input
        id="child-category-relationship-input"
        className={formClass}
        value={childCategoryName}
        onChange={event => onChangeChildCategoryName(event.target.value)}
      />
      <br />

      <button
        className={buttonClass}
        onClick={() =>
          onClickCreateRelationship(parentCategoryName, childCategoryName)
        }
      >
        Create relationship!
      </button>
    </div>
  );
};

CreateSubcategoryRelationship.propTypes = {
  onClickCreateRelationship: PropTypes.func.isRequired,
  parentCategoryName: PropTypes.string.isRequired,
  childCategoryName: PropTypes.string.isRequired,
  onChangeParentCategoryName: PropTypes.func.isRequired,
  onChangeChildCategoryName: PropTypes.func.isRequired
};

export default CreateSubcategoryRelationship;
