import React from 'react';
import { Label, Accordion } from 'semantic-ui-react';

const AccordionWrapper = ({ title, Content, shouldDefaultToActive }) => {
  const panels = [
    {
      key: title,
      title: {
        content: <Label size="big">{title}</Label>,
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
