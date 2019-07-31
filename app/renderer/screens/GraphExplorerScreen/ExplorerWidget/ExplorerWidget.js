import React from 'react';
import { Divider, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordion from './components/CategoriesAccordion';
import FilesAccordion from './components/FilesAccordion';

const ExplorerWidget = ({ categories, files, onClickRenameButton, categoriesInPath }) => {
  return (
    <>
      <PathCategoriesMenu categoriesInPath={categoriesInPath} />
      <Divider horizontal />
      <List celled>
        <List.Item>
          <CategoriesAccordion categories={categories} onClickRenameButton={onClickRenameButton} />
        </List.Item>
        <List.Item>
          <FilesAccordion files={files} />
        </List.Item>
      </List>
    </>
  );
};

ExplorerWidget.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
};

export default ExplorerWidget;
