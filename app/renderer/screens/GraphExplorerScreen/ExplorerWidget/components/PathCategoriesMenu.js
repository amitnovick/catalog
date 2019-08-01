import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../../routes';

const PathCategoriesMenu = ({ categoriesInPath }) => {
  const sections = categoriesInPath.map((categoryInPath, index) => ({
    key: categoryInPath.id,
    content: (
      <Breadcrumb.Section
        active={index === categoriesInPath.length - 1 ? true : undefined}
        key={categoryInPath.id}
        as={index !== categoriesInPath.length - 1 ? Link : undefined}
        to={`${routes.TREE_EXPLORER}/${categoryInPath.id}`}>
        {categoryInPath.name}
      </Breadcrumb.Section>
    ),
  }));
  return <Breadcrumb size="big" icon="right angle" sections={sections} />;
};

export default PathCategoriesMenu;
