import { useMachine } from '@xstate/react';
import machine from './machine';
import { assign } from 'xstate';

const fetchData = ({ isFilterByNameEnabled, isFilterByAncestorCategoryEnabled }) => {
  if (isFilterByNameEnabled && isFilterByAncestorCategoryEnabled) {
    return Promise.resolve('ab');
  } else if (isFilterByNameEnabled) {
    return Promise.resolve('a');
  } else if (isFilterByAncestorCategoryEnabled) {
    return Promise.resolve('b');
  }
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchData: (_, __, meta) =>
      fetchData({
        isFilterByNameEnabled: meta.state.matches('filterByName.enabled'),
        isFilterByAncestorCategoryEnabled: meta.state.matches('filterByAncestorCategory.enabled'),
      }),
  },
  actions: {
    updateData: assign({
      data: (_, event) => event.data,
    }),
  },
});

const SearchScreen = () => {
  const [current, send] = useMachine(machineWithConfig, { devTools: true });
};

export default SearchScreen;
