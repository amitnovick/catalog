import React from 'react';
import PropTypes from 'prop-types';

import CategoryActionsModal from './Modal/CategoryActionsModal';
import { useMachine } from '@xstate/react';
import Categories from './Categories';
import machine from './machine';
import queryDeleteFileCategory from '../../../db/queries/queryDeleteFileCategory';
import { assign } from 'xstate';

const removeCategoryOfFile = async (category, file) => {
  return await queryDeleteFileCategory(category.id, file.id);
};

const machineWithConfig = machine.withConfig({
  actions: {
    updateCategoryForActionsModal: assign({
      chosenCategoryForActionsModal: (_, event) => event.category,
    }),
  },
  services: {
    removeCategoryOfFile: (context, event) => removeCategoryOfFile(event.category, context.file),
  },
});

const CategoriesWidget = ({ categories, file, refetchData }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      ...machineWithConfig.initialState.context,
      file: file,
      categories: categories,
    }),
    {
      actions: {
        refetchData: (_, __) => refetchData(),
      },
    },
  );

  const openCategoryActionsModal = (category) => {
    send('OPEN_FILE_CATEGORY_ACTIONS_MODAL', { category });
  };

  const { chosenCategoryForActionsModal } = current.context;

  return (
    <>
      <CategoryActionsModal
        category={chosenCategoryForActionsModal}
        isOpen={current.matches('fileCategoryActionsModal')}
        onClose={() => send('CLOSE_FILE_CATEGORY_ACTIONS_MODAL')}
        onClickRemoveCategory={(category) => {
          send('CLICK_REMOVE_CATEGORY_ACTIONS_MODAL', { category: category });
        }}
      />
      <Categories categories={categories} onClickCategory={openCategoryActionsModal} />
    </>
  );
};

CategoriesWidget.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  file: PropTypes.object.isRequired,
  refetchData: PropTypes.func.isRequired,
};

export default CategoriesWidget;
