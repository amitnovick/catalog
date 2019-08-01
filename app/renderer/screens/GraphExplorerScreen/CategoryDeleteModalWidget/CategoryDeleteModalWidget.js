import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal as SemanticModal, Button } from 'semantic-ui-react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import queryChildCategories from '../../../query-functions/queryChildCategories';
import SubcategoriesContainers from './containers/SubcategoriesContainer';
import CategorizedFilesContainer from './containers/CategorizedFilesContainer';
import ConfirmationContainer from './containers/ConfirmationContainer';
import { assign } from 'xstate';
import queryCategorizedFiles from '../../../query-functions/queryCategorizedFilesV2';
import queryDeleteCategory from '../../../query-functions/queryDeleteCategory';
import Modal from './components/Modal';
import ReactContext from './ReactContext';
import LoadingModal from './components/LoadingModal';

const fetchSubcategories = (category) => {
  return queryChildCategories(category.id);
};

const isSubcategoriesEmpty = (subcategories) => {
  return subcategories.length === 0;
};

const fetchCategorizedFiles = (category) => {
  return queryCategorizedFiles(category.id);
};

const isCategorizedFilesEmpty = (categorizedFiles) => {
  return categorizedFiles.length === 0;
};

const deleteCategory = (category) => {
  return queryDeleteCategory(category.id);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSubcategories: (context, _) => fetchSubcategories(context.category),
    fetchCategorizedFiles: (context, _) => fetchCategorizedFiles(context.category),
    deleteCategory: (context, _) => deleteCategory(context.category),
  },
  actions: {
    updateSubcategories: assign({ subcategories: (_, event) => event.data }),
    updateCategorizedFiles: assign({ categorizedFiles: (_, event) => event.data }),
  },
  guards: {
    isSubcategoriesEmpty: (_, event) => isSubcategoriesEmpty(event.data),
    isCategorizedFilesEmpty: (_, event) => isCategorizedFilesEmpty(event.data),
  },
});

const CategoryDeleteModalWidget = ({ onClose, onConfirmDelete, category }) => {
  const [current, send, service] = useMachine(
    machineWithConfig
      .withConfig({
        actions: {
          closeModal: (_, __) => onConfirmDelete(),
        },
      })
      .withContext({
        category: category,
      }),
    { devTools: true },
  );

  if (current.matches('idle')) {
    if (current.matches('idle.subcategories')) {
      return (
        <Modal
          onClose={onClose}
          ModalHeader={
            <SemanticModal.Header>
              <Header as="h3" textAlign="center">
                {category === null ? '' : `Delete "${category.name}"`}
              </Header>
            </SemanticModal.Header>
          }
          ModalContent={
            <SemanticModal.Content>
              <ReactContext.Provider value={service}>
                <SubcategoriesContainers />
              </ReactContext.Provider>
            </SemanticModal.Content>
          }
          ModalActions={
            <SemanticModal.Actions>
              <Button size="big" color="blue" onClick={onClose}>
                Close
              </Button>
            </SemanticModal.Actions>
          }
        />
      );
    } else if (current.matches('idle.categorized_files')) {
      return (
        <Modal
          onClose={onClose}
          ModalHeader={
            <SemanticModal.Header>
              <Header as="h3" textAlign="center">
                {category === null ? '' : `Delete "${category.name}"`}
              </Header>
            </SemanticModal.Header>
          }
          ModalContent={
            <SemanticModal.Content>
              <ReactContext.Provider value={service}>
                <CategorizedFilesContainer />
              </ReactContext.Provider>
            </SemanticModal.Content>
          }
          ModalActions={
            <SemanticModal.Actions>
              <Button size="big" color="blue" onClick={onClose}>
                Close
              </Button>
            </SemanticModal.Actions>
          }
        />
      );
    } else if (current.matches('idle.confirmation')) {
      return (
        <Modal
          onClose={onClose}
          ModalHeader={
            <SemanticModal.Header>
              <Header as="h3" textAlign="center">
                {category === null ? '' : `Delete "${category.name}"`}
              </Header>
            </SemanticModal.Header>
          }
          ModalContent={
            <SemanticModal.Content>
              <ReactContext.Provider value={service}>
                <ConfirmationContainer />
              </ReactContext.Provider>
            </SemanticModal.Content>
          }
          ModalActions={
            <SemanticModal.Actions>
              <Button size="big" color="blue" onClick={onClose}>
                Cancel
              </Button>
              <Button size="big" color="red" onClick={() => send('CLICK_CONFIRM_DELETE')}>
                Confirm
              </Button>
            </SemanticModal.Actions>
          }
        />
      );
    } else {
      return <h2>Unknown state</h2>;
    }
  } else if (current.matches('loading')) {
    return <LoadingModal category={category} onClose={onClose} />;
  } else if (current.matches('failure')) {
    return <h2 style={{ color: 'red' }}>Error: failed somehow</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

CategoryDeleteModalWidget.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};

export default CategoryDeleteModalWidget;
