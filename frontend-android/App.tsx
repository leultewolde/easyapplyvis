import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './pages/MainScreen';
import StatsScreen from './pages/StatsScreen'; // Create this screen for the stats page
import SettingsScreen from './pages/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {JobData, JobDataProvider} from "./context/JobDataContext";
import JobsListScreen from "./pages/JobsListScreen";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import {BACKGROUND_FETCH_TASK} from "./constants";
import * as Notifications from "expo-notifications"; // Import the icon component

type MainStackParams = {
    MainScreen: undefined;
    SettingsScreen: undefined;
}
type StatStackParams = {
    StatsScreen: undefined;
    JobsListScreen: { jobs: JobData[]; title: string };
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

const Tab = createBottomTabNavigator();
const MainStackNav = createStackNavigator<MainStackParams>();
const StatStackNav = createStackNavigator<StatStackParams>();

function MainStack() {
    useEffect(() => {
        // Request notification permissions on app load
        const requestPermissions = async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for this app!');
            }
        };

        requestPermissions();
    }, []);

    useEffect(() => {
        const setupBackgroundFetch = async () => {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                minimumInterval: 15 * 60, // 15 minutes
                stopOnTerminate: false,
                startOnBoot: true,
            });
        };

        setupBackgroundFetch();

        return () => {
            BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK); // Clean up on unmount
        };
    }, []);

    return (
        <MainStackNav.Navigator>
            <MainStackNav.Screen
                name="MainScreen"
                component={MainScreen}
                options={({navigation}) => ({
                    title: 'Job Tracker', // Title of the header
                    headerRight: () => (
                        <Icon
                            name="settings" // Use the settings icon
                            size={24}
                            color="#4A90E2"
                            style={{marginRight: 15}} // Add some margin to the right
                            onPress={() => navigation.navigate('SettingsScreen')}
                        />
                    ),
                })}
            />
            <MainStackNav.Screen name="SettingsScreen" options={{title: "Settings"}} component={SettingsScreen}/>
        </MainStackNav.Navigator>
    );
}

function StatsStack() {
    return (
        <StatStackNav.Navigator>
            <StatStackNav.Screen name="StatsScreen" component={StatsScreen} options={{title: "Stats"}}/>
            <StatStackNav.Screen name="JobsListScreen" options={{title: "Jobs List"}} component={JobsListScreen}/>
        </StatStackNav.Navigator>
    );
}

export default function App() {
    return (
        <JobDataProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({route}) => ({
                        tabBarIcon: ({color, size}) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = 'home';
                            } else if (route.name === 'Stats') {
                                iconName = 'pie-chart';
                            } else {
                                iconName = 'flask';
                            }

                            return <Icon name={iconName} size={size} color={color}/>;
                        },
                        tabBarActiveTintColor: "#4A90E2",
                        tabBarInactiveTintColor: "gray",
                    })}
                >
                    <Tab.Screen options={{headerShown: false}} name="Home" component={MainStack}/>
                    <Tab.Screen name="Stats" options={{headerShown: false}} component={StatsStack}/>
                </Tab.Navigator>
            </NavigationContainer>
        </JobDataProvider>
    );
}
