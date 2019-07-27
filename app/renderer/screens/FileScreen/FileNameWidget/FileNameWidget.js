import React from 'react';
import PropTypes from 'prop-types';

import { Header } from 'semantic-ui-react';

const FileNameWidget = ({ file }) => {
  return (
    <>
      <Header as="h1">File Screen</Header>
      <Header as="h2">{file.name}</Header>
    </>
  );
};

FileNameWidget.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FileNameWidget;
