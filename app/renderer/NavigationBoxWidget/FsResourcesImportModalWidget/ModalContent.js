import React from 'react';
import { Modal as SemanticModal } from 'semantic-ui-react';
import { css } from 'emotion';

const modalContentClass = css`
  height: 50vh;
`;

const ModalContent = ({ children, ...props }) => {
  return (
    <SemanticModal.Content
      {...props}
      className={props.className ? `${props.className} ${modalContentClass}` : modalContentClass}>
      {children}
    </SemanticModal.Content>
  );
};

export default ModalContent;
