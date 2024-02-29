import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Login from './activities/Login';
import Home from './activities/Home';
import Room from './activities/Room';
import Map from './activities/Map';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: '#888',
        tabBarActiveTintColor: '#674fa2',
        tabBarStyle: {
          borderTopColor: 'rgba(0, 0, 0, .2)',
        },
      }}>
        <Tab.Screen 
            name='Home'
            component={Home}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name="home" color={color} size={24}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Login'
            component={Login}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="log-in" color={color} size={size} />
              ),
            }}
        />
        <Tab.Screen 
            name='Map'
            component={Map}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
        />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Room"
              component={Room}
            />
          </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
      fontSize:20,
  },
});
