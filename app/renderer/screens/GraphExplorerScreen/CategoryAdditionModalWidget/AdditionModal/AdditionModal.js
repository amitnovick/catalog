import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import RenameModalHeaderContainer from "../containers/AdditionModalHeaderContainer.";
import RenameModalActions from "./AdditionModalActions";
import RenameModalContentContainer from "../containers/AdditionModalContentContainer";

const AdditionModal = ({
  onClickRenameButton,
  onClose,
  onChangeInputText,
  shouldShowErrorMessage
}) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<RenameModalHeaderContainer />}
      ModalContent={
        <RenameModalContentContainer
          onChangeInputText={onChangeInputText}
          shouldShowErrorMessage={shouldShowErrorMessage}
        />
      }
      ModalActions={
        <RenameModalActions
          onClickCancelButton={onClose}
          onClickRenameButton={onClickRenameButton}
        />
      }
    />
  );
};

AdditionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired
};

export default AdditionModal;
