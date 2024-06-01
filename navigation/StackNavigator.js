import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../screens/HomePage';
import AboutPage from '../screens/AboutPage';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Главная страница" component={HomePage} />
      <Stack.Screen name="О нас" component={AboutPage} />
    </Stack.Navigator>
  );
};

export default StackNavigator;