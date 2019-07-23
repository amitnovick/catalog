import React from 'react';

import CategoriesPanel from './containers/CategoriesPanel/CategoriesPanel';
import FilesPanel from './containers/FilesPanel/FilesPanel';

const ControlPanelScreen = () => {
  return (
    <>
      <FilesPanel />
      <hr />
      <CategoriesPanel />
    </>
  );
};

export default ControlPanelScreen;
