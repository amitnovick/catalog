import React from 'react';
import { useService } from '@xstate/react';
import PropTypes from 'prop-types';

import ReactContext from '../ReactContext';
import AdditionModalContent from '../components/AdditionModalContent';

const RenameModalContentContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { inputText, errorMessage } = current.context;

  return <AdditionModalContent {...props} inputText={inputText} errorMessage={errorMessage} />;
};

AdditionModalContent.propTypes = {
  shouldShowErrorMessage: PropTypes.bool.isRequired,
};

export default RenameModalContentContainer;
