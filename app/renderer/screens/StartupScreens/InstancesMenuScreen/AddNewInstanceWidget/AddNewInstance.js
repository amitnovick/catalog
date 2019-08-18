import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label } from 'semantic-ui-react';
import DirectoryPicker from '../../../../components/DirectoryPicker';

const AddNewInstance = ({ onInput, onSubmit, inputPath }) => {
  const isDisabled = inputPath === '';
  return (
    <div style={{ textAlign: 'center' }}>
      <DirectoryPicker onInput={onInput}>
        {(datePickerElementId) => (
          <>
            {isDisabled ? null : (
              <Label
                as="label"
                size="massive"
                htmlFor={datePickerElementId}>{`Chosen: ${inputPath}`}</Label>
            )}
            <Button as="label" size="massive" htmlFor={datePickerElementId}>
              {isDisabled ? 'Choose location for new instance' : 'Change location'}
            </Button>
          </>
        )}
      </DirectoryPicker>
      <br />
      {isDisabled ? null : (
        <Button positive size="massive" onClick={() => onSubmit(inputPath)}>
          Save
        </Button>
      )}
    </div>
  );
};

AddNewInstance.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  inputPath: PropTypes.string.isRequired,
};

export default AddNewInstance;
