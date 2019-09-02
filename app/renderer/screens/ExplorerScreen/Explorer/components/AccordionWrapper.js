import React from 'react';
import { Accordion, Header } from 'semantic-ui-react';
import { css } from 'emotion';

const accordionClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AccordionWrapper = ({ title, Content, shouldDefaultToActive, Controls, ...props }) => {
  return (
    <Accordion
      className={accordionClass}
      {...props}
      // defaultActiveIndex={shouldDefaultToActive === true ? 0 : undefined}
    >
      <Accordion.Title active={true} index={0}>
        {/* <Icon name="dropdown" /> */}
        <div style={{ display: 'inline-flex', justifyContent: 'space-between', width: '100%' }}>
          <Header as="h4" style={{ margin: 'auto 0' }}>
            {title}
          </Header>
          {Controls !== undefined ? <Controls /> : null}
        </div>
      </Accordion.Title>
      <Accordion.Content
        active={true}
        style={{
          height: '100%',
          border: '1px solid grey',
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        {Content}
      </Accordion.Content>
    </Accordion>
  );
};

export default AccordionWrapper;
