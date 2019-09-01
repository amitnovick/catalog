import React from 'react';
import PropTypes from 'prop-types';
import { Label, Header, Icon } from 'semantic-ui-react';
import CategoryIcon from '../../../components/CategoryIcon';
import { css } from 'emotion';

const FONT_SIZE = '1.71428571rem';

const headerDivClass = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const Categories = ({ categories, onClickRemoveCategory, onClickRightArowCategory }) => {
  return (
    <>
      <div className={headerDivClass}>
        <CategoryIcon style={{ marginRight: '0.5em', height: 32, width: 32 }} />
        <Header a="h2" style={{ display: 'inline-block', fontSize: FONT_SIZE, marginTop: 0 }}>
          Associated Categories
        </Header>
      </div>
      <Label.Group color="blue" size="big">
        {categories.map((category) => (
          <Label key={category.id}>
            <Icon
              title="Dissociate category"
              name="remove"
              style={{ cursor: 'pointer' }}
              onClick={() => onClickRemoveCategory(category)}
            />
            {category.name}
            <Icon
              title="Navigate to category"
              style={{ cursor: 'pointer', marginLeft: '0.75em', marginRight: 0 }}
              name="arrow right"
              onClick={() => onClickRightArowCategory(category)}
            />
          </Label>
        ))}
      </Label.Group>
    </>
  );
};

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickRemoveCategory: PropTypes.func.isRequired,
  onClickRightArowCategory: PropTypes.func.isRequired,
};

export default Categories;
