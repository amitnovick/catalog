import React from 'react';
import { useService } from '@xstate/react';
import PropTypes from 'prop-types';

import ReactContext from '../ReactContext';
import AdditionModalContent from '../components/AdditionModalContent';

const AdditionModalContentContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { inputText, errorMessage } = current.context;

  return <AdditionModalContent {...props} inputText={inputText} errorMessage={errorMessage} />;
};

AdditionModalContentContainer.propTypes = {
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  onHitEnterKey: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
};

export default AdditionModalContentContainer;
