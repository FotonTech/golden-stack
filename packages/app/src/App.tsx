import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Home from './modules/home/Home';

const App = createStackNavigator(
  {
    Home: Home,
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(App);

export default AppContainer;
