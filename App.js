import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from './pages/HomeScreen';
import HistoryScreen from './pages/HistoryScreen';
import DetailScreen from './pages/DetailScreen';
import LoginScreen from './pages/LoginScreen';
import AboutScreen from './pages/AboutScreen';

import { AuthProvider, AuthContext } from './context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ title: 'Riwayat Absensi' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail Informasi' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'HistoryTab') {
            iconName = 'history';
          } else if (route.name === 'AboutTab') {
            iconName = 'info';
          }

          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home'
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          headerShown: false,
          tabBarLabel: 'History'
        }}
      />

      <Tab.Screen
        name="AboutTab"
        component={AboutScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'About'
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen
          name="Main"
          component={MainTabs}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}