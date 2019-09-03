import React from 'react';
import PropTypes from 'prop-types';

import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordionContainer from './containers/CategoriesAccordionContainer';
import FsResourcesAccordionContainer from './containers/FsResourcesAccordionContainer';
import { css } from 'emotion';

const divClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 0px !important;
`;

const pathCategoriesContainerClass = css`
  padding-bottom: 0.8em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Explorer = ({ categoriesInPath }) => {
  return (
    <>
      <div className={pathCategoriesContainerClass}>
        <PathCategoriesMenu categoriesInPath={categoriesInPath} />
      </div>
      <div className={divClass}>
        <div style={{ height: '50%' }}>
          <CategoriesAccordionContainer />
        </div>
        <div style={{ height: '50%' }}>
          <FsResourcesAccordionContainer />
        </div>
      </div>
    </>
  );
};

Explorer.propTypes = {
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default Explorer;
