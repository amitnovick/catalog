import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';
import { css } from 'emotion';

const segmentClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BodyLayout = ({ children }) => {
  return (
    <Grid style={{ height: '100%', marginTop: 0, marginBottom: '1rem' }}>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }} />
      <Grid.Column width="10" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Segment className={segmentClass}>{children}</Segment>
      </Grid.Column>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }} />
    </Grid>
  );
};

BodyLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BodyLayout;
