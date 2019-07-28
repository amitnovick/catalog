import React from 'react';
import CategoryNameContainer from './CategoryNameContainer';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import getSqlDriver from '../../../sqlDriver';
import { updateCategoryName } from '../sqlQueries';
import { Icon, Message } from 'semantic-ui-react';

const newCategoryNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name`;

const queryRenameCategory = (categoryId, newCategoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateCategoryName,
      {
        $category_id: categoryId,
        $category_name: newCategoryName,
      },
      function(err) {
        if (err) {
          if (err.message === newCategoryNameAlreadyExistsErrorMessage) {
            reject(new Error('Category name is taken by another category'));
          } else {
            reject(new Error(`Unknown error: ${err.message}`));
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(new Error('No affected rows error'));
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const attemptToRenameCategory = (category, newCategoryName) => {
  return queryRenameCategory(category.id, newCategoryName);
};

const updateNewCategoryName = (inputText) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newCategoryName: inputText,
    },
  });
};

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const resetNewCategoryNameToCategoryName = () => {
  const category = getCategory(store.getState());
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newCategoryName: category.name,
    },
  });
};

const isNewCategoryNameValidCategoryName = (newCategoryName) => {
  return newCategoryName.trim() !== '';
};

const machineWithConfig = machine.withConfig({
  services: {
    attemptToRenameCategory: (_, event) =>
      attemptToRenameCategory(event.category, event.newCategoryName),
  },
  actions: {
    resetNewCategoryNameToCategoryName: (_, __) => resetNewCategoryNameToCategoryName(),
    updateInputText: (_, event) => updateNewCategoryName(event.inputText),
  },
  guards: {
    isNewCategoryNameValidCategoryName: (_, event) =>
      isNewCategoryNameValidCategoryName(event.newCategoryName),
  },
});

const updateErrorMessage = (error) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      errorMessageCategoryNameWidget: error.message,
    },
  });
};

const updateErrorMessageInvalidCategoryName = () => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      errorMessageCategoryNameWidget: 'Invalid category name',
    },
  });
};

const CategoryNameWidget = ({ refetchCategoryData, errorMessage }) => {
  const [current, send] = useMachine(machineWithConfig, {
    actions: {
      refetchCategoryData: (_, __) => refetchCategoryData(),
      updateErrorMessage: (_, event) => updateErrorMessage(event.data),
      updateErrorMessageInvalidCategoryName: (_, __) => updateErrorMessageInvalidCategoryName(),
    },
  });
  return (
    <>
      <CategoryNameContainer
        onClickRenameCategory={(category, newCategoryName) =>
          send('CLICK_RENAME_CATEGORY', {
            category: category,
            newCategoryName: newCategoryName,
          })
        }
        onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
      />
      {current.matches('idle.success') ? <Icon size="big" name="checkmark" color="green" /> : null}
      {current.matches('idle.failure') ? <Icon size="big" name="remove" color="red" /> : null}
      {current.matches('idle.failure') ? <Message error content={errorMessage} /> : null}
    </>
  );
};

const getErrorMessageCategoryNameWidget = (store) =>
  store && store.categoryScreen ? store.categoryScreen.errorMessageCategoryNameWidget : '';

export default connect((state) => ({
  errorMessage: getErrorMessageCategoryNameWidget(state),
}))(CategoryNameWidget);
