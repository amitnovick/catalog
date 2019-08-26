import React from 'react';
import PropTypes from 'prop-types';

import { useMachine } from '@xstate/react';
import { withRouter } from 'react-router-dom';
import Categories from './Categories';
import machine from './machine';
import queryDeleteFileCategory from '../../../db/queries/queryDeleteCategoryOfFsResource';
import routes from '../../../routes';

const removeCategoryOfFile = async (category, file) => {
  return await queryDeleteFileCategory(category.id, file.id);
};

const machineWithConfig = machine.withConfig({
  services: {
    removeCategoryOfFile: (context, event) => removeCategoryOfFile(event.category, context.file),
  },
});

const CategoriesWidget = ({ categories, file, refetchData, history }) => {
  const [, send] = useMachine(
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

  return (
    <>
      <Categories
        categories={categories}
        onClickRemoveCategory={(category) => {
          send('CLICKED_REMOVE_CATEGORY', { category });
        }}
        onClickRightArowCategory={(category) =>
          history.push(`${routes.TREE_EXPLORER}/${category.id}`)
        }
      />
    </>
  );
};

CategoriesWidget.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  file: PropTypes.object.isRequired,
  refetchData: PropTypes.func.isRequired,
};

export default withRouter(CategoriesWidget);
