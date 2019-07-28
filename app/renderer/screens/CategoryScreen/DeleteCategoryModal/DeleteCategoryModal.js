import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Button } from 'semantic-ui-react';
import { useMachine } from '@xstate/react';

import { RECEIVE_ENTITIES } from '../actionTypes';
import machine from './machine';
import queryChildCategories from '../../../query-functions/queryChildCategories';
import getSqlDriver from '../../../sqlDriver';
import { selectCategorizedFiles, deleteCategoryFromDb } from '../sqlQueries';
import store from '../../../redux/store';
import SubcategoriesContainers from './containers/SubcategoriesContainer';
import CategorizedFilesContainer from './containers/CategorizedFilesContainer';
import ConfirmationContainer from './containers/ConfirmationContainer';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {}); //TODO: Replace `{}` with null

const queryCategorizedFiles = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategorizedFiles,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const fetchSubcategories = async () => {
  const category = getCategory(store.getState());
  return queryChildCategories(category.id);
};

const isSubcategoriesEmpty = (subcategories) => {
  return subcategories.length === 0;
};

const fetchCategorizedFiles = async () => {
  const category = getCategory(store.getState());
  return queryCategorizedFiles(category.id);
};

const isCategorizedFilesEmpty = (categorizedFiles) => {
  return categorizedFiles.length === 0;
};

const queryDeleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryFromDb,
      {
        $category_id: categoryId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const deleteCategory = async () => {
  const category = getCategory(store.getState());
  return await queryDeleteCategory(category.id);
};

const updateSubcategories = (subcategories) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      subcategories: subcategories,
    },
  });
};

const updateCategorizedFiles = (categorizedFiles) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categorizedFiles: categorizedFiles,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSubcategories: (_, __) => fetchSubcategories(),
    fetchCategorizedFiles: (_, __) => fetchCategorizedFiles(),
    deleteCategory: (_, __) => deleteCategory(),
  },
  actions: {
    updateSubcategories: (_, event) => updateSubcategories(event.data),
    updateCategorizedFiles: (_, event) => updateCategorizedFiles(event.data),
  },
  guards: {
    isSubcategoriesEmpty: (_, event) => isSubcategoriesEmpty(event.data),
    isCategorizedFilesEmpty: (_, event) => isCategorizedFilesEmpty(event.data),
  },
});

const DeleteCategoryModal = ({ isOpen, onClose, onConfirmDelete }) => {
  const [current, send] = useMachine(
    machineWithConfig.withConfig({
      actions: {
        closeModal: (_, __) => onConfirmDelete(),
      },
    }),
    { devTools: true },
  );

  if (current.matches('idle')) {
    if (current.matches('idle.subcategories')) {
      return (
        <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
          <Header icon="archive" content="Delete Associated Subcategories / Files" />
          <Modal.Content>
            <SubcategoriesContainers />
          </Modal.Content>
          <Modal.Actions>
            <Button size="big" color="blue" onClick={onClose}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else if (current.matches('idle.categorized_files')) {
      return (
        <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
          <Header icon="archive" content="Delete Associated Subcategories / Files" />
          <Modal.Content>
            <CategorizedFilesContainer />
          </Modal.Content>
          <Modal.Actions>
            <Button size="big" color="blue" onClick={onClose}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else if (current.matches('idle.confirmation')) {
      return (
        <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
          <Header icon="archive" content="Delete Associated Subcategories / Files" />
          <Modal.Content>
            <ConfirmationContainer />
          </Modal.Content>
          <Modal.Actions>
            <Button size="big" color="blue" onClick={onClose}>
              Cancel
            </Button>
            <Button size="big" color="red" onClick={() => send('CLICK_CONFIRM_DELETE')}>
              Confirm
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else {
      return <h2>Unknown state</h2>;
    }
  } else if (current.matches('loading')) {
    return (
      <Modal isOpen={false}>
        <Modal.Content>Loading...</Modal.Content>
      </Modal>
    );
  } else if (current.matches('failure')) {
    return <h2 style={{ color: 'red' }}>Error: failed somehow</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

DeleteCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};

export default DeleteCategoryModal;
