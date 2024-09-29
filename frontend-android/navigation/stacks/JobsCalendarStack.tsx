import {createStackNavigator} from "@react-navigation/stack";
import StatsScreen from "../../screens/StatsScreen";
import JobsListScreen from "../../screens/JobsListScreen";
import React from "react";
import {JobData} from "../../types";
import JobsCalendar from "../../screens/JobsCalendar";
import JobItemScreen from "../../screens/JobItemScreen";

type JobsCalendarStackParams = {
    JobsCalendarScreen: undefined;
    JobsListScreen: { jobs: JobData[]; title: string };
    JobItemScreen: { job: JobData };
}

const Stack = createStackNavigator<JobsCalendarStackParams>();

export default function JobsCalendarStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="JobsCalendarScreen"
                options={{title: "Jobs Calendar"}}
                component={JobsCalendar}/>
            <Stack.Screen
                name="JobsListScreen"
                options={({route}) => ({
                    title: route.params.title
                })}
                component={JobsListScreen}/>
            <Stack.Screen
                name="JobItemScreen"
                options={({route}) => ({
                    title: route.params.job.Position
                })}
                component={JobItemScreen}/>
        </Stack.Navigator>
    );
}