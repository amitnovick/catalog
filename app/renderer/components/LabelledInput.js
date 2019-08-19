import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'semantic-ui-react';

const LabelledInput = ({ inputText, onChangeSearchText, onHitEnterKey }) => {
  return (
    <Form>
      <Form.Field width="6">
        <label style={{ fontSize: '1.5em' }}>File / directory name</label>
        <Input
          autoFocus
          type="text"
          size="big"
          value={inputText}
          onKeyDown={({ key }) =>
            key === 'Enter' && onHitEnterKey !== undefined ? onHitEnterKey() : undefined
          }
          onChange={({ target }) => onChangeSearchText(target.value)}
        />
      </Form.Field>
    </Form>
  );
};

LabelledInput.propTypes = {
  inputText: PropTypes.string.isRequired,
  onChangeSearchText: PropTypes.func.isRequired,
  onHitEnterKey: PropTypes.func,
};

export default LabelledInput;
