import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './pages/MainScreen';
import StatsScreen from './pages/StatsScreen'; // Create this screen for the stats page
import SettingsScreen from './pages/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {JobDataProvider} from "./context/JobDataContext"; // Import the icon component

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack for the MainScreen with the SettingsScreen button in the header
function MainStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={({ navigation }) => ({
                title: 'Job Tracker', // Title of the header
                headerRight: () => (
                    <Icon
                        name="settings" // Use the settings icon
                        size={24}
                        color="#4A90E2"
                        style={{ marginRight: 15 }} // Add some margin to the right
                        onPress={() => navigation.navigate('SettingsScreen')}
                    />
                ),
            })}
        />
        <Stack.Screen name="SettingsScreen" options={{title: "Settings"}} component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <JobDataProvider>
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === 'HomeScreen') {
                            iconName = 'home';
                        } else if (route.name === 'StatsScreen') {
                            iconName = 'bar-chart';
                        } else {
                            iconName = 'help';
                        }

                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "#4A90E2",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen options={{headerShown: false}} name="HomeScreen" component={MainStack} />
                <Tab.Screen name="StatsScreen" options={{title: "Stats"}} component={StatsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    </JobDataProvider>
  );
}
