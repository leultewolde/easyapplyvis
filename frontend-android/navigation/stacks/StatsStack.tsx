import {createStackNavigator} from "@react-navigation/stack";
import StatsScreen from "../../screens/StatsScreen";
import React from "react";
import {JobData} from "../../types";
import JobItemScreen from "../../screens/JobItemScreen";
import JobsListScreen from "../../screens/JobsListScreen";
import CompaniesScreen from "../../screens/CompaniesScreen";
import LocationsScreen from "../../screens/LocationsScreen";

type StatStackParams = {
    StatsScreen: undefined;
    CompaniesScreen: undefined;
    LocationsScreen: undefined;
    JobsListScreen: { jobs: JobData[]; title: string };
    JobItemScreen: { job: JobData };
}

const Stack = createStackNavigator<StatStackParams>();

export default function StatsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="StatsScreen"
                options={{title: "Statistics"}}
                component={StatsScreen}/>
            <Stack.Screen
                name="JobsListScreen"
                options={({route}) => ({
                    title: route.params.title
                })}
                component={JobsListScreen}/>

            <Stack.Screen
                name="CompaniesScreen"
                options={{
                    title: "Companies",
                }}
                component={CompaniesScreen}/>

            <Stack.Screen
                name="LocationsScreen"
                options={{
                    title: "Locations"
                }}
                component={LocationsScreen}/>

            <Stack.Screen
                name="JobItemScreen"
                options={({route}) => ({
                    title: route.params.job.Position
                })}
                component={JobItemScreen}/>
        </Stack.Navigator>
    );
}