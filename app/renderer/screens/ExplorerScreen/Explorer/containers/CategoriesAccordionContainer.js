import React from 'react';
import { useService } from '@xstate/react';
import ReactContext from '../../ReactContext';
import CategoriesAccordion from '../components/CategoriesAccordion';

const CategoriesAccordionContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const { childCategories, selectedCategoryRow, categoriesListRef } = current.context;

  const hasSelectedRow = current.matches('categoryRowSelection.selectedRow');

  return (
    <CategoriesAccordion
      listRef={categoriesListRef}
      categories={childCategories}
      selectedCategoryRow={selectedCategoryRow}
      onClickAddCategoryButton={() => send('CLICK_ADD_CATEGORY_BUTTON')}
      onClickRow={(category) => send('SELECTED_CATEGORY_ROW', { category })}
      onClickRenameButton={() =>
        send('CLICK_CATEGORY_RENAME_BUTTON', {
          category: selectedCategoryRow,
        })
      }
      onClickMoveToButton={() =>
        send('CLICK_CATEGORY_MOVE_TO__BUTTON', { category: selectedCategoryRow })
      }
      onClickDeleteButton={() =>
        send('CLICK_CATEGORY_DELETE_BUTTON', { category: selectedCategoryRow })
      }
      hasSelectedRow={hasSelectedRow}
    />
  );
};

export default CategoriesAccordionContainer;
