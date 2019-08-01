import React from 'react';
import { Accordion, Header } from 'semantic-ui-react';

const AccordionWrapper = ({ title, Content, shouldDefaultToActive, Controls }) => {
  const panels = [
    {
      key: title,
      title: {
        content: (
          <div style={{ display: 'inline-flex', justifyContent: 'space-between', width: '95%' }}>
            <Header as="h4" style={{ margin: 'auto 0' }}>
              {title}
            </Header>
            {Controls !== undefined ? <Controls /> : null}
          </div>
        ),
      },
      content: {
        content: <Content />,
      },
    },
  ];

  return (
    <Accordion
      defaultActiveIndex={shouldDefaultToActive === true ? 0 : undefined}
      panels={panels}
    />
  );
};

export default AccordionWrapper;
