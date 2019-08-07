import React from 'react';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CategoryIcon = (props) => {
  return <FontAwesomeIcon {...props} icon={faSitemap} />;
};

export default CategoryIcon;
