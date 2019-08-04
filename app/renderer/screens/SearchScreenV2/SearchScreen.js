import { useMachine } from '@xstate/react';
import machine from './machine';

const machineWithConfig = machine.withConfig({
  actions: {
    updateResultFiles:,
    updateInputText:,
    updateChosenCategory:,
  },
  services:{
    searchWithoutFilter:,
    searchWithFilter:,
  }
})

const SearchScreen = () => {
  const [current,send] = useMachine(machineWithConfig, {devTools: true})

}

export default SearchScreen