import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Navigator from './src/navigator';

const App = () => {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  )
}

export default App;