import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import routes from '../../../routes';
import { List, Icon, Message } from 'semantic-ui-react';

const SearchResultsList = ({ files }) => {
  return (
    <List size="big">
      {files.length > 0 ? (
        files.map((file) => (
          <li key={file.id} style={{ marginTop: 4, marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-block', width: '100%' }}>
                <Icon name="file" color="yellow" size="big" />
                <Link
                  title="Open in file screen"
                  to={`${routes.FILE}/${file.id}`}
                  style={{ display: 'inline-block' }}>
                  {file.name}
                </Link>
              </div>
            </div>
          </li>
        ))
      ) : (
        <List.Item>
          <Message info>
            <Message.Header>No Results</Message.Header>
          </Message>
        </List.Item>
      )}
    </List>
  );
};

SearchResultsList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default SearchResultsList;
