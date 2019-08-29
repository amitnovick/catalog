import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';
import { css } from 'emotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

const segmentClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FileScreenBodyLayout = ({ children, history }) => {
  return (
    <Grid style={{ height: '100%', marginTop: 0, marginBottom: '1rem' }}>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <FontAwesomeIcon
          icon={faArrowAltCircleLeft}
          style={{
            marginLeft: '1em',
            width: 48,
            height: 48,
            cursor: 'pointer',
          }}
          onClick={() => history.goBack()}
        />
      </Grid.Column>
      <Grid.Column width="10" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Segment className={segmentClass}>{children}</Segment>
      </Grid.Column>
      <Grid.Column width="3" style={{ paddingTop: 0, paddingBottom: 0 }} />
    </Grid>
  );
};

FileScreenBodyLayout.propTypes = {
  children: PropTypes.element.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(FileScreenBodyLayout);
