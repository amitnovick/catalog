import React from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordion from './components/CategoriesAccordion';
import FilesAccordion from './components/FilesAccordion';

const Explorer = ({
  categories,
  files,
  categoriesInPath,
  onClickRenameButton,
  onClickMoveToButton,
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
            onClickMoveToButton={onClickMoveToButton}
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

Explorer.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onClickMoveToButton: PropTypes.func.isRequired,
  onClickDeleteButton: PropTypes.func.isRequired,
  onClickAddCategoryButton: PropTypes.func.isRequired,
};

export default Explorer;
