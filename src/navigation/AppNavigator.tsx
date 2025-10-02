// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Mini Pokédex' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }: any) => ({
          title: route.params.pokemon.name,
          headerBackTitle: 'Lista', // iOS
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;