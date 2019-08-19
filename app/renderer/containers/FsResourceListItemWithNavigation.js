import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import routes from '../routes';
import FsResourceListItem from '../components/FsResourceListItem';
import fsResourceTypes from '../fsResourceTypes';

const FsResourceListItemWithHistory = ({ fsResource, history, ...props }) => {
  return (
    <FsResourceListItem
      {...props}
      fsResource={fsResource}
      onDoubleClickRow={() => history.push(`${routes.FILE}/${fsResource.id}`)}
    />
  );
};

const FsResourcesListItemWithNavigation = withRouter(FsResourceListItemWithHistory);

FsResourcesListItemWithNavigation.propTypes = {
  fsResource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
};

export default FsResourcesListItemWithNavigation;
