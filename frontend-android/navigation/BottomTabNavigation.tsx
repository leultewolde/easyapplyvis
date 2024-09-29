import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {MainStack, StatsStack} from "./stacks";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import JobsCalendarStack from "./stacks/JobsCalendarStack";

export default function BottomTabNavigation() {

    const Tab = createBottomTabNavigator();

    const getIconName = (route: string): string => {
        let iconName;

        if (route === 'Home') {
            iconName = 'home';
        } else if (route === 'Stats') {
            iconName = 'pie-chart';
        } else if (route === 'JobsCalendar') {
            iconName = 'calendar';
        } else {
            iconName = 'flask';
        }
        return iconName;
    }

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                    return <Icon
                        name={getIconName(route.name)}
                        size={size}
                        color={color}/>;
                },
                tabBarActiveTintColor: "#4A90E2",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen options={{headerShown: false}} name="Home" component={MainStack}/>
            <Tab.Screen name="Stats" options={{headerShown: false, title: "Statistics"}} component={StatsStack}/>
            <Tab.Screen options={{headerShown: false, title: "Calendar"}} name="JobsCalendar" component={JobsCalendarStack}/>
        </Tab.Navigator>
    )
}