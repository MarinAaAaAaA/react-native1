import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import AboutPage from '../screens/AboutPage';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Главная страница" component={StackNavigator} />
      <Drawer.Screen name="О нас" component={AboutPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;