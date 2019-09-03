import React from 'react';
import { Header } from 'semantic-ui-react';
import { css } from 'emotion';
import { BAR_ABOVE_LIST_HEIGHT } from './layoutConstants';

const accordionClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const barAboveListClass = css`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${BAR_ABOVE_LIST_HEIGHT}px;
`;

const listContainerClass = css`
  height: 100%;
  border: 1px solid grey;
  padding-top: 0px;
  padding-bottom: 0px;
`;

const AccordionWrapper = ({ title, Content, Controls, contentStyle = {} }) => {
  return (
    <div className={accordionClass}>
      <div className={barAboveListClass}>
        <Header as="h4" style={{ margin: 'auto 0' }}>
          {title}
        </Header>
        {Controls !== undefined ? <Controls /> : null}
      </div>
      <div className={listContainerClass} style={contentStyle}>
        {Content}
      </div>
    </div>
  );
};

export default AccordionWrapper;
