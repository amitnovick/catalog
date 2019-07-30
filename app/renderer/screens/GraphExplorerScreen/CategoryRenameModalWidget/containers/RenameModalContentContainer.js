import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import RenameModalContent from '../components/RenameModalContent'

const getInputText = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.categoryRenameModalInputText : '';

const getErrorMessage = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.errorMessageCategoryNameWidget : ''

const RenameModalContentContainer = connect(state => ({
  inputText: getInputText(state),
  errorMessage: getErrorMessage(state)
}))(RenameModalContent)

RenameModalContent.propTypes = {
  shouldShowErrorMessage: PropTypes.bool.isRequired,
}

export default RenameModalContentContainer;