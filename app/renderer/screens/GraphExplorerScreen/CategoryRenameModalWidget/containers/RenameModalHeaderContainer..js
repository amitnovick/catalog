import { connect } from 'react-redux';

import RenameModalHeader from '../components/RenameModalHeader'

const getChosenCategoryRenamingCategoryModal = (store) =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.chosenCategoryRenamingCategoryModal
    : null;

const RenameModalHeaderContainer = connect(state => ({
  category: getChosenCategoryRenamingCategoryModal(state),
}))(RenameModalHeader)

export default RenameModalHeaderContainer