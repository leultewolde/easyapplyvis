import React, {useContext} from "react";
import JobDataContext from "../../context/JobDataContext";
import MainScreen from "../../screens/MainScreen";
import Icon from "react-native-vector-icons/Ionicons";
import SettingsScreen from "../../screens/SettingsScreen";
import {createStackNavigator} from "@react-navigation/stack";
import JobItemScreen from "../../screens/JobItemScreen";
import {JobData} from "../../types";

type MainStackParams = {
    MainScreen: undefined;
    SettingsScreen: undefined;
    JobItemScreen: { job: JobData };
}

const Stack = createStackNavigator<MainStackParams>();

export default function MainStack() {
    const {jobStats} = useContext(JobDataContext);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainScreen"
                component={MainScreen}
                options={({navigation}) => ({
                    title: `Job Tracker (${jobStats.today.success.length})`,
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
            <Stack.Screen
                name="JobItemScreen"
                options={({route}) => ({
                    title: route.params.job.Position
                })}
                component={JobItemScreen}/>
            <Stack.Screen name="SettingsScreen" options={{title: "Settings"}} component={SettingsScreen}/>
        </Stack.Navigator>
    );
}