import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Dimensions,Button } from 'react-native';
import Log from './Log';
import Sign from './Sign';
import Profile from './Profile';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
    <NavigationContainer style={styles.container}> 
      <AppStack />
    </NavigationContainer>
  );
}

// stacks for navigation
const Stack = createStackNavigator();

function AppStack() {
  const AuthContext = React.createContext();

  return (
    <Stack.Navigator initialRouteName="tes" screenOptions={{gestureEnabled: false,}} >
      <Stack.Screen name="log" component={Log} options={{headerShown: false}} />
      <Stack.Screen name="sign" component={Sign} options={{headerShown: false}} />
      <Stack.Screen name="profile" component={Profile} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label:{
    fontSize: 40,
  }
});


