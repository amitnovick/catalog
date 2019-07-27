import React from 'react';
import CategoryActionsModalContainer from './Modal/CategoryActionsModalContainer';
import { useMachine } from '@xstate/react';
import CategoriesContainer from './CategoriesContainer';
import machine from './machine';
import { RECEIVE_ENTITIES } from '../actionTypes';
import queryDeleteFileCategory from '../../../query-functions/queryDeleteFileCategory';
import store from '../../../redux/store';

const updateCategoryForActionsModal = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      chosenCategoryForActionsModal: category,
    },
  });
};

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const removeCategoryOfFile = async (category) => {
  const file = getFile(store.getState());
  return await queryDeleteFileCategory(category.id, file.id);
};

const getCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.categories : [];

const getChosenCategoryForActionsModal = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.chosenCategoryForActionsModal : null;

const removeCategoryFromState = () => {
  const chosenCategory = getChosenCategoryForActionsModal(store.getState());
  const previousCategories = getCategories(store.getState());
  const newCategories = previousCategories.filter(
    (previousCategory) => previousCategory.id !== chosenCategory.id,
  );
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categories: newCategories,
    },
  });
};

const machineWithConfig = machine.withConfig({
  actions: {
    updateCategoryForActionsModal: (_, event) => updateCategoryForActionsModal(event.category),
    removeCategoryFromState: (_, __) => removeCategoryFromState(),
  },
  services: {
    removeCategoryOfFile: (_, event) => removeCategoryOfFile(event.category),
  },
});

const CategoriesWidget = () => {
  const [current, send] = useMachine(machineWithConfig);

  const openCategoryActionsModal = (category) => {
    send('OPEN_FILE_CATEGORY_ACTIONS_MODAL', { category });
  };

  return (
    <>
      <CategoryActionsModalContainer
        isOpen={current.matches('fileCategoryActionsModal')}
        onClose={() => send('CLOSE_FILE_CATEGORY_ACTIONS_MODAL')}
        onClickRemoveCategory={(category) => {
          send('CLICK_REMOVE_CATEGORY_ACTIONS_MODAL', { category: category });
        }}
      />
      <CategoriesContainer onClickCategory={openCategoryActionsModal} />
    </>
  );
};

export default CategoriesWidget;
