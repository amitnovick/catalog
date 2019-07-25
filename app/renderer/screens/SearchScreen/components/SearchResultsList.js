import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import routes from '../../../routes';
import { List, Icon, Button } from 'semantic-ui-react';

const threeDotsCss = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const SearchResultsList = ({ files }) => {
  return (
    <List>
      {files.map((file) => (
        <List.Item key={file.name}>
          <div style={threeDotsCss}>
            <Button as={Link} size="big" color="yellow" to={`${routes.FILE}/${file.id}`}>
              <Icon name="sign-in alternate" /> {`${file.name}`}
            </Button>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

SearchResultsList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default SearchResultsList;
