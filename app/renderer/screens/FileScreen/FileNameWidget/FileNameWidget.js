import React from 'react';
import PropTypes from 'prop-types';

import { Header, Label } from 'semantic-ui-react';

const FileNameWidget = ({ file }) => {
  return (
    <>
      <Header as="h1">File Screen</Header>
      <Label size="massive">{file.name}</Label>
    </>
  );
};

FileNameWidget.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FileNameWidget;
