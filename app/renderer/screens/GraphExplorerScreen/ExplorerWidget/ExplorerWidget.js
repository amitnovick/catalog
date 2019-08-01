import React from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordion from './components/CategoriesAccordion';
import FilesAccordion from './components/FilesAccordion';

const ExplorerWidget = ({
  categories,
  files,
  categoriesInPath,
  onClickRenameButton,
  onClickDeleteButton,
  onClickAddCategoryButton,
}) => {
  return (
    <>
      <PathCategoriesMenu categoriesInPath={categoriesInPath} />
      <List celled>
        <List.Item>
          <CategoriesAccordion
            onClickAddCategoryButton={onClickAddCategoryButton}
            onClickDeleteButton={onClickDeleteButton}
            categories={categories}
            onClickRenameButton={onClickRenameButton}
          />
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
  onClickDeleteButton: PropTypes.func.isRequired,
  onClickAddCategoryButton: PropTypes.func.isRequired,
};

export default ExplorerWidget;
