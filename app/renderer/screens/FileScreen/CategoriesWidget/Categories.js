import React from 'react';
import PropTypes from 'prop-types';
import { Label, Header, Icon } from 'semantic-ui-react';
import CategoryIcon from '../../../components/CategoryIcon';

const Categories = ({ categories, onClickRemoveCategory, onClickRightArowCategory }) => {
  return (
    <>
      <Header as="h2">
        <CategoryIcon style={{ marginRight: '0.5em' }} />
        <Header.Content>Associated Categories</Header.Content>
      </Header>
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
