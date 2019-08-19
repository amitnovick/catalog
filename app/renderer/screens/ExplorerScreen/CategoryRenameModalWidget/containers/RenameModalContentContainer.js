import React from 'react';
import { useService } from '@xstate/react';
import PropTypes from 'prop-types';

import ReactContext from '../ReactContext';
import RenameModalContent from '../components/RenameModalContent';

const RenameModalContentContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { inputText, errorMessage } = current.context;

  return <RenameModalContent {...props} inputText={inputText} errorMessage={errorMessage} />;
};

RenameModalContentContainer.propTypes = {
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onHitEnterKey: PropTypes.func.isRequired,
};

export default RenameModalContentContainer;
