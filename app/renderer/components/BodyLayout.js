import React from 'react';
import { Grid } from 'semantic-ui-react';

const BodyLayout = ({ children: Children, ...rest }) => {
  return (
    <Grid style={{ height: '100%', marginTop: 0, marginBottom: '1rem' }}>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }} />
      <Grid.Column width="10" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Children {...rest} />
      </Grid.Column>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }} />
    </Grid>
  );
};

export default BodyLayout;
