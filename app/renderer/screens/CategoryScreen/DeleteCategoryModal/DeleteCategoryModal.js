import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Button } from 'semantic-ui-react';
import ModalContentRouter from './ModalContentRouter';
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

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

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
  console.log('fetchSubcategories: category:', category);
  const subcategories = await queryChildCategories(category.id);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      subcategories: subcategories,
    },
  });
};

const getSubcategories = (store) =>
  store && store.categoryScreen ? store.categoryScreen.subcategories : [];

const getCategorizedFiles = (store) =>
  store && store.categoryScreen ? store.categoryScreen.categorizedFiles : [];

const checkSubcategoriesEmpty = () => {
  const subcategories = getSubcategories(store.getState());
  return subcategories.length === 0 ? Promise.resolve() : Promise.reject();
};

const fetchCategorizedFiles = async () => {
  const category = getCategory(store.getState());
  const categorizedFiles = await queryCategorizedFiles(category.id);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categorizedFiles: categorizedFiles,
    },
  });
};

const checkCategorizedFilesEmpty = () => {
  //TODO: Conert to guard
  const categorizedFiles = getCategorizedFiles(store.getState());
  return categorizedFiles.length === 0 ? Promise.resolve() : Promise.reject();
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

const machineWithConfig = machine.withConfig({
  services: {
    fetchSubcategories: (_, __) => fetchSubcategories(),
    checkSubcategoriesEmpty: (_, __) => checkSubcategoriesEmpty(),
    fetchCategorizedFiles: (_, __) => fetchCategorizedFiles(),
    checkCategorizedFilesEmpty: (_, __) => checkCategorizedFilesEmpty(),
    deleteCategory: (_, __) => deleteCategory(),
  },
});

const DeleteCategoryModal = ({ isOpen, onClose, onConfirmDelete }) => {
  const [current, send] = useMachine(
    machineWithConfig.withConfig({
      actions: {
        closeModal: (_, __) => onConfirmDelete(),
      },
    }),
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
            <ConfirmationContainer
              onConfirmDelete={() => send('CLICK_CONFIRM_DELETE')}
              onCancelDelete={onClose}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={onClose}>
              Cancel
            </Button>
            <Button color="red" onClick={onConfirmDelete}>
              Confirm
            </Button>
          </Modal.Actions>
        </Modal>
      );
    } else {
      return <h2>Unknown state</h2>;
    }
  } else if (current.matches('loading')) {
    return <h2>Loading...</h2>;
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
