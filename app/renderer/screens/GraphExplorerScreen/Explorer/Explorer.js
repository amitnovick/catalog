import React from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordionContainer from './containers/CategoriesAccordionContainer';
import FilesAccordion from './components/FilesAccordion';
import { css } from 'emotion';

const listClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Explorer = ({ files, categoriesInPath }) => {
  return (
    <>
      <PathCategoriesMenu categoriesInPath={categoriesInPath} />
      <List celled className={listClass}>
        <List.Item style={{ height: '50%' }}>
          <CategoriesAccordionContainer />
        </List.Item>
        <List.Item style={{ height: '50%' }}>
          <FilesAccordion files={files} />
        </List.Item>
      </List>
    </>
  );
};

Explorer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default Explorer;
