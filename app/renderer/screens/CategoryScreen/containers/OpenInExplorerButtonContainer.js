import { connect } from 'react-redux';

import OpenInExplorerButton from '../components/OpenInExplorerButton';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const OpenInExplorerButtonContainer = connect((state) => ({
  category: getCategory(state),
}))(OpenInExplorerButton);

export default OpenInExplorerButtonContainer;
